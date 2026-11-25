import { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import AmbientCanvas from './components/AmbientCanvas';
import ShubhoDrishtiIntro from './components/ShubhoDrishtiIntro';
import Navbar from './components/Navbar';
import MusicToggle from './components/MusicToggle';
import HeroSection from './components/HeroSection';
import SacredThreadEvents from './components/SacredThreadEvents';
import AttirePalette from './components/AttirePalette';
import FiligreeDivider from './components/FiligreeDivider';
import StoryGallery from './components/StoryGallery';
import CoupleQuiz from './components/CoupleQuiz';
import GuestConcierge from './components/GuestConcierge';
import RsvpSection from './components/RsvpSection';
import CoutureCrest from './components/CoutureCrest';
import Toaster from './components/Toaster';
import PetalButton from './components/PetalButton';
import HostLinkMaker from './components/HostLinkMaker';
import { IS_HOST } from './utils/guest';
import { WEDDING_DATA } from './data/weddingData';

export default function App() {
  const [entered, setEntered] = useState(false);
  // null = undecided (before the doors open). The door tap itself starts the
  // music inside the user gesture via soundEngine.beginCelebration().
  const [musicPlaying, setMusicPlaying] = useState(null);

  const handleEnter = () => {
    setEntered(true);
    setMusicPlaying(true);
  };

  return (
    // reducedMotion="user": framer-motion drops transform/layout animation for
    // guests with `prefers-reduced-motion: reduce`.
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-ivory text-ink">
        <AmbientCanvas />

        {!entered && <ShubhoDrishtiIntro onEnter={handleEnter} />}

        {entered && <Navbar />}
        {entered && <PetalButton />}

        <MusicToggle isPlaying={musicPlaying} onToggle={() => setMusicPlaying((p) => !p)} />
        <Toaster />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: entered ? 1 : 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          {...(!entered ? { inert: '', 'aria-hidden': true } : {})}
        >
          <HeroSection />
          <SacredThreadEvents />
          <FiligreeDivider />
          <AttirePalette />
          <StoryGallery />
          <FiligreeDivider />
          <CoupleQuiz />
          <GuestConcierge />
          <FiligreeDivider />
          <RsvpSection />
          {IS_HOST && <HostLinkMaker />}
        </motion.main>

        <footer className="relative border-t border-kansa/45 bg-sindoor pb-28 pt-12 text-center text-ivory sm:pb-20">
          <CoutureCrest light className="mx-auto mb-2 h-14 w-36" />
          <p className="font-script text-4xl text-ivory sm:text-5xl">
            {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
          </p>
          {WEDDING_DATA.couple.bengaliNames && (
            <p lang="bn" className="mt-1 font-bengali text-lg text-kansa-light">
              {WEDDING_DATA.couple.bengaliNames}
            </p>
          )}
          <p className="mt-2 px-4 font-sans text-[11px] uppercase tracking-[0.26em] text-kansa-light">
            {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city} · Made with love
          </p>
        </footer>
      </div>
    </MotionConfig>
  );
}
