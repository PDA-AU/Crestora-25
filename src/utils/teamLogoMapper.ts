// Map team IDs to their respective logos
import pda from '@/assets/logos/pda.png';
import csmit from '@/assets/logos/csmit.png';
import tedClub from '@/assets/logos/ted-club-of-mit.png';
import ausecMit from '@/assets/logos/ausec-mit.png';
import bookReadersClub from '@/assets/logos/book-readers-club-of-mit.png';
import mitMeteorology from '@/assets/logos/mit-meteorology.png';
import mitQuill from '@/assets/logos/mit-quill.png';
import quizClub from '@/assets/logos/quiz-club-of-mit.png';
import tamilMandram from '@/assets/logos/tamil-mandram.png';
import theBoxOffice from '@/assets/logos/the-box-office-of-mit.png';
import varietyTeam from '@/assets/logos/variety-team.png';
import vibes from '@/assets/logos/vibes.png';
import wildcard from '@/assets/logos/wildcard.png';
import defaultClubLogo from '@/assets/logos/default-club.png';

// Map team IDs to their logos
const teamLogoMap: Record<string, string> = {
  // Top 3 teams
  'CRES-E9E31': pda,        // Auto Warriors - Rank 1
  'CRES-1658B': csmit,      // Ascenders - Rank 2
  'CRES-82750': tedClub,    // 404 Not Found - Rank 3
  
  // Other teams
  'CRES-51027': ausecMit,
  'CRES-0ED4B': bookReadersClub,
  'CRES-DE64E': mitMeteorology,
  'CRES-F0C47': mitQuill,
  'CRES-93A6F': quizClub,
  'CRES-EC4EE': tamilMandram,
  'CRES-96DA2': theBoxOffice,
  'CRES-17B89': varietyTeam,
  'CRES-865AB': vibes,
  'CRES-14AF5': wildcard,
};

export const getTeamLogo = (teamId: string): string => {
  const logo = teamLogoMap[teamId];
  console.log('Getting logo for:', teamId, '- Result:', logo ? 'Found' : 'Using default');
  return logo || defaultClubLogo;
};
