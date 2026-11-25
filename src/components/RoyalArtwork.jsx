import { useId } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/**
 * Layered fine-art Indian heritage wedding illustrations.
 *  - palace-courtyard : cusped jharokha arch in a carved jali wall, toran garlands, lattice shadow, diyas
 *  - lakeside-vows    : twilight mandap at a ghat, distant palace, moon glow & live water reflection
 *  - floral-kalash    : brass purna-kumbha with mango leaves & coconut before a turning mandala
 *  - starlit-terrace  : night terrace with string lights, glowing lanterns, jharokha walls & balustrade
 *
 * Every <defs> id is prefixed with useId() so many instances can render at once.
 * `interactive` enables a subtle pointer parallax (bg layer ±6px, fg layer ±12px).
 * Reduced motion: no parallax and no looping animation.
 */

const PALETTE = {
  sindoor: '#A61C24',
  sindoorDeep: '#781117',
  kansa: '#C59B38',
  kansaLight: '#E6CA7E',
  kansaMuted: '#8F6D22',
  ivory: '#FAF7F2',
  cream: '#F3ECE1',
  terracotta: '#C85A32',
  indigo: '#1B263B',
  marigold: '#E8B923',
  leaf: '#2D6A4F',
};

// Pre-rendered paper / stone grain (rasterised once by the browser as an image, then tiled)
const GRAIN_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.16 0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0.9 -0.3'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>"
)}`;

/* ---------- geometry helpers ---------- */

const f = (n) => Number(n.toFixed(1));

/** Multifoil (cusped) Mughal arch outline: lobes bulge into the wall, cusps point inward. */
function cuspedArch(cx, springY, rx, ry, lobes, bottomY) {
  const pts = [];
  for (let i = 0; i <= lobes; i++) {
    const t = Math.PI - (Math.PI * i) / lobes;
    pts.push([cx + rx * Math.cos(t), springY - ry * Math.sin(t)]);
  }
  let d = `M${f(cx - rx)} ${bottomY} L${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x, y] = pts[i];
    const r = f(Math.hypot(x - x0, y - y0) * 0.6);
    d += ` A${r} ${r} 0 0 1 ${f(x)} ${f(y)}`;
  }
  return `${d} L${f(cx + rx)} ${bottomY} Z`;
}

function quadPoints([x0, y0], [x1, y1], [x2, y2], n) {
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    return [a * x0 + b * x1 + c * x2, a * y0 + b * y1 + c * y2];
  });
}

const dome = (cx, baseY, w, h) =>
  `M${cx - w / 2} ${baseY} Q${cx - w / 2} ${baseY - h} ${cx} ${baseY - h * 1.3} Q${cx + w / 2} ${baseY - h} ${cx + w / 2} ${baseY} Z`;

/* ---------- shared pieces ---------- */

function CommonDefs({ u }) {
  return (
    <>
      <pattern id={`${u}grain`} width="120" height="120" patternUnits="userSpaceOnUse">
        <image href={GRAIN_URI} width="120" height="120" />
      </pattern>
      {/* Carved quatrefoil jali lattice */}
      <pattern id={`${u}jali`} width="14" height="14" patternUnits="userSpaceOnUse">
        <path
          d="M7 0 Q10.5 3.5 7 7 Q3.5 3.5 7 0Z M7 7 Q10.5 10.5 7 14 Q3.5 10.5 7 7Z M0 7 Q3.5 3.5 7 7 Q3.5 10.5 0 7Z M7 7 Q10.5 3.5 14 7 Q10.5 10.5 7 7Z"
          fill="none"
          stroke={PALETTE.kansaLight}
          strokeWidth="0.55"
        />
        <circle cx="7" cy="7" r="1" fill={PALETTE.kansaLight} />
      </pattern>
      {/* Same lattice, skewed into a soft floor shadow */}
      <pattern
        id={`${u}jaliShadow`}
        width="14"
        height="14"
        patternUnits="userSpaceOnUse"
        patternTransform="skewX(-28) scale(1 0.55)"
      >
        <path
          d="M7 0 Q10.5 3.5 7 7 Q3.5 3.5 7 0Z M7 7 Q10.5 10.5 7 14 Q3.5 10.5 7 7Z M0 7 Q3.5 3.5 7 7 Q3.5 10.5 0 7Z M7 7 Q10.5 3.5 14 7 Q10.5 10.5 7 7Z"
          fill={PALETTE.sindoorDeep}
        />
      </pattern>
      <radialGradient id={`${u}flameGlow`}>
        <stop offset="0%" stopColor="#FFE699" stopOpacity="0.85" />
        <stop offset="45%" stopColor="#F4A261" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#F4A261" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${u}brass`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={PALETTE.kansaMuted} />
        <stop offset="35%" stopColor={PALETTE.kansaLight} />
        <stop offset="55%" stopColor="#F6E3A8" />
        <stop offset="75%" stopColor={PALETTE.kansa} />
        <stop offset="100%" stopColor={PALETTE.kansaMuted} />
      </linearGradient>
    </>
  );
}

function Grain({ u, w, h, opacity = 0.6 }) {
  return <rect width={w} height={h} fill={`url(#${u}grain)`} opacity={opacity} pointerEvents="none" />;
}

