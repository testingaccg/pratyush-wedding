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
import CoutureCrest from './components/CoutureCrest';
import Toaster from './components/Toaster';
import PetalButton from './components/PetalButton';
import HostLinkMaker from './components/HostLinkMaker';
import { IS_HOST } from './utils/guest';
import { soundEngine } from './utils/soundEngine';
import { toast } from './utils/toast';
import { WEDDING_DATA } from './data/weddingData';
import { LangProvider } from './context/LangContext';

export default function App() {
  const [entered, setEntered] = useState(false);
  // null = undecided (before the doors open). The door tap itself starts the
  // music inside the user gesture via soundEngine.beginCelebration().
  const [musicPlaying, setMusicPlaying] = useState(null);
  const [tattwaKey, setTattwaKey] = useState(0);

  const handleEnter = () => {
    setEntered(true);
    setMusicPlaying(true);
  };

  const launchTattwa = () => {
    setTattwaKey((k) => k + 1);
    soundEngine.playHoludSplash();
    window.dispatchEvent(new CustomEvent('wedding-petal-burst'));
    toast('শুভ তত্ত্ব · Tattwa Ilish brings sweet blessings ✦');
  };

  return (
    <LangProvider>
    <MotionConfig reducedMotion="never">
      <div className="relative min-h-screen bg-ivory text-ink">
        {/* Subtle Handmade Cotton Deckle Paper Grain Overlay */}
        <svg className="paper-grain" aria-hidden="true">
          <filter id="cottonPaperNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cottonPaperNoise)" />
        </svg>

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
          <FiligreeDivider variant="lotus" />
          <AttirePalette />
          <StoryGallery />
          <FiligreeDivider variant="lotus" />
          <CoupleQuiz />
          <FiligreeDivider variant="kalash" />
          <GuestConcierge />
          {IS_HOST && <HostLinkMaker />}
        </motion.main>

        <footer className="relative overflow-hidden border-t border-kansa/45 bg-sindoor pb-28 pt-12 text-center text-ivory sm:pb-20">
          {tattwaKey > 0 && (
            <div key={tattwaKey} className="tattwa-glide pointer-events-none absolute bottom-6 left-0 z-10 w-36" aria-hidden="true">
              <svg viewBox="0 0 220 130" className="h-auto w-full drop-shadow-md">
                <g transform="translate(128, 8) rotate(12)">
                  <path d="M 14 34 L 22 4 L 30 34 Z" fill="#FFFFFF" stroke="#E6CA7E" strokeWidth="1.6" />
                  <ellipse cx="22" cy="34" rx="13" ry="4" fill="#FAF7F2" stroke="#E6CA7E" strokeWidth="1.4" />
                  <circle cx="22" cy="4" r="2.5" fill="#A61C24" />
                </g>
                <path d="M 48 76 C 78 40, 148 38, 192 74 C 148 110, 78 108, 48 76 Z" fill="#FAF7F2" stroke="#E6CA7E" strokeWidth="2.2" />
                <path d="M 48 76 L 16 54 Q 28 76 16 98 Z" fill="#E6CA7E" stroke="#FAF7F2" strokeWidth="1.6" />
                <circle cx="164" cy="68" r="3.6" fill="#2A2320" />
                <path d="M 176 80 Q 182 84 187 79" fill="none" stroke="#A61C24" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          )}

          <button
            type="button"
            onClick={launchTattwa}
            aria-label="Celebrate with Tattwa blessings"
            className="mx-auto inline-block rounded-full p-1 transition-transform hover:scale-105 active:scale-95"
          >
            <CoutureCrest light className="h-14 w-36" />
          </button>

          <p className="px-3 py-1 font-script text-4xl leading-[1.2] text-ivory sm:text-5xl">
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
    </LangProvider>
  );
}
