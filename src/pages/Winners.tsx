// src/pages/Winners.tsx (client-only, hardcoded data)
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Papa from 'papaparse'; // left in case you want to re-enable CSV parsing later
import { gsap } from 'gsap';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Starfield } from '@/components/Starfield';
import { ParticleField3D } from '@/components/ParticleField3D';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

gsap.registerPlugin();

export interface LeaderboardCresEntry {
  team_id: string;
  team_name: string;
  leader_name?: string;
  rank?: number;
  final_score?: number;
  video_url?: string;
  [k: string]: string | number | undefined;
}

/**
 * HARD-CODED DATA
 * Replace these hardcoded values if you want new data.
 */
const HARDCODED_ROWS: LeaderboardCresEntry[] = [
  {
    team_id: 't1',
    team_name: 'Nebula Ninjas',
    leader_name: 'Asha',
    rank: 1,
    final_score: 982,
    video_url: '', // optional clip url
    round_1: 320,
    round_2: 330,
    round_3: 332,
  },
  {
    team_id: 't2',
    team_name: 'Cosmic Coders',
    leader_name: 'Ravi',
    rank: 2,
    final_score: 945,
    video_url: '',
    round_1: 310,
    round_2: 320,
    round_3: 315,
  },
  {
    team_id: 't3',
    team_name: 'Stellar Squad',
    leader_name: 'Isha',
    rank: 3,
    final_score: 820,
    video_url: '',
    round_1: 270,
    round_2: 275,
    round_3: 275,
  },
  {
    team_id: 't4',
    team_name: 'Orbit Ops',
    leader_name: 'Samar',
    rank: 4,
    final_score: 760,
    video_url: '',
    round_1: 240,
    round_2: 260,
    round_3: 260,
  },
  {
    team_id: 't5',
    team_name: 'Photon Phantoms',
    leader_name: 'Meera',
    rank: 5,
    final_score: 720,
    video_url: '',
    round_1: 230,
    round_2: 245,
    round_3: 245,
  },
  {
    team_id: 't6',
    team_name: 'Gravity Gurus',
    leader_name: 'Karan',
    rank: 6,
    final_score: 680,
    video_url: '',
    round_1: 210,
    round_2: 230,
    round_3: 240,
  },
];

function detectRoundKeys(rows: LeaderboardCresEntry[]) {
  const roundKeySet = new Set<string>();
  rows.forEach(row => {
    Object.keys(row).forEach(k => {
      if (/^round_\d+/i.test(k)) roundKeySet.add(k);
    });
  });
  return Array.from(roundKeySet).sort((a, b) => {
    const na = Number(a.replace(/^round_/i, '')), nb = Number(b.replace(/^round_/i, ''));
    return (isFinite(na) && isFinite(nb)) ? na - nb : a.localeCompare(b);
  });
}

function buildChartDataFromRounds(rows: LeaderboardCresEntry[], roundKeys: string[], topTeamIds: string[]) {
  if (!roundKeys.length) return [];

  const chartData: any[] = [];

  for (const rKey of roundKeys) {
    const scores = rows.map(row => {
      const raw = row[rKey];
      const num = raw === undefined || raw === null || raw === '' ? null : Number(raw);
      return { id: String(row.team_id), score: Number.isFinite(num) ? (num as number) : null };
    });

    // higher score -> better rank
    const sorted = scores.slice().sort((a, b) => {
      if (a.score === null && b.score === null) return 0;
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return b.score - a.score;
    });

    const rankMap: Record<string, number | null> = {};
    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      if (s.score === null) rankMap[s.id] = null;
      else {
        if (i > 0 && sorted[i - 1].score !== null && s.score === sorted[i - 1].score) {
          rankMap[s.id] = currentRank;
        } else {
          currentRank = i + 1;
          rankMap[s.id] = currentRank;
        }
      }
    }

    const roundLabel = rKey.replace('_', ' ').replace(/\bround\b/i, 'Round ');
    const point: any = { round: roundLabel };
    topTeamIds.forEach(id => { point[`team_${id}`] = rankMap[id] ?? null; });
    chartData.push(point);
  }

  return chartData;
}