/** Fine gold double-hairline inner frame with corner dots. */
function HairlineFrame({ w, h, inset = 8, color = PALETTE.kansaLight, opacity = 0.75 }) {
  const corners = [
    [inset, inset],
    [w - inset, inset],
    [inset, h - inset],
    [w - inset, h - inset],
  ];
  return (
    <g fill="none" stroke={color} opacity={opacity} pointerEvents="none">
      <rect x={inset} y={inset} width={w - inset * 2} height={h - inset * 2} strokeWidth="0.8" />
      <rect x={inset + 3} y={inset + 3} width={w - inset * 2 - 6} height={h - inset * 2 - 6} strokeWidth="0.4" />
      {corners.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill={color} stroke="none" />
      ))}
    </g>
  );
}

/** Delicate creeper vine running down both inner edges. */
function VineBorder({ w, h, inset = 16, color = PALETTE.kansaLight, opacity = 0.55 }) {
  const step = 26;
  const rows = Math.floor((h - inset * 2) / step);
  const vine = (x0) => {
    let d = `M${x0} ${inset}`;
    for (let i = 0; i < rows; i++) {
      const y = inset + i * step;
      d += ` C${x0 + 5} ${y + 9} ${x0 - 5} ${y + 17} ${x0} ${y + step}`;
    }
    return d;
  };
  const leaves = (x0) =>
    Array.from({ length: rows }, (_, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      return (
        <ellipse
          key={i}
          cx={x0 + side * 3.6}
          cy={inset + i * step + 13}
          rx="1.5"
          ry="3.8"
          transform={`rotate(${side * 42} ${x0 + side * 3.6} ${inset + i * step + 13})`}
          fill={color}
          stroke="none"
        />
      );
    });
  return (
    <g fill="none" stroke={color} strokeWidth="0.6" opacity={opacity} pointerEvents="none">
      <path d={vine(inset)} />
      <path d={vine(w - inset)} />
      {leaves(inset)}
      {leaves(w - inset)}
    </g>
  );
}

function Diya({ u, x, y, s = 1, loop, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <motion.circle
        cx="0"
        cy="-8"
        r="22"
        fill={`url(#${u}flameGlow)`}
        {...loop({ opacity: [0.7, 1, 0.75, 0.7] }, { duration: 2.2, delay })}
      />
      <path d="M-13 0 Q0 11 13 0 Q6 -2.5 0 -2.5 Q-6 -2.5 -13 0Z" fill={PALETTE.terracotta} />
      <path d="M-13 0 Q0 4 13 0" fill="none" stroke={PALETTE.kansaLight} strokeWidth="0.8" />
      <motion.path
        d="M0 -14 Q5 -6 0 -1 Q-5 -6 0 -14Z"
        fill="#FFE699"
        style={{ originX: 0.5, originY: 1 }}
        {...loop({ scaleY: [1, 1.22, 0.9, 1], scaleX: [1, 0.92, 1.05, 1] }, { duration: 1.4, delay })}
      />
      <path d="M0 -9 Q2 -5 0 -2.5 Q-2 -5 0 -9Z" fill="#FFF8DC" />
    </g>
  );
}

/* ---------- variants ---------- */

