import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';

export default function MusicToggle({ isPlaying, onToggle }) {
  // `null` = guest hasn't chosen yet (before the doors open) — leave SFX on.
  useEffect(() => {
    if (isPlaying === null) return;
    soundEngine.setEnabled(isPlaying);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex items-center gap-2.5">
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 18, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 18, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="hidden sm:flex items-center gap-2.5 rounded-full border border-kansa/55 bg-sindoor/95 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory shadow-xl backdrop-blur-md"
          >
            {/* Equalizer bars */}
            <span className="flex items-end gap-0.5 h-3">
              {[0, 1, 2].map((b) => (
                <motion.span
                  key={b}
                  animate={{ height: ['35%', '100%', '45%'] }}
                  transition={{
                    duration: 0.75 + b * 0.18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-0.5 rounded-full bg-kansa-light"
                />
              ))}
            </span>
            <Music className="h-3.5 w-3.5 text-kansa-light" />
            <span>{WEDDING_DATA.couple.musicLabel || 'Wedding Song'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        onClick={onToggle}
        aria-label={isPlaying ? 'Mute music and sounds' : 'Play music and sounds'}
        aria-pressed={!!isPlaying}
        className="group relative flex h-12 w-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kansa focus-visible:ring-offset-2 focus-visible:ring-offset-ivory items-center justify-center rounded-full border border-kansa/70 bg-sindoor text-kansa-light shadow-xl"
      >
        {isPlaying && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full border border-kansa/45 animate-ping opacity-40 motion-reduce:hidden" />
        )}
        {isPlaying ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5 opacity-80" />
        )}
      </motion.button>
    </div>
  );
}
