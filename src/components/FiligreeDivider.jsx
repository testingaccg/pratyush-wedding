import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Scroll-triggered self-drawing Bengali Alpona divider motifs:
 * - 'lotus'  : Classic Lotus Mandala
 * - 'fish'   : Auspicious Jora Maach (Twin Fish) & Paisley
 * - 'kalash' : Sacred Kalash, Mango Leaves & Garland
 */
export default function FiligreeDivider({ variant = 'lotus' }) {
  if (variant === 'fish') {
    return (
      <div className="mx-auto flex max-w-sm items-center justify-center px-6 py-4" aria-hidden="true">
        <svg viewBox="0 0 360 110" className="h-20 w-full" fill="none">
          <motion.path
            d="M 162 55 C 132 29, 88 29, 62 55 C 88 81, 132 81, 162 55 Z M 62 55 L 38 38 Q 48 55 38 72 Z"
            stroke="#A61C24"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.85 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <motion.path
            d="M 198 55 C 228 29, 272 29, 298 55 C 272 81, 228 81, 198 55 Z M 298 55 L 322 38 Q 312 55 322 72 Z"
            stroke="#A61C24"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.85 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <motion.path
            d="M 180 12 C 194 28, 194 46, 180 55 C 166 46, 166 28, 180 12 Z M 180 98 C 194 82, 194 64, 180 55 C 166 64, 166 82, 180 98 Z"
            stroke="#C59B38"
            strokeWidth="1.3"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.9 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
          />
          <circle cx="180" cy="55" r="3" fill="#A61C24" />
        </svg>
      </div>
    );
  }

  if (variant === 'kalash') {
    return (
      <div className="mx-auto flex max-w-sm items-center justify-center px-6 py-4" aria-hidden="true">
        <svg viewBox="0 0 360 120" className="h-24 w-full" fill="none">
          <motion.path
            d="M 40 20 Q 110 50, 180 20 Q 250 50, 320 20"
            stroke="#C59B38"
            strokeWidth="1.3"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.75 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 1.2, ease: EASE }}
          />
          <motion.path
            d="M 156 58 C 138 74, 142 102, 162 110 L 198 110 C 218 102, 222 74, 204 58 Z"
            stroke="#A61C24"
            strokeWidth="1.6"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.9 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 1.3, delay: 0.15, ease: EASE }}
          />
          <motion.path
            d="M 154 58 L 206 58 M 160 50 L 200 50"
            stroke="#C59B38"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.9, delay: 0.2 }}
          />
          <motion.path
            d="M 180 50 C 170 34, 190 34, 180 50 Z M 166 50 C 148 40, 152 28, 170 43 M 194 50 C 212 40, 208 28, 190 43"
            stroke="#2D6A4F"
            strokeWidth="1.4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.85 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
          />
          <circle cx="180" cy="84" r="7" stroke="#C59B38" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  /* Default: 'lotus' */
  return (
    <div className="mx-auto flex max-w-md items-center justify-center px-6 py-4" aria-hidden="true">
      <svg viewBox="0 0 360 96" className="h-20 w-full" fill="none">
        <motion.path
          d="M16 48 Q95 16 146 48 Q95 80 16 48 Z"
          stroke="#C59B38"
          strokeWidth="1"
          strokeOpacity="0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        <motion.path
          d="M344 48 Q265 16 214 48 Q265 80 344 48 Z"
          stroke="#C59B38"
          strokeWidth="1"
          strokeOpacity="0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        {/* Central Lotus Petals */}
        <motion.path
          d="M 180 16 C 194 34, 194 54, 180 68 C 166 54, 166 34, 180 16 Z"
          stroke="#A61C24"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
        />
        <motion.path
          d="M 180 68 C 202 56, 214 38, 206 24 C 192 30, 184 46, 180 68 Z M 180 68 C 158 56, 146 38, 154 24 C 168 30, 176 46, 180 68 Z"
          stroke="#C59B38"
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
        />
        <motion.circle
          cx="180"
          cy="74"
          r="3.2"
          fill="#A61C24"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.4, delay: 0.5 }}
        />
      </svg>
    </div>
  );
}