function PalaceCourtyard({ u, loop, bg, fg }) {
  const W = 320;
  const H = 400;
  const cx = 160;
  const springY = 182;
  const rx = 108;
  const ry = 112;
  const opening = cuspedArch(cx, springY, rx, ry, 9, H);
  const strands = [96, 128, 160, 192, 224];
  const archTopAt = (x) => springY - ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)) + 10;

  return (
    <>
      <defs>
        <CommonDefs u={u} />
        <linearGradient id={`${u}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE.ivory} />
          <stop offset="55%" stopColor="#F5DCC8" />
          <stop offset="100%" stopColor={PALETTE.kansaLight} />
        </linearGradient>
        <radialGradient id={`${u}sun`}>
          <stop offset="0%" stopColor="#FFFDF6" />
          <stop offset="40%" stopColor="#FFF3DA" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFF3DA" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${u}wall`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B42630" />
          <stop offset="60%" stopColor={PALETTE.sindoor} />
          <stop offset="100%" stopColor={PALETTE.sindoorDeep} />
        </linearGradient>
        <linearGradient id={`${u}floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EED9BC" />
          <stop offset="100%" stopColor="#E3C691" />
        </linearGradient>
        <radialGradient id={`${u}vignette`} cx="50%" cy="45%" r="75%">
          <stop offset="72%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#2A0A0C" stopOpacity="0.22" />
        </radialGradient>
      </defs>

      {/* Sky seen through the arch */}
      <rect width={W} height={H} fill={`url(#${u}sky)`} />

      {/* Distant layer: sun haze, chhatri skyline, courtyard floor */}
      <motion.g style={bg}>
        <motion.circle
          cx={cx}
          cy="200"
          r="92"
          fill={`url(#${u}sun)`}
          {...loop({ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }, { duration: 6 })}
        />
        <g fill="#E7B99A" opacity="0.75">
          <rect x="40" y="300" width="240" height="60" />
          <path d={dome(cx, 300, 52, 34)} />
          <rect x={cx - 1} y="246" width="2" height="12" />
          <path d={dome(100, 306, 26, 16)} />
          <path d={dome(220, 306, 26, 16)} />
          <rect x="70" y="270" width="6" height="40" />
          <rect x="244" y="270" width="6" height="40" />
          <path d={dome(73, 272, 10, 7)} />
          <path d={dome(247, 272, 10, 7)} />
        </g>
        <g fill="#D9A27F" opacity="0.6">
          {[118, 140, 180, 202].map((x) => (
            <path key={x} d={`M${x - 5} 320 V306 Q${x} 298 ${x + 5} 306 V320Z`} />
          ))}
        </g>
        <rect x="0" y="342" width={W} height="60" fill={`url(#${u}floor)`} />
        <line x1="0" y1="342" x2={W} y2="342" stroke={PALETTE.kansa} strokeWidth="0.8" opacity="0.6" />
        {/* Jali lattice shadow falling across the floor */}
        <polygon points="62,400 258,400 222,346 98,346" fill={`url(#${u}jaliShadow)`} opacity="0.14" />
        {/* Alpona rosette */}
        <g transform="translate(160 374)" fill="none" stroke={PALETTE.ivory} strokeWidth="0.9" opacity="0.85">
          <ellipse rx="44" ry="11" />
          <ellipse rx="30" ry="7" strokeDasharray="2 2.5" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={f(Math.cos(a) * 37)} cy={f(Math.sin(a) * 9)} r="1.4" fill={PALETTE.ivory} />;
          })}
        </g>
      </motion.g>

      {/* Carved sandstone wall with cusped jharokha opening */}
      <path d={`M0 0 H${W} V${H} H0 Z ${opening}`} fill={`url(#${u}wall)`} fillRule="evenodd" />
      <path d={`M0 0 H${W} V${H} H0 Z ${opening}`} fill={`url(#${u}jali)`} fillRule="evenodd" opacity="0.2" />

      {/* Arch mouldings */}
      <path d={opening} fill="none" stroke={PALETTE.kansaLight} strokeWidth="2.2" />
      <path d={cuspedArch(cx, springY, rx + 7, ry + 7, 9, H)} fill="none" stroke={PALETTE.kansa} strokeWidth="0.9" opacity="0.9" />
      <path
        d={`M${cx - rx - 15} ${H} V${springY} A${rx + 15} ${ry + 15} 0 0 1 ${cx + rx + 15} ${springY} V${H}`}
        fill="none"
        stroke={PALETTE.ivory}
        strokeWidth="1"
        strokeDasharray="5 4"
        opacity="0.7"
      />
      {/* Keystone lotus */}
      <g transform={`translate(${cx} ${springY - ry - 20})`}>
        {[-40, 0, 40].map((r) => (
          <ellipse key={r} cx="0" cy="-6" rx="3.6" ry="8" transform={`rotate(${r})`} fill={PALETTE.kansaLight} />
        ))}
        <circle r="2.4" fill={PALETTE.ivory} />
      </g>

      {/* Engaged pillars */}
      {[cx - rx - 26, cx + rx + 20].map((x) => (
        <g key={x}>
          <rect x={x} y={springY + 6} width="6" height={H - springY} fill={PALETTE.sindoorDeep} />
          <line x1={x} y1={springY + 6} x2={x} y2={H} stroke={PALETTE.kansaLight} strokeWidth="0.6" />
          <line x1={x + 6} y1={springY + 6} x2={x + 6} y2={H} stroke={PALETTE.kansaLight} strokeWidth="0.6" />
          <rect x={x - 3} y={springY} width="12" height="6" fill={PALETTE.kansa} />
          <circle cx={x + 3} cy={springY - 4} r="3.5" fill={PALETTE.kansa} />
          <rect x={x - 3} y={H - 16} width="12" height="5" fill={PALETTE.kansa} />
        </g>
      ))}

      {/* Spandrel rosettes */}
      {[46, 274].map((x) => (
        <g key={x} transform={`translate(${x} 64)`} fill="none" stroke={PALETTE.kansaLight} strokeWidth="0.8">
          <circle r="16" />
          <circle r="11" strokeDasharray="1.5 2" />
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={i} cx="0" cy="-6" rx="2.4" ry="5.5" transform={`rotate(${i * 45})`} />
          ))}
          <circle r="1.8" fill={PALETTE.kansaLight} />
        </g>
      ))}

      {/* Foreground: marigold & jasmine toran strands, diyas */}
      <motion.g style={fg}>
        {strands.map((x, idx) => {
          const top = archTopAt(x);
          const len = idx % 2 === 0 ? 84 : 108;
          const beads = Math.floor(len / 10);
          return (
            <motion.g
              key={x}
              style={{ originX: 0.5, originY: 0 }}
              {...loop({ rotate: [0, idx % 2 === 0 ? 1.6 : -1.6, 0] }, { duration: 3.8 + idx * 0.35 })}
            >
              <line x1={x} y1={top} x2={x} y2={top + len} stroke={PALETTE.kansaLight} strokeWidth="0.8" />
              {Array.from({ length: beads }).map((_, b) => {
                const kind = b % 3;
                return (
                  <circle
                    key={b}
                    cx={x}
                    cy={top + 8 + b * 10}
                    r={kind === 2 ? 2.6 : 4.4}
                    fill={kind === 0 ? PALETTE.marigold : kind === 1 ? '#E07A2E' : PALETTE.ivory}
                    stroke={kind === 2 ? 'none' : '#B5651D'}
                    strokeWidth="0.4"
                  />
                );
              })}
              <path
                d={`M${x} ${top + len + 2} q4 6 0 12 q-4 -6 0 -12Z`}
                fill={PALETTE.leaf}
              />
            </motion.g>
          );
        })}
        <Diya u={u} x={104} y={356} s={1} loop={loop} />
        <Diya u={u} x={160} y={360} s={1.2} loop={loop} delay={0.4} />
        <Diya u={u} x={216} y={356} s={1} loop={loop} delay={0.8} />
      </motion.g>

      <rect width={W} height={H} fill={`url(#${u}vignette)`} pointerEvents="none" />
      <VineBorder w={W} h={H} inset={14} />
      <HairlineFrame w={W} h={H} inset={6} />
      <Grain u={u} w={W} h={H} opacity={0.5} />
    </>
  );
}

