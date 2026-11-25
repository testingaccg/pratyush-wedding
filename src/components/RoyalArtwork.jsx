import { motion } from 'framer-motion';

/**
 * Timeless Animated Indian Heritage Wedding SVG Illustrations:
 * - palace-courtyard (Sandstone arch, swaying marigold & jasmine garlands, glowing diyas)
 * - lakeside-vows (Twilight mandap pavilion & shimmering water reflections)
 * - floral-kalash (Ceremonial brass kalash, lotus blossoms & rotating mandala)
 * - starlit-terrace (Evening reception terrace under twinkling stars & warm lanterns)
 */
export default function RoyalArtwork({ variant = 'palace-courtyard', className = '' }) {
  if (variant === 'lakeside-vows') {
    return (
      <svg viewBox="0 0 400 300" className={`h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="vowsSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B263B" />
            <stop offset="55%" stopColor="#C85A32" />
            <stop offset="100%" stopColor="#E6CA7E" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#vowsSky)" />
        <motion.circle
          cx="290"
          cy="110"
          r="36"
          fill="#FAF7F2"
          animate={{ opacity: [0.45, 0.65, 0.45] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Mandap Canopy Silhouette */}
        <path d="M55 120 Q115 88 175 120 Z" fill="#FAF7F2" opacity="0.95" />
        <rect x="65" y="120" width="8" height="70" fill="#FAF7F2" opacity="0.92" />
        <rect x="157" y="120" width="8" height="70" fill="#FAF7F2" opacity="0.92" />
        {/* Floral Garland */}
        <path d="M73 128 Q115 152 157 128" fill="none" stroke="#E8B923" strokeWidth="3.5" />
        {/* Calm Water & Shimmering Reflections */}
        <rect y="190" width="400" height="110" fill="#1B263B" opacity="0.88" />
        {[60, 140, 220, 290].map((x, i) => (
          <motion.g
            key={x}
            animate={{ opacity: [0.25, 0.7, 0.25], x: [-4, 4, -4] }}
            transition={{ duration: 3.5 + i * 0.6, repeat: Infinity }}
          >
            <line
              x1={x}
              y1={212 + i * 10}
              x2={x + 48}
              y2={212 + i * 10}
              stroke="#E6CA7E"
              strokeWidth="2"
            />
          </motion.g>
        ))}
      </svg>
    );
  }

  if (variant === 'floral-kalash') {
    return (
      <svg viewBox="0 0 320 380" className={`h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="380" fill="#A61C24" />
        {/* Rotating Floral Mandala */}
        <motion.g
          stroke="#FAF7F2"
          strokeWidth="1.2"
          fill="none"
          opacity="0.38"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '160px 175px' }}
        >
          <circle cx="160" cy="175" r="105" strokeDasharray="4 4" />
          <circle cx="160" cy="175" r="78" />
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={i}
              cx="160"
              cy="98"
              rx="12"
              ry="28"
              transform={`rotate(${i * 30} 160 175)`}
            />
          ))}
        </motion.g>
        {/* Lotus Petals */}
        <g transform="translate(160, 175)">
          {[-34, -17, 0, 17, 34].map((deg, idx) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-26"
              rx="13"
              ry="30"
              transform={`rotate(${deg})`}
              fill={idx === 2 ? '#FAF7F2' : '#E6CA7E'}
              fillOpacity={idx === 2 ? 0.92 : 0.6}
            />
          ))}
        </g>
        {/* Brass Kalash */}
        <path
          d="M126 225 Q108 258 122 288 Q160 306 198 288 Q212 258 194 225 Z"
          fill="#E6CA7E"
        />
        <rect x="136" y="212" width="48" height="14" rx="4" fill="#C59B38" />
      </svg>
    );
  }

  if (variant === 'starlit-terrace') {
    return (
      <svg viewBox="0 0 400 300" className={`h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="terraceSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B263B" />
            <stop offset="100%" stopColor="#3B4D6B" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#terraceSky)" />
        {/* Twinkling Stars */}
        {[[65, 45], [140, 32], [240, 48], [335, 36], [190, 75]].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="1.8"
            fill="#FAF7F2"
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 2.2 + i * 0.4, repeat: Infinity }}
          />
        ))}
        {/* Hanging Warm Lanterns */}
        {[95, 200, 305].map((x, i) => (
          <g key={x}>
            <line x1={x} y1="0" x2={x} y2={95 + (i % 2) * 20} stroke="#E6CA7E" strokeWidth="1.5" />
            <motion.circle
              cx={x}
              cy={108 + (i % 2) * 20}
              r="14"
              fill="#FFE699"
              animate={{ opacity: [0.65, 0.95, 0.65] }}
              transition={{ duration: 2.8 + i, repeat: Infinity }}
            />
          </g>
        ))}
        {/* Heritage Balustrade */}
        <rect y="220" width="400" height="80" fill="#131B2A" />
        <line x1="0" y1="220" x2="400" y2="220" stroke="#E6CA7E" strokeWidth="2" opacity="0.55" />
      </svg>
    );
  }

  /* Default: palace-courtyard */
  return (
    <svg viewBox="0 0 320 400" className={`h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="courtyardSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF7F2" />
          <stop offset="65%" stopColor="#F3D9C6" />
          <stop offset="100%" stopColor="#E6CA7E" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#courtyardSky)" />
      <motion.circle
        cx="160"
        cy="185"
        r="60"
        fill="#FAF7F2"
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path
        d="M0 0 H320 V400 H0 Z M44 400 V175 Q44 105 160 72 Q276 105 276 175 V400 Z"
        fill="#A61C24"
        fillRule="evenodd"
      />
      <path
        d="M44 400 V175 Q44 105 160 72 Q276 105 276 175 V400"
        fill="none"
        stroke="#FAF7F2"
        strokeWidth="2.2"
        strokeDasharray="6 4"
      />
      {[82, 120, 160, 200, 238].map((x, idx) => (
        <motion.g
          key={x}
          animate={{ rotate: [0, idx % 2 === 0 ? 1.5 : -1.5, 0] }}
          transition={{ duration: 3.6 + idx * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${x}px 78px` }}
        >
          <line x1={x} y1="78" x2={x} y2={148 + (idx % 2) * 24} stroke="#E6CA7E" strokeWidth="1.2" />
          {[0, 1, 2, 3].map((dot) => (
            <circle
              key={dot}
              cx={x}
              cy={102 + dot * 15 + (idx % 2) * 6}
              r="5"
              fill={dot % 2 === 0 ? '#FAF7F2' : '#E8B923'}
            />
          ))}
        </motion.g>
      ))}
      {[100, 160, 220].map((x, idx) => (
        <g key={x} transform={`translate(${x}, 358)`}>
          <path d="M-12 0 Q0 10 12 0 Z" fill="#C85A32" />
          <motion.path
            d="M0 -11 Q5 -4 0 1 Q-5 -4 0 -11 Z"
            fill="#FFE699"
            animate={{ scaleY: [1, 1.2, 0.92, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.4 + idx * 0.25, repeat: Infinity }}
            style={{ transformOrigin: '0px 0px' }}
          />
        </g>
      ))}
    </svg>
  );
}
