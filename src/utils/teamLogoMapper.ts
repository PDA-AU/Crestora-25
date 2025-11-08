// Map team IDs to their respective logos
import defaultClubLogo from '@/assets/logos/default-club.png';
import ausecMit from '@/assets/logos/ausec-mit.png';
import bookReadersClub from '@/assets/logos/book-readers-club-of-mit.png';
import csmit from '@/assets/logos/csmit.png';
import mitMeteorology from '@/assets/logos/mit-meteorology.png';
import mitQuill from '@/assets/logos/mit-quill.png';
import pda from '@/assets/logos/pda.png';
import quizClub from '@/assets/logos/quiz-club-of-mit.png';
import tamilMandram from '@/assets/logos/tamil-mandram.png';
import tedClub from '@/assets/logos/ted-club-of-mit.png';
import theBoxOffice from '@/assets/logos/the-box-office-of-mit.png';
import varietyTeam from '@/assets/logos/variety-team.png';
import vibes from '@/assets/logos/vibes.png';
import wildcard from '@/assets/logos/wildcard.png';

// You can customize this mapping based on team names or IDs
const teamLogoMap: Record<string, string> = {
  // Top 3 teams - customize these mappings
  'CRES-E9E31': pda, // Auto Warriors
  'CRES-1658B': csmit, // Ascenders
  'CRES-82750': tedClub, // 404 Not Found
  
  // Add more mappings as needed
  'CRES-51027': ausecMit,
  'CRES-0ED4B': bookReadersClub,
  'CRES-DE64E': mitMeteorology,
  'CRES-F0C47': mitQuill,
  'CRES-93A6F': quizClub,
  'CRES-EC4EE': tamilMandram,
  'CRES-96DA2': theBoxOffice,
};

export const getTeamLogo = (teamId: string): string => {
  return teamLogoMap[teamId] || defaultClubLogo;
};