function LakesideVows({ u, loop, bg, fg }) {
  const W = 400;
  const H = 300;
  const horizon = 192;
  const mandapCx = 124;
  const swag = quadPoints([70, 128], [mandapCx, 160], [178, 128], 11);

  return (
    <>
      <defs>
        <CommonDefs u={u} />
        <linearGradient id={`${u}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE.indigo} />
          <stop offset="38%" stopColor="#4A2F4E" />
          <stop offset="72%" stopColor={PALETTE.terracotta} />
          <stop offset="100%" stopColor={PALETTE.kansaLight} />
        </linearGradient>
        <linearGradient id={`${u}water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3550" />
          <stop offset="100%" stopColor="#141C2C" />
        </linearGradient>
        <radialGradient id={`${u}moon`}>
          <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#FFE9C2" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFE9C2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${u}canopy`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE.ivory} />
          <stop offset="100%" stopColor="#EBD9BE" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${u}sky)`} />

      {/* Distant: stars, moon, palace silhouette */}
      <motion.g style={bg}>
        {[
          [40, 26],
          [96, 48],
          [178, 22],
          [232, 54],
          [360, 30],
          [384, 72],
        ].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={i % 2 ? 1.1 : 1.6}
            fill={PALETTE.ivory}
            {...loop({ opacity: [0.25, 0.95, 0.25] }, { duration: 2.4 + i * 0.5 })}
          />
        ))}
        <circle cx="300" cy="74" r="70" fill={`url(#${u}moon)`} />
        <circle cx="300" cy="74" r="17" fill="#FFF8E7" />
        <circle cx="306" cy="70" r="3" fill="#F3E3C4" />
        <circle cx="295" cy="80" r="2" fill="#F3E3C4" />
        <g fill="#2B2340" opacity="0.92">
          <rect x="226" y="164" width="174" height="30" />
          <rect x="282" y="146" width="44" height="20" />
          <path d={dome(304, 147, 40, 24)} />
          <rect x="303" y="110" width="2" height="10" />
          <path d={dome(248, 165, 20, 12)} />
          <path d={dome(360, 165, 20, 12)} />
          <rect x="268" y="132" width="5" height="34" />
          <rect x="335" y="132" width="5" height="34" />
          <path d={dome(270.5, 133, 8, 6)} />
          <path d={dome(337.5, 133, 8, 6)} />
          <rect x="390" y="150" width="10" height="16" />
          <ellipse cx="30" cy="190" rx="44" ry="14" />
          <ellipse cx="78" cy="192" rx="30" ry="10" />
        </g>
        {/* Lit palace windows */}
        {[240, 256, 290, 318, 352, 368].map((x, i) => (
          <motion.rect
            key={x}
            x={x}
            y="174"
            width="3"
            height="6"
            rx="1.5"
            fill="#FFD98A"
            {...loop({ opacity: [0.55, 1, 0.55] }, { duration: 3 + i * 0.4 })}
          />
        ))}
      </motion.g>

      {/* Lake */}
      <rect y={horizon} width={W} height={H - horizon} fill={`url(#${u}water)`} />
      {/* Moon path on the water */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.line
          key={i}
          x1={300 - (10 + i * 3) + (i % 2 ? 6 : -4)}
          x2={300 + (6 + i * 2) + (i % 2 ? 6 : -4)}
          y1={horizon + 10 + i * 15}
          y2={horizon + 10 + i * 15}
          stroke="#FFE9C2"
          strokeWidth="1.2"
          strokeLinecap="round"
          {...loop({ opacity: [0.2, 0.7, 0.2], x: [-3, 3, -3] }, { duration: 3.2 + i * 0.5 })}
        />
      ))}

      {/* Mandap (also mirrored into the lake) */}
      <g id={`${u}mandap`}>
        <rect x="40" y="186" width="168" height="7" fill="#E9D7BA" />
        <rect x="50" y="181" width="148" height="6" fill={PALETTE.cream} />
        <motion.circle
          cx={mandapCx}
          cy="170"
          r="30"
          fill={`url(#${u}flameGlow)`}
          {...loop({ opacity: [0.6, 1, 0.7, 0.6] }, { duration: 1.8 })}
        />
        {/* Back pillars */}
        {[86, 162].map((x) => (
          <rect key={x} x={x - 2} y="124" width="4" height="58" fill="#D8C3A0" />
        ))}
        {/* Front pillars */}
        {[66, 182].map((x) => (
          <g key={x}>
            <rect x={x - 3.5} y="122" width="7" height="60" fill={PALETTE.ivory} />
            {[132, 156, 176].map((y) => (
              <rect key={y} x={x - 4.5} y={y} width="9" height="2.2" fill={PALETTE.kansa} />
            ))}
          </g>
        ))}
        {/* Cusped canopy */}
        <path d={`M56 124 Q${mandapCx} 64 192 124 Z`} fill={`url(#${u}canopy)`} />
        <path d={`M56 124 Q${mandapCx} 64 192 124`} fill="none" stroke={PALETTE.kansa} strokeWidth="1.2" />
        <path d={`M76 118 Q${mandapCx} 80 172 118`} fill="none" stroke={PALETTE.sindoor} strokeWidth="0.9" opacity="0.8" />
        <rect x={mandapCx - 1} y="84" width="2" height="9" fill={PALETTE.kansa} />
        <circle cx={mandapCx} cy="83" r="2.6" fill={PALETTE.kansa} />
        {Array.from({ length: 17 }).map((_, i) => (
          <circle key={i} cx={58 + i * 8.2} cy="126" r="3.2" fill={i % 2 ? PALETTE.marigold : PALETTE.sindoor} />
        ))}
        {swag.map(([x, y], i) => (
          <circle key={i} cx={f(x)} cy={f(y)} r="2.6" fill={i % 2 ? PALETTE.ivory : PALETTE.marigold} />
        ))}
        {/* Sacred fire */}
        <path d={`M${mandapCx - 8} 181 h16 l-3 -5 h-10Z`} fill={PALETTE.kansaMuted} />
        <motion.path
          d={`M${mandapCx} 160 Q${mandapCx + 7} 170 ${mandapCx} 177 Q${mandapCx - 7} 170 ${mandapCx} 160Z`}
          fill="#FFC857"
          style={{ originX: 0.5, originY: 1 }}
          {...loop({ scaleY: [1, 1.2, 0.92, 1] }, { duration: 1.2 })}
        />
      </g>
      <use
        href={`#${u}mandap`}
        transform={`translate(0 ${horizon * 2 + 2}) scale(1 -1)`}
        opacity="0.22"
      />
      {/* Ripple lines breaking up the reflection */}
      {[208, 222, 238, 256].map((y, i) => (
        <motion.line
          key={y}
          x1={60 + i * 6}
          x2={190 - i * 6}
          y1={y}
          y2={y}
          stroke={PALETTE.kansaLight}
          strokeWidth="0.8"
          {...loop({ opacity: [0.15, 0.5, 0.15], x: [-4, 4, -4] }, { duration: 3.6 + i * 0.6 })}
        />
      ))}

      {/* Foreground: lotus pads, floating diyas, reeds */}
      <motion.g style={fg}>
        {[
          [222, 262, 20],
          [258, 284, 14],
          [40, 276, 18],
        ].map(([x, y, r]) => (
          <g key={x}>
            <ellipse cx={x} cy={y} rx={r} ry={r * 0.32} fill={PALETTE.leaf} opacity="0.85" />
            <path d={`M${x} ${y} L${x + r * 0.9} ${y - r * 0.12}`} stroke="#1F4D3A" strokeWidth="0.8" />
          </g>
        ))}
        {[
          [226, 256],
          [44, 270],
        ].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            {[-50, -25, 0, 25, 50].map((r) => (
              <ellipse key={r} cx="0" cy="-6" rx="3" ry="7" transform={`rotate(${r})`} fill={r === 0 ? '#F8DDE0' : '#F2C6C2'} />
            ))}
          </g>
        ))}
        {[
          [150, 250, 0],
          [186, 272, 0.6],
          [330, 258, 1.1],
        ].map(([x, y, d]) => (
          <motion.g key={x} {...loop({ y: [0, -2, 0] }, { duration: 3, delay: d })}>
            <Diya u={u} x={x} y={y} s={0.75} loop={loop} delay={d} />
          </motion.g>
        ))}
        <g stroke="#0E1420" strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M392 300 Q386 250 372 224" />
          <path d="M384 300 Q382 262 392 236" />
          <path d="M376 300 Q368 268 352 252" />
          <ellipse cx="371" cy="222" rx="2.4" ry="7" fill="#0E1420" transform="rotate(-30 371 222)" />
        </g>
      </motion.g>

      <HairlineFrame w={W} h={H} inset={6} opacity={0.6} />
      <Grain u={u} w={W} h={H} opacity={0.5} />
    </>
  );
}

