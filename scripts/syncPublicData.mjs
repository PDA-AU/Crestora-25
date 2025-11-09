#!/usr/bin/env node
/*
  Sync local JSON data from Crestora'25 Public API
  Requirements: Node.js >= 18 (built-in fetch)

  Usage:
    node scripts/syncPublicData.mjs
*/
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://13.233.80.196:8000/api/public';
const DATA_DIR = path.resolve(__dirname, '../src/data');

async function safeReadJson(filePath, fallback = {}) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

async function writeJson(filePath, obj) {
  const content = JSON.stringify(obj, null, 2);
  await fs.writeFile(filePath, content, 'utf8');
  console.log(`Wrote ${path.relative(process.cwd(), filePath)} (${content.length} bytes)`);
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} for ${url}: ${text}`);
  }
  return res.json();
}

async function fetchTeams() {
  // Pull as many as possible in one go
  const data = await fetchJson(`${BASE_URL}/teams?skip=0&limit=1000`);
  return Array.isArray(data?.teams) ? data.teams : [];
}

async function fetchLeaderboard() {
  const data = await fetchJson(`${BASE_URL}/leaderboard?limit=100`);
  return data;
}

async function fetchRounds() {
  const data = await fetchJson(`${BASE_URL}/rounds?skip=0&limit=1000`);
  return Array.isArray(data?.rounds) ? data.rounds : [];
}

async function fetchRollingEvents() {
  const data = await fetchJson(`${BASE_URL}/rolling-events?skip=0&limit=1000`);
  return Array.isArray(data?.rolling_events) ? data.rolling_events : [];
}

async function fetchTeamScores(teamId) {
  const data = await fetchJson(`${BASE_URL}/teams/${teamId}/scores`);
  if (!Array.isArray(data?.scores)) return [];
  
  // Add round_rank to each score
  return data.scores.map(score => ({
    ...score,
    round_rank: score.rank // Add round_rank from the API response
  }));
}

async function mapAndWriteTeams(teams) {
  const teamsPath = path.join(DATA_DIR, 'teams.json');
  // Direct shape compatibility; local app expects { teams: [...] }
  await writeJson(teamsPath, { teams });
}

async function mapAndWriteTeamScores(teams) {
  const scoresPath = path.join(DATA_DIR, 'team-scores.json');

  // Limit concurrency to avoid hammering API
  const CONCURRENCY = 10;
  const queue = teams.map(t => t.team_id);
  const team_scores = {};

  async function worker() {
    while (queue.length) {
      const teamId = queue.shift();
      if (!teamId) break;
      try {
        const scores = await fetchTeamScores(teamId);
        team_scores[teamId] = scores;
        process.stdout.write('.');
      } catch (e) {
        console.warn(`\nWarning: failed to fetch scores for ${teamId}: ${e.message}`);
        team_scores[teamId] = [];
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  process.stdout.write('\n');

  await writeJson(scoresPath, { team_scores });
}

function mapRound(round) {
  // Keep API fields; eventData.json expects these keys already
  return {
    id: String(round.id),
    round_number: round.round_number,
    name: round.name,
    mode: round.mode ?? undefined,
    club: round.club,
    type: (round.type ?? round.mode ?? 'Offline'),
    date: round.date,
    description: round.description,
    extended_description: round.extended_description ?? null,
    form_link: round.form_link ?? null,
    contact: round.contact ?? null,
    venue: round.venue ?? null,
    status: round.status,
    round_code: round.round_code ?? undefined,
    is_evaluated: round.is_evaluated ?? null,
    is_frozen: round.is_frozen ?? null,
    is_wildcard: round.is_wildcard ?? false,
    criteria: round.criteria ?? [],
    max_score: round.max_score ?? null,
    min_score: round.min_score ?? null,
    avg_score: round.avg_score ?? null,
    created_at: round.created_at ?? undefined,
    updated_at: round.updated_at ?? undefined,
  };
}

function mapRollingEvent(ev) {
  return {
    id: ev.id?.toString?.() ?? ev.id,
    event_id: ev.event_id ?? null,
    event_code: ev.event_code ?? null,
    name: ev.name,
    type: ev.type,
    club: ev.club,
    date: ev.date ?? '',
    start_date: ev.start_date ?? null,
    end_date: ev.end_date ?? null,
    venue: ev.venue ?? null,
    description: ev.description,
    extended_description: ev.extended_description ?? null,
    form_link: ev.form_link ?? null,
    contact: ev.contact ?? null,
    status: ev.status ?? 'upcoming',
    created_at: ev.created_at ?? undefined,
    updated_at: ev.updated_at ?? undefined,
  };
}

async function mapAndWriteEventData(rounds, rollingEvents) {
  const eventDataPath = path.join(DATA_DIR, 'eventData.json');
  const current = await safeReadJson(eventDataPath, { event: {} });
  const next = {
    event: current.event || {},
    rounds: rounds.map(mapRound),
    rolling_events: rollingEvents.map(mapRollingEvent),
  };
  await writeJson(eventDataPath, next);
}

async function mapAndWriteLeaderboard(leaderboardData) {
  const leaderboardPath = path.join(DATA_DIR, 'leaderboard.json');
  // API already returns { leaderboard, total_teams, displayed_teams }
  await writeJson(leaderboardPath, leaderboardData);
}

async function main() {
  console.log('Syncing from', BASE_URL);

  // Ensure data dir exists
  await fs.mkdir(DATA_DIR, { recursive: true });

  const [teams, rounds, rollingEvents, leaderboardData] = await Promise.all([
    fetchTeams(),
    fetchRounds(),
    fetchRollingEvents(),
    fetchLeaderboard(),
  ]);

  console.log(`Fetched: teams=${teams.length}, rounds=${rounds.length}, rolling_events=${rollingEvents.length}, leaderboard=${leaderboardData?.leaderboard?.length ?? 0}`);

  await mapAndWriteTeams(teams);
  await mapAndWriteLeaderboard(leaderboardData);
  await mapAndWriteEventData(rounds, rollingEvents);
  await mapAndWriteTeamScores(teams);

  console.log('Sync complete.');
}

main().catch(err => {
  console.error('Sync failed:', err);
  process.exitCode = 1;
});