export default function WinnersPageClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Use the hardcoded rows
  const [rows] = useState<LeaderboardCresEntry[]>(HARDCODED_ROWS);
  const [roundKeys, setRoundKeys] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<LeaderboardCresEntry | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartTeamIds, setChartTeamIds] = useState<string[]>([]);
  const [revealed, setRevealed] = useState({ third: false, runner: false, winner: false });
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, { opacity: 0, duration: 0.9, ease: 'power2.out' });
    }, containerRef);

    // detect round keys from hardcoded rows
    const rk = detectRoundKeys(rows);
    setRoundKeys(rk);

    // top 5 ids
    const finalSorted = rows.slice().sort((a, b) => Number(a.rank ?? 9999) - Number(b.rank ?? 9999));
    const top5 = finalSorted.slice(0, 5);
    const topIds = top5.map(r => String(r.team_id));
    setChartTeamIds(topIds);

    // build chart
    const data = buildChartDataFromRounds(rows, rk, topIds);
    setChartData(data.length ? data : topIds.map((id, idx) => ({ round: 'Final', [`team_${id}`]: idx + 1 })));

    return () => ctx.revert();
  }, [rows]);

  useEffect(() => {
    if (!chartData.length) return;
    const id = setInterval(() => setActiveRoundIndex(i => (i + 1) % chartData.length), 2200);
    return () => clearInterval(id);
  }, [chartData]);

  const podium = rows.slice().sort((a, b) => Number(a.rank ?? 9999) - Number(b.rank ?? 9999)).slice(0, 3);

  const openModalFor = (row: LeaderboardCresEntry) => { setActiveRow(row); setModalOpen(true); };

  const handleReveal = (which: 'third' | 'runner' | 'winner') => {
    setRevealed(prev => ({ ...prev, [which]: true }));
    const idxMap = { third: 0, runner: 1, winner: 2 } as const;
    const btn = containerRef.current?.querySelectorAll('.reveal-btn')[idxMap[which]];
    if (btn) gsap.fromTo(btn, { y: 36, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power4.out' });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <Starfield />
      <ParticleField3D />
      <Header />

      <main className="relative z-10 pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4">

          {/* Finalists */}
          <section className="py-8">
            <h2 className="font-orbitron text-3xl text-[hsl(var(--space-gold))] mb-6">Finalists</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {rows.slice().sort((a,b) => Number(a.rank ?? 9999) - Number(b.rank ?? 9999)).slice(0,6).map((r, i) => (
                <button
                  key={r.team_id ?? `team-${i}`}
                  onClick={() => openModalFor(r)}
                  className="relative w-72 md:w-80 bg-gradient-to-br from-background/60 to-background/20 backdrop-blur-md border border-border rounded-2xl p-4 text-left hover:scale-[1.02] transform transition-transform duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[hsl(var(--space-cyan))] to-[hsl(var(--space-violet))] flex items-center justify-center text-background font-bold text-lg">{i+1}</div>
                    <div className="flex-1">
                      <h3 className="font-orbitron font-bold text-lg">{r.team_name}</h3>
                      <p className="text-xs text-muted-foreground">Led by {r.leader_name}</p>
                    </div>
                    <div className="ml-2 self-center opacity-80 text-sm text-muted-foreground">View</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Reveals */}
          <section className="py-8" aria-labelledby="reveal-heading">
            <h2 id="reveal-heading" className="font-orbitron text-3xl text-[hsl(var(--space-cyan))] mb-4">Ceremony Reveals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="reveal-btn bg-gradient-to-br from-background/60 to-background/20 border border-border rounded-2xl p-4">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">3rd Place</h3>
                {revealed.third ? (podium[2] ? <>
                  <div className="font-orbitron font-bold text-lg">{podium[2].team_name}</div>
                  <div className="text-xs text-muted-foreground">Led by {podium[2].leader_name}</div>
                </> : <div className="text-sm text-muted-foreground">No data</div>) : (
                  <Button onClick={() => handleReveal('third')}>Reveal 3rd Place</Button>
                )}
              </div>

              <div className="reveal-btn bg-gradient-to-br from-background/60 to-background/20 border border-border rounded-2xl p-4">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Runner-up</h3>
                {revealed.runner ? (podium[1] ? <>
                  <div className="font-orbitron font-bold text-lg">{podium[1].team_name}</div>
                  <div className="text-xs text-muted-foreground">Led by {podium[1].leader_name}</div>
                </> : <div className="text-sm text-muted-foreground">No data</div>) : (
                  <Button onClick={() => handleReveal('runner')}>Reveal Runner-up</Button>
                )}
              </div>

              <div className="reveal-btn bg-gradient-to-br from-background/60 to-background/20 border border-border rounded-2xl p-4">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Winner</h3>
                {revealed.winner ? (podium[0] ? <>
                  <div className="font-orbitron font-bold text-lg text-[hsl(var(--space-gold))]">{podium[0].team_name}</div>
                  <div className="text-xs text-muted-foreground">Led by {podium[0].leader_name}</div>
                </> : <div className="text-sm text-muted-foreground">No data</div>) : (
                  <Button onClick={() => handleReveal('winner')}>Reveal Winner</Button>
                )}
              </div>
            </div>
          </section>

          {/* Chart */}
          <section className="py-8">
            <h2 className="font-orbitron text-3xl text-[hsl(var(--space-violet))] mb-4">Rank changes per round (Top 5)</h2>
            <div className="bg-background/40 border border-border rounded-2xl p-4">
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
                  <XAxis dataKey="round" stroke="rgba(255,255,255,0.8)" />
                  <YAxis reversed allowDecimals={false} stroke="rgba(255,255,255,0.8)" />
                  <Tooltip />
                  <Legend />
                  {chartTeamIds.map((tid, idx) => {
                    const palette = ['#FFD700', '#00FFFF', '#FF1493', '#8B5CF6', '#7CFC00'];
                    return (
                      <Line key={tid ?? `line-${idx}`} type="monotone" dataKey={`team_${tid}`} stroke={palette[idx % palette.length]} strokeWidth={2} dot={{ r: 4 }} isAnimationActive animationDuration={900} connectNulls />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-3 text-xs text-muted-foreground grid grid-cols-2 md:grid-cols-5 gap-2">
                {chartTeamIds.map((tid, idx) => (
                  <div key={tid ?? `legend-${idx}`} className="flex items-center gap-2">
                    <div style={{ width: 10, height: 10, background: ['#FFD700','#00FFFF','#FF1493','#8B5CF6','#7CFC00'][idx], borderRadius: 4 }} />
                    <div className="truncate text-[13px]">{rows.find(r => r.team_id === tid)?.team_name ?? tid}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-muted-foreground">Animating round: <span className="font-medium">{chartData[activeRoundIndex]?.round ?? '—'}</span></div>
            </div>
          </section>

        </div>
      </main>

      <Footer />

      <Modal open={modalOpen} onOpenChange={(v) => { if (!v) setModalOpen(false); }}>
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
          <h3 className="font-orbitron text-2xl mb-2">{activeRow?.team_name}</h3>
          <p className="text-sm text-muted-foreground mb-4">Leader: {activeRow?.leader_name}</p>

          {activeRow?.video_url ? (
            <video controls src={activeRow.video_url} className="w-full h-64 md:h-96 object-cover bg-black rounded-md" />
          ) : (
            <div className="w-full h-64 md:h-96 flex items-center justify-center p-6 bg-black/40 rounded-md">
              <div className="text-center text-muted-foreground">
                <p className="mb-2">No clip found for this team.</p>
                <p className="text-xs">Add a <code>video_url</code> field in the hardcoded rows if you want a clip.</p>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end"><Button onClick={() => setModalOpen(false)}>Close</Button></div>
        </div>
      </Modal>
    </div>
  );
}