function FloralKalash({ u, loop, bg, fg }) {
  const W = 320;
  const H = 380;
  const cx = 160;
  const garland = quadPoints([122, 246], [cx, 268], [198, 246], 13);

  return (
    <>
      <defs>
        <CommonDefs u={u} />
        <radialGradient id={`${u}bgGrad`} cx="50%" cy="48%" r="70%">
          <stop offset="0%" stopColor="#BE2A33" />
          <stop offset="70%" stopColor={PALETTE.sindoor} />
          <stop offset="100%" stopColor={PALETTE.sindoorDeep} />
        </radialGradient>
        <radialGradient id={`${u}halo`}>
          <stop offset="0%" stopColor={PALETTE.kansaLight} stopOpacity="0.55" />
          <stop offset="55%" stopColor={PALETTE.kansaLight} stopOpacity="0.12" />
          <stop offset="100%" stopColor={PALETTE.kansaLight} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}coconut`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#A9743F" />
          <stop offset="100%" stopColor="#5E3A1C" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${u}bgGrad)`} />
      <rect width={W} height={H} fill={`url(#${u}jali)`} opacity="0.12" />

      <motion.g style={bg}>
        <circle cx={cx} cy="190" r="140" fill={`url(#${u}halo)`} />
        {/* Turning mandala */}
        <motion.g
          fill="none"
          stroke={PALETTE.ivory}
          strokeWidth="1"
          opacity="0.42"
          {...loop({ rotate: 360 }, { duration: 90, ease: 'linear' })}
        >
          <circle cx={cx} cy="190" r="118" strokeDasharray="3 4" />
          <circle cx={cx} cy="190" r="104" />
          <circle cx={cx} cy="190" r="72" strokeDasharray="1.5 3" />
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={`o${i}`}
              d={`M${cx} 86 Q${cx + 11} 104 ${cx} 122 Q${cx - 11} 104 ${cx} 86Z`}
              transform={`rotate(${i * 22.5} ${cx} 190)`}
            />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <circle key={`d${i}`} cx={cx} cy="78" r="1.6" fill={PALETTE.kansaLight} stroke="none" transform={`rotate(${i * 15} ${cx} 190)`} />
          ))}
        </motion.g>
      </motion.g>

      {/* Kalash composition, lifted so it sits inside 4:3 crops */}
      <g transform="translate(0 -44)">
      {/* Lotus petal pedestal */}
      <g transform={`translate(${cx} 326)`}>
        {[-78, -52, -26, 0, 26, 52, 78].map((r, i) => (
          <ellipse
            key={r}
            cx="0"
            cy="-14"
            rx="9"
            ry="22"
            transform={`rotate(${r} 0 6)`}
            fill={i % 2 ? PALETTE.ivory : '#F2C6C2'}
            stroke={PALETTE.kansa}
            strokeWidth="0.6"
          />
        ))}
        <ellipse cx="0" cy="6" rx="62" ry="8" fill={PALETTE.kansaMuted} />
        <ellipse cx="0" cy="4" rx="58" ry="6" fill={PALETTE.kansa} />
      </g>

      {/* Mango leaves */}
      <g transform={`translate(${cx} 214)`}>
        {[-66, -36, -12, 12, 36, 66].map((r) => (
          <g key={r} transform={`rotate(${r})`}>
            <path d="M0 0 Q9 -24 0 -52 Q-9 -24 0 0Z" fill={PALETTE.leaf} />
            <path d="M0 -2 L0 -48" stroke="#95D5B2" strokeWidth="0.7" />
          </g>
        ))}
      </g>

      {/* Coconut */}
      <ellipse cx={cx} cy="190" rx="19" ry="24" fill={`url(#${u}coconut)`} />
      <path d={`M${cx - 6} 168 Q${cx} 152 ${cx + 6} 168`} fill="none" stroke="#7A4E25" strokeWidth="2" />
      <path d={`M${cx - 3} 184 Q${cx} 194 ${cx + 3} 184`} fill={PALETTE.sindoor} />

      {/* Brass kalash */}
      <path d={`M138 236 Q141 224 134 214 H186 Q179 224 182 236Z`} fill={`url(#${u}brass)`} />
      <ellipse cx={cx} cy="214" rx="30" ry="5" fill={PALETTE.kansaLight} stroke={PALETTE.kansaMuted} strokeWidth="0.8" />
      <path
        d="M118 250 Q98 284 120 314 Q160 334 200 314 Q222 284 202 250 Q190 236 160 234 Q130 236 118 250Z"
        fill={`url(#${u}brass)`}
        stroke={PALETTE.kansaMuted}
        strokeWidth="0.8"
      />
      <path d="M110 276 Q160 290 210 276" fill="none" stroke={PALETTE.sindoorDeep} strokeWidth="1.1" opacity="0.7" />
      <path d="M114 300 Q160 314 206 300" fill="none" stroke={PALETTE.sindoorDeep} strokeWidth="1.1" opacity="0.7" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={124 + i * 9} cy={f(286 + Math.sin((i / 8) * Math.PI) * 6)} r="1.2" fill={PALETTE.sindoorDeep} opacity="0.7" />
      ))}
      <path d="M128 256 Q132 290 140 308" fill="none" stroke="#FFF6D8" strokeWidth="3" opacity="0.45" strokeLinecap="round" />
      <circle cx={cx} cy="272" r="5" fill={PALETTE.sindoor} />
      <circle cx={cx} cy="272" r="1.6" fill={PALETTE.kansaLight} />

      {/* Marigold garland at the neck */}
      {garland.map(([x, y], i) => (
        <circle key={i} cx={f(x)} cy={f(y)} r="4" fill={i % 2 ? '#E07A2E' : PALETTE.marigold} stroke="#B5651D" strokeWidth="0.4" />
      ))}

      <motion.g style={fg}>
        <Diya u={u} x={70} y={338} s={1.1} loop={loop} />
        <Diya u={u} x={250} y={338} s={1.1} loop={loop} delay={0.7} />
        {[
          [52, 74],
          [270, 96],
          [86, 150],
          [244, 172],
          [36, 230],
          [288, 250],
        ].map(([x, y], i) => (
          <motion.path
            key={i}
            d={`M${x} ${y - 5} L${x + 1.4} ${y - 1.4} L${x + 5} ${y} L${x + 1.4} ${y + 1.4} L${x} ${y + 5} L${x - 1.4} ${y + 1.4} L${x - 5} ${y} L${x - 1.4} ${y - 1.4}Z`}
            fill={PALETTE.kansaLight}
            {...loop({ opacity: [0.3, 1, 0.3] }, { duration: 2.6 + i * 0.45 })}
          />
        ))}
      </motion.g>

      </g>

      <HairlineFrame w={W} h={H} inset={7} />
      <Grain u={u} w={W} h={H} opacity={0.55} />
    </>
  );
}

