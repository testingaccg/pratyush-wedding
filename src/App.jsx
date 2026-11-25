import { useState } from 'react';
import { motion } from 'framer-motion';
import AmbientCanvas from './components/AmbientCanvas';
import ShubhoDrishtiIntro from './components/ShubhoDrishtiIntro';
import Navbar from './components/Navbar';
import MusicToggle from './components/MusicToggle';
import HeroSection from './components/HeroSection';
import SacredThreadEvents from './components/SacredThreadEvents';
import AttirePalette from './components/AttirePalette';
import FiligreeDivider from './components/FiligreeDivider';
import StoryGallery from './components/StoryGallery';
import GuestConcierge from './components/GuestConcierge';
import RsvpSection from './components/RsvpSection';
import CoutureCrest from './components/CoutureCrest';
import { WEDDING_DATA } from './data/weddingData';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const handleEnter = () => {
    setEntered(true);
    setMusicPlaying(true);
  };

  return (
    <div className="relative min-h-screen bg-ivory text-ink">
      <AmbientCanvas />

      {!entered && <ShubhoDrishtiIntro onEnter={handleEnter} />}

      {entered && <Navbar />}

      <MusicToggle
        isPlaying={musicPlaying}
        onToggle={() => setMusicPlaying((p) => !p)}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <HeroSection />
        <SacredThreadEvents />
        <FiligreeDivider />
        <AttirePalette />
        <StoryGallery />
        <GuestConcierge />
        <FiligreeDivider />
        <RsvpSection />
      </motion.main>

      <footer className="relative border-t border-kansa/45 bg-sindoor pb-24 pt-12 text-center text-ivory sm:pb-20">
        <CoutureCrest light className="mx-auto mb-2 h-14 w-36" />
        <p className="font-script text-4xl text-ivory sm:text-5xl">
          {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
        </p>
        <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.26em] text-kansa-light">
          {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city} · Made with love
        </p>
      </footer>
    </div>
  );
}
