#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateRoundRanks() {
  try {
    // Load the team-scores data
    const scoresPath = path.resolve(__dirname, '../src/data/team-scores.json');
    const data = JSON.parse(await fs.readFile(scoresPath, 'utf8'));
    const { team_scores } = data;

    // Group scores by round_id
    const rounds = {};
    
    // First pass: collect all scores for each round
    Object.values(team_scores).forEach(scores => {
      scores.forEach(score => {
        const roundId = score.round_id;
        if (!rounds[roundId]) {
          rounds[roundId] = [];
        }
        // Only include non-zero scores in ranking
        if (score.score > 0) {
          rounds[roundId].push({
            team_id: score.team_id,
            score: score.score,
            original: score
          });
        }
      });
    });

    // Second pass: calculate ranks for each round
    Object.entries(rounds).forEach(([roundId, roundScores]) => {
      // Sort scores in descending order
      roundScores.sort((a, b) => b.score - a.score);
      
      // Assign ranks, handling ties
      let currentRank = 1;
      for (let i = 0; i < roundScores.length; i++) {
        // If this score is different from previous, update currentRank
        if (i > 0 && roundScores[i].score < roundScores[i - 1].score) {
          currentRank = i + 1;
        }
        // Update the original score object with the calculated rank
        roundScores[i].original.round_rank = currentRank;
      }
    });

    // Save the updated data back to the file
    await fs.writeFile(
      scoresPath,
      JSON.stringify({ team_scores }, null, 2),
      'utf8'
    );

    console.log('Successfully updated round ranks in team-scores.json');
  } catch (error) {
    console.error('Error updating round ranks:', error);
    process.exit(1);
  }
}

updateRoundRanks();