function StarlitTerrace({ u, loop, bg, fg }) {
  const W = 400;
  const H = 300;
  const strand1 = quadPoints([52, 64], [200, 132], [348, 64], 17);
  const strand2 = quadPoints([52, 92], [200, 140], [348, 92], 13);
  const lanterns = [
    [strand1[5], 26],
    [strand1[8], 40],
    [strand1[11], 26],
  ];
  const railY = 222;

  return (
    <>
      <defs>
        <CommonDefs u={u} />
        <linearGradient id={`${u}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E1524" />
          <stop offset="60%" stopColor={PALETTE.indigo} />
          <stop offset="100%" stopColor="#3B4D6B" />
        </linearGradient>
        <radialGradient id={`${u}lantern`}>
          <stop offset="0%" stopColor="#FFE699" stopOpacity="0.75" />
          <stop offset="40%" stopColor="#F4A261" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F4A261" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}haze`} cx="60%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#6B7FA8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6B7FA8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${u}window`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD98A" />
          <stop offset="100%" stopColor="#E07A2E" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${u}sky)`} />
      <rect width={W} height={H} fill={`url(#${u}haze)`} />

      <motion.g style={bg}>
        {Array.from({ length: 26 }).map((_, i) => (
          <circle key={i} cx={(i * 97) % 380 + 10} cy={(i * 53) % 150 + 8} r={i % 4 === 0 ? 1.1 : 0.6} fill={PALETTE.ivory} opacity="0.55" />
        ))}
        {[
          [72, 30],
          [150, 46],
          [236, 20],
          [292, 52],
          [182, 96],
        ].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="1.8"
            fill={PALETTE.ivory}
            {...loop({ opacity: [0.2, 1, 0.2] }, { duration: 2.2 + i * 0.4 })}
          />
        ))}
        {/* Crescent moon */}
        <path d="M330 26 A22 22 0 1 0 356 60 A17 17 0 1 1 330 26Z" fill="#FFF3D6" />
        {/* Distant city lights through the balustrade */}
        {Array.from({ length: 22 }).map((_, i) => (
          <circle key={i} cx={20 + i * 17} cy={248 + ((i * 7) % 18)} r="1.1" fill="#FFD98A" opacity={0.4 + (i % 3) * 0.2} />
        ))}
      </motion.g>

      {/* Jharokha walls framing the terrace */}
      {[
        [0, 62],
        [W - 62, W],
      ].map(([x0, x1], s) => {
        const wx = x0 + (x1 - x0) / 2;
        return (
          <g key={s}>
            <rect x={x0} y="40" width={x1 - x0} height={H - 40} fill="#121A29" />
            <rect x={x0} y="40" width={x1 - x0} height={H - 40} fill={`url(#${u}jali)`} opacity="0.08" />
            <path d={cuspedArch(wx, 104, 17, 22, 5, 170)} fill={`url(#${u}window)`} opacity="0.85" />
            <path d={cuspedArch(wx, 104, 17, 22, 5, 170)} fill={`url(#${u}jali)`} opacity="0.55" />
            <path d={cuspedArch(wx, 104, 20, 25, 5, 172)} fill="none" stroke={PALETTE.kansa} strokeWidth="0.9" />
            <rect x={wx - 24} y="170" width="48" height="5" fill={PALETTE.kansaMuted} />
            <path d={dome(wx, 40, x1 - x0, 14)} fill="#121A29" />
          </g>
        );
      })}

      {/* Fairy-light strands */}
      <path d={`M52 64 Q200 132 348 64`} fill="none" stroke={PALETTE.kansaLight} strokeWidth="0.7" opacity="0.6" />
      <path d={`M52 92 Q200 140 348 92`} fill="none" stroke={PALETTE.kansaLight} strokeWidth="0.6" opacity="0.45" />
      {[...strand1, ...strand2].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={f(x)}
          cy={f(y + 2.5)}
          r={i < strand1.length ? 2.2 : 1.7}
          fill="#FFE699"
          {...loop({ opacity: [0.45, 1, 0.45] }, { duration: 1.8 + (i % 3) * 0.6, delay: (i % 4) * 0.3 })}
        />
      ))}

      {/* Lanterns */}
      {lanterns.map(([[x, y], drop], i) => {
        const ly = y + drop;
        return (
          <g key={i}>
            <line x1={f(x)} y1={f(y)} x2={f(x)} y2={f(ly)} stroke={PALETTE.kansaLight} strokeWidth="0.8" />
            <motion.circle
              cx={f(x)}
              cy={f(ly + 14)}
              r="38"
              fill={`url(#${u}lantern)`}
              {...loop({ opacity: [0.65, 1, 0.65] }, { duration: 2.8 + i })}
            />
            <g transform={`translate(${f(x)} ${f(ly)})`}>
              <path d="M-6 0 H6 L10 6 H-10Z" fill={PALETTE.kansa} />
              <path d="M-10 6 Q-13 16 -8 26 H8 Q13 16 10 6Z" fill="#FFD27A" stroke={PALETTE.kansa} strokeWidth="1" />
              <path d="M0 6 V26 M-5 6 Q-7 16 -4 26 M5 6 Q7 16 4 26" stroke={PALETTE.terracotta} strokeWidth="0.6" fill="none" />
              <path d="M-8 26 H8 L5 30 H-5Z" fill={PALETTE.kansa} />
              <path d="M0 30 V36" stroke={PALETTE.sindoor} strokeWidth="1.4" />
            </g>
          </g>
        );
      })}

      {/* Balustrade */}
      <rect x="0" y={railY} width={W} height="7" fill="#1A2438" />
      <line x1="0" y1={railY} x2={W} y2={railY} stroke={PALETTE.kansaLight} strokeWidth="1.2" opacity="0.6" />
      {Array.from({ length: 25 }).map((_, i) => {
        const x = 8 + i * 16;
        return (
          <path
            key={i}
            d={`M${x - 3} ${railY + 7} Q${x - 6} ${railY + 20} ${x - 2} ${railY + 30} Q${x - 7} ${railY + 44} ${x - 3} ${railY + 56} H${x + 3} Q${x + 7} ${railY + 44} ${x + 2} ${railY + 30} Q${x + 6} ${railY + 20} ${x + 3} ${railY + 7}Z`}
            fill="#141C2C"
          />
        );
      })}
      <rect x="0" y={railY + 56} width={W} height={H - railY - 56} fill="#0E1420" />
      <line x1="0" y1={railY + 56} x2={W} y2={railY + 56} stroke={PALETTE.kansa} strokeWidth="0.6" opacity="0.5" />

      {/* Foreground: floral urns & tealights on the rail */}
      <motion.g style={fg}>
        {[44, 356].map((x) => (
          <g key={x}>
            <path d={`M${x - 14} ${railY} Q${x - 16} ${railY - 16} ${x - 10} ${railY - 22} H${x + 10} Q${x + 16} ${railY - 16} ${x + 14} ${railY}Z`} fill={PALETTE.kansaMuted} />
            <path d={`M${x - 10} ${railY - 22} H${x + 10}`} stroke={PALETTE.kansaLight} strokeWidth="1.2" />
            {[
              [-12, -34, 12],
              [8, -38, 13],
              [-2, -48, 11],
            ].map(([dx, dy, r], k) => (
              <circle key={k} cx={x + dx} cy={railY + dy} r={r} fill="#1F4D3A" />
            ))}
            {[
              [-14, -38],
              [2, -52],
              [12, -36],
              [-4, -30],
            ].map(([dx, dy], k) => (
              <circle key={`m${k}`} cx={x + dx} cy={railY + dy} r="3.6" fill={k % 2 ? '#E07A2E' : PALETTE.marigold} />
            ))}
          </g>
        ))}
        {[120, 200, 280].map((x, i) => (
          <Diya key={x} u={u} x={x} y={railY - 1} s={0.7} loop={loop} delay={i * 0.5} />
        ))}
      </motion.g>

      <HairlineFrame w={W} h={H} inset={6} opacity={0.6} />
      <Grain u={u} w={W} h={H} opacity={0.5} />
    </>
  );
}

