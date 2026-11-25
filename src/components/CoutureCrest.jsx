import { motion } from 'framer-motion';

/**
 * Delicate letterpress-style botanical wedding crest for Pratyush & Pratyusha.
 */
export default function CoutureCrest({ className = 'h-20 w-44', light = false }) {
  const stroke = light ? '#E6CA7E' : '#C59B38';
  const accent = light ? '#FAF7F2' : '#A61C24';

  return (
    <svg
      viewBox="0 0 220 90"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* Left & Right Laurel Botanical Sprigs */}
      <motion.path
        d="M82 45 C64 45, 48 36, 30 45 C48 54, 64 45, 82 45 Z"
        stroke={stroke}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.path
        d="M138 45 C156 45, 172 36, 190 45 C172 54, 156 45, 138 45 Z"
        stroke={stroke}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      {/* Delicate Leaves */}
      {[42, 56, 70].map((x, idx) => (
        <g key={x} stroke={stroke} strokeWidth="0.9">
          <path d={`M${x} 43 Q${x - 4} ${32 - idx * 1.5} ${x + 3} ${29 - idx}`} />
          <path d={`M${220 - x} 43 Q${220 - x + 4} ${32 - idx * 1.5} ${220 - x - 3} ${29 - idx}`} />
        </g>
      ))}
      {/* Center Oval Medallion */}
      <ellipse cx="110" cy="45" rx="28" ry="32" stroke={stroke} strokeWidth="1.2" />
      <ellipse cx="110" cy="45" rx="23" ry="27" stroke={accent} strokeWidth="0.7" strokeDasharray="2 2" />
      <circle cx="110" cy="11" r="2.2" fill={stroke} />
      <circle cx="110" cy="79" r="2.2" fill={stroke} />
      <text
        x="110"
        y="50"
        textAnchor="middle"
        fill={accent}
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="16"
        fontWeight="600"
        letterSpacing="2"
      >
        P · P
      </text>
    </svg>
  );
}
