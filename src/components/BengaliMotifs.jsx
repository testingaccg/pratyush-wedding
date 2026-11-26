import { motion } from 'framer-motion';

/**
 * Animated Bengali Alpona Mandala (traditional rice-paste & sindoor floor art).
 * Gently rotates and pulses.
 */
export function AlponaMandala({ className = 'h-64 w-64', opacity = 0.22, duration = 80 }) {
  const reduced = false;

  return (
    <motion.svg
      viewBox="0 0 240 240"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity, willChange: 'transform' }}
      fill="none"
      aria-hidden="true"
      animate={reduced ? undefined : { rotate: 360 }}
      transition={reduced ? undefined : { duration, repeat: Infinity, ease: 'linear' }}
    >
      {/* Outer scalloped rice-paste ring */}
      <circle cx="120" cy="120" r="112" stroke="#C59B38" strokeWidth="0.9" strokeDasharray="3 5" />
      <circle cx="120" cy="120" r="102" stroke="#A61C24" strokeWidth="1.1" />

      {/* 16 outer kolka (paisley/mango) petals */}
      {Array.from({ length: 16 }).map((_, i) => (
        <g key={`outer-${i}`} transform={`rotate(${i * 22.5} 120 120)`}>
          <path
            d="M120 18 C127 28, 129 40, 120 48 C111 40, 113 28, 120 18 Z"
            fill="#A61C24"
            fillOpacity="0.1"
            stroke="#A61C24"
            strokeWidth="0.9"
          />
          <circle cx="120" cy="12" r="1.8" fill="#C59B38" />
        </g>
      ))}

      {/* Middle dashed alpona ring */}
      <circle cx="120" cy="120" r="70" stroke="#C59B38" strokeWidth="1" strokeDasharray="2 3" />

      {/* 8 inner lotus petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`inner-${i}`} transform={`rotate(${i * 45} 120 120)`}>
          <path
            d="M120 52 C131 68, 131 86, 120 96 C109 86, 109 68, 120 52 Z"
            fill="#E6CA7E"
            fillOpacity="0.22"
            stroke="#C59B38"
            strokeWidth="1.1"
          />
          <circle cx="120" cy="76" r="2" fill="#A61C24" />
        </g>
      ))}

      {/* Innermost bindu & sindoor ring */}
      <circle cx="120" cy="120" r="24" stroke="#A61C24" strokeWidth="1.1" fill="#FAF7F2" fillOpacity="0.4" />
      <circle cx="120" cy="120" r="16" stroke="#C59B38" strokeWidth="0.8" strokeDasharray="2 2" />
      <circle cx="120" cy="120" r="5" fill="#A61C24" />
    </motion.svg>
  );
}

/**
 * Traditional Bengali Topor (Groom's shola-pith crown) & Mukut (Bride's crown)
 * flanking a Mangalik Paan Pata (betel leaf) & Shankha (conch shell).
 */
export function ToporMukutEmblem({ className = 'h-16 w-44' }) {
  const reduced = false;

  return (
    <motion.svg
      viewBox="0 0 220 76"
      className={className}
      fill="none"
      aria-hidden="true"
      initial={reduced ? undefined : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left: Groom's Topor */}
      <g transform="translate(26, 8)">
        <path
          d="M28 8 L33 20 L42 36 L44 50 H12 L14 36 L23 20 Z"
          fill="#FAF7F2"
          stroke="#C59B38"
          strokeWidth="1.3"
        />
        <path d="M12 50 Q28 55 44 50" stroke="#A61C24" strokeWidth="1.8" />
        <path d="M16 38 H40 M19 28 H37" stroke="#C59B38" strokeWidth="0.8" strokeDasharray="2 2" />
        <circle cx="28" cy="6" r="2.5" fill="#A61C24" />
        <path d="M28 10 V18" stroke="#C59B38" strokeWidth="1" />
        {/* Kodom/floral side tassel */}
        <circle cx="10" cy="48" r="2.2" fill="#E6CA7E" stroke="#C59B38" strokeWidth="0.6" />
        <circle cx="46" cy="48" r="2.2" fill="#E6CA7E" stroke="#C59B38" strokeWidth="0.6" />
      </g>

      {/* Centre: Sacred Paan Pata (Betel Leaf) & Sindoor Bindu */}
      <motion.g
        transform="translate(88, 10)"
        animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
        transition={reduced ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M22 4 C10 14, 4 28, 8 42 C11 52, 22 56, 22 56 C22 56, 33 52, 36 42 C40 28, 34 14, 22 4 Z"
          fill="#2D6A4F"
          fillOpacity="0.16"
          stroke="#2D6A4F"
          strokeWidth="1.2"
        />
        <path d="M22 8 V54" stroke="#2D6A4F" strokeWidth="0.8" opacity="0.7" />
        <path d="M22 24 Q14 28 11 33 M22 24 Q30 28 33 33 M22 36 Q15 40 13 44 M22 36 Q29 40 31 44" stroke="#2D6A4F" strokeWidth="0.6" opacity="0.6" />
        <circle cx="22" cy="30" r="4" fill="#A61C24" />
        <circle cx="22" cy="30" r="1.4" fill="#E6CA7E" />
      </motion.g>

      {/* Right: Bride's Mukut */}
      <g transform="translate(138, 12)">
        <path
          d="M12 46 C12 30, 18 18, 28 14 C38 18, 44 30, 44 46 Z"
          fill="#FAF7F2"
          stroke="#C59B38"
          strokeWidth="1.3"
        />
        <path d="M10 46 Q28 52 46 46" stroke="#A61C24" strokeWidth="1.8" />
        <path d="M16 36 Q28 24 40 36" stroke="#C59B38" strokeWidth="0.9" />
        <circle cx="28" cy="11" r="2.6" fill="#A61C24" />
        <circle cx="20" cy="22" r="1.4" fill="#C59B38" />
        <circle cx="36" cy="22" r="1.4" fill="#C59B38" />
      </g>

      {/* Connecting golden filigree */}
      <path d="M74 42 Q82 38 88 42 M132 42 Q138 38 146 42" stroke="#C59B38" strokeWidth="0.9" strokeDasharray="2 2" />
    </motion.svg>
  );
}

/**
 * Animated Shankha (Conch) icon for interactive blessings or headings.
 */
export function ShankhaIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 21 C6 13, 12 6, 20 6 C24 6, 26 9, 26 12 C26 17, 21 22, 14 25 L8 26 Z"
        fill="#FAF7F2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 10 C15 11, 18 14, 19 19 M16 7 C19 9, 21 12, 22 16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="21" cy="11" r="1.3" fill="#A61C24" />
    </svg>
  );
}
