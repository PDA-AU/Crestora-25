import { Starfield } from '@/components/Starfield';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { PrizesSection } from '@/components/PrizesSection';
import { Timeline } from '@/components/Timeline';
import { Footer } from '@/components/Footer';
import LeaderboardTop5 from "@/components/LeaderboardTop5";
const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Starfield />
      <Header />
      <Hero />
      <PrizesSection />
      <Timeline />
      <LeaderboardTop5 />
      <Footer />
    </div>
  );
};

export default Index;
