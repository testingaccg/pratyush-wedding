import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Hand-drawn Bengali alpona border that draws itself as you scroll:
 * the vine traces outward from a lotus, paisley leaves fill in, and the
 * rice-paste dots appear one by one — all tied to scroll position.
 */

// Left half (mirrored for the right). Centre of the motif is x = 180.
const VINE =
  'M164 30 C146 14, 122 13, 108 27 C96 39, 76 45, 61 33 C50 24, 35 22, 27 30 C21 37, 25 45, 32 43 C37 41, 36 35, 31 35';
const VINE_INNER = 'M164 30 C150 42, 132 44, 120 36';
const LEAVES = [
  'M120 17 C114 5, 101 4, 98 11 C104 12, 113 14, 120 17 Z',
  'M76 44 C70 54, 59 56, 55 51 C61 49, 69 47, 76 44 Z',
  'M44 24 C42 14, 50 9, 55 12 C51 16, 47 20, 44 24 Z',
];
const DOTS = [
  [150, 43, 1.6], [141, 46, 1.3], [131, 47, 1.1],
  [104, 16, 1.4], [95, 20, 1.2], [86, 25, 1.4],
  [66, 52, 1.2], [50, 47, 1.5], [41, 50, 1.2], [18, 30, 1.7], [12, 30, 1.2], [7, 30, 0.9],
];

function Dot({ progress, x, y, r, i, reduced }) {
  const at = 0.25 + (i / DOTS.length) * 0.6;
  const scale = useTransform(progress, [at, at + 0.08], [0, 1]);
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={r}
      fill="#A61C24"
      style={reduced ? undefined : { scale, transformOrigin: `${x}px ${y}px`, transformBox: 'fill-box' }}
    />
  );
}

function Half({ progress, reduced, mirror }) {
  const vine = useTransform(progress, [0, 0.85], [0, 1]);
  const inner = useTransform(progress, [0.15, 0.75], [0, 1]);
  const leaf = useTransform(progress, [0.45, 0.9], [0, 0.9]);
  return (
    <g transform={mirror ? 'translate(360 0) scale(-1 1)' : undefined}>
      <motion.path
        d={VINE}
        stroke="#C59B38"
        strokeWidth="1.25"
        strokeLinecap="round"
        fill="none"
        style={reduced ? undefined : { pathLength: vine }}
      />
      <motion.path
        d={VINE_INNER}
        stroke="#C59B38"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeOpacity="0.7"
        fill="none"
        style={reduced ? undefined : { pathLength: inner }}
      />
      {LEAVES.map((d) => (
        <motion.path
          key={d}
          d={d}
          fill="#A61C24"
          fillOpacity="0.14"
          stroke="#A61C24"
          strokeWidth="0.9"
          style={reduced ? { opacity: 0.9 } : { opacity: leaf, pathLength: leaf }}
        />
      ))}
      {DOTS.map(([x, y, r], i) => (
        <Dot key={i} progress={progress} x={x} y={y} r={r} i={i} reduced={reduced} />
      ))}
    </g>
  );
}

export default function FiligreeDivider() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 98%', 'center 50%'] });
  const lotusScale = useTransform(scrollYProgress, [0, 0.35], [0.4, 1]);
  const lotusOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const lotusRotate = useTransform(scrollYProgress, [0, 1], [-30, 0]);

  return (
    <div ref={ref} className="mx-auto flex max-w-xl items-center justify-center px-4 py-6" aria-hidden="true">
      <svg viewBox="0 0 360 60" className="h-12 w-full overflow-visible sm:h-14">
        <Half progress={scrollYProgress} reduced={reduced} />
        <Half progress={scrollYProgress} reduced={reduced} mirror />

        {/* Lotus centre */}
        <motion.g
          style={
            reduced
              ? undefined
              : { scale: lotusScale, opacity: lotusOpacity, rotate: lotusRotate, transformOrigin: '180px 30px', transformBox: 'view-box' }
          }
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={i}
              cx="180"
              cy="19"
              rx="4.2"
              ry="10"
              transform={`rotate(${i * 45} 180 30)`}
              fill={i % 2 ? '#E6CA7E' : '#A61C24'}
              fillOpacity={i % 2 ? 0.55 : 0.18}
              stroke={i % 2 ? '#C59B38' : '#A61C24'}
              strokeWidth="0.8"
            />
          ))}
          <circle cx="180" cy="30" r="5.2" fill="#A61C24" stroke="#E6CA7E" strokeWidth="1.2" />
          <circle cx="180" cy="30" r="1.6" fill="#FAF7F2" />
        </motion.g>
      </svg>
    </div>
  );
}