const VARIANTS = {
  'palace-courtyard': { viewBox: '0 0 320 400', Scene: PalaceCourtyard },
  'lakeside-vows': { viewBox: '0 0 400 300', Scene: LakesideVows },
  'floral-kalash': { viewBox: '0 0 320 380', Scene: FloralKalash },
  'starlit-terrace': { viewBox: '0 0 400 300', Scene: StarlitTerrace },
};

export default function RoyalArtwork({ variant = 'palace-courtyard', className = '', interactive = false }) {
  const u = `ra${useId().replace(/:/g, '')}`;
  const reduce = useReducedMotion();
  const parallax = interactive && !reduce;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 110, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 110, damping: 18, mass: 0.6 });
  // Looking through a window: distant layer drifts with the pointer, foreground against it.
  const bgX = useTransform(sx, (v) => v * 12);
  const bgY = useTransform(sy, (v) => v * 12);
  const fgX = useTransform(sx, (v) => v * -24);
  const fgY = useTransform(sy, (v) => v * -24);

  const loop = (animate, transition = {}) =>
    reduce ? {} : { animate, transition: { repeat: Infinity, ease: 'easeInOut', ...transition } };

  const handlers = parallax
    ? {
        onPointerMove: (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        },
        onPointerLeave: () => {
          px.set(0);
          py.set(0);
        },
      }
    : {};

  const { viewBox, Scene } = VARIANTS[variant] || VARIANTS['palace-courtyard'];

  return (
    <svg
      viewBox={viewBox}
      className={`h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      {...handlers}
    >
      <Scene u={u} loop={loop} bg={{ x: bgX, y: bgY }} fg={{ x: fgX, y: fgY }} />
    </svg>
  );
}
