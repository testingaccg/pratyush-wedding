import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion, useMotionValue, useTransform, animate } from 'framer-motion';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';
import { GUEST } from '../utils/guest';

const EASE = [0.22, 1, 0.36, 1];
const TAP_SLOP = 6; // px of movement before a press becomes a drag
const DRAG_MAX_DEG = 70; // how far the leaves follow the finger
const OPEN_DEG = 108; // fully parted
const COMMIT_PROGRESS = 0.35;
const COMMIT_VELOCITY = 0.5; // px/ms

const vibrate = (pattern) => {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported, e.g. iOS */
  }
};

/* Delicate gold corner flourish for the ivory folio */
function CornerFlourish({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" className={`pointer-events-none absolute h-8 w-8 text-kansa ${className}`} fill="none" aria-hidden="true">
      <path d="M2 38 V14 Q2 2 14 2 H38" stroke="currentColor" strokeWidth="0.9" />
      <path d="M7 38 V17 Q7 7 17 7 H38" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
      <path d="M12 12 Q18 10 20 4 Q22 10 28 12 Q22 14 20 20 Q18 14 12 12 Z" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

/* One carved, lacquered courtyard door leaf */
function DoorLeaf({ side, patternId, opening, reduced, rotateY }) {
  const isLeft = side === 'left';
  return (
    <motion.div
      initial={false}
      animate={reduced ? { opacity: opening ? 0 : 1 } : undefined}
      transition={{ duration: 0.3 }}
      style={{
        rotateY: reduced ? 0 : rotateY,
        transformOrigin: isLeft ? 'left center' : 'right center',
        backfaceVisibility: 'hidden',
        background: isLeft
          ? 'linear-gradient(90deg, #5E0C11 0%, #8A151C 18%, #A61C24 55%, #B5262E 88%, #6E1015 100%)'
          : 'linear-gradient(270deg, #5E0C11 0%, #8A151C 18%, #A61C24 55%, #B5262E 88%, #6E1015 100%)',
      }}
      className={`absolute inset-y-0 ${isLeft ? 'left-0' : 'right-0'} w-1/2 overflow-hidden`}
    >
      {/* Jali lattice */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Carved inset panels — double gold hairlines */}
      <div className={`absolute top-[30%] h-[28%] ${isLeft ? 'left-3 right-4' : 'left-4 right-3'} border border-kansa-light/70 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]`}>
        <div className="absolute inset-1.5 border border-kansa-light/35" />
        <svg viewBox="0 0 40 40" className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-kansa-light/80" fill="none" aria-hidden="true">
          <path d="M20 4 Q26 14 20 20 Q14 14 20 4 Z M20 36 Q26 26 20 20 Q14 26 20 36 Z M4 20 Q14 14 20 20 Q14 26 4 20 Z M36 20 Q26 14 20 20 Q26 26 36 20 Z" stroke="currentColor" strokeWidth="1" />
          <circle cx="20" cy="20" r="2.2" fill="currentColor" />
        </svg>
      </div>
      <div className={`absolute bottom-3 top-[63%] ${isLeft ? 'left-3 right-4' : 'left-4 right-3'} border border-kansa-light/70 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]`}>
        <div className="absolute inset-1.5 border border-kansa-light/35" />
      </div>

      {/* Brass ring handle near the seam */}
      <div className={`absolute top-[60%] ${isLeft ? 'right-1.5' : 'left-1.5'} flex flex-col items-center`}>
        <span className="h-1.5 w-1.5 rounded-full bg-kansa-light shadow-[0_0_4px_rgba(230,202,126,0.8)]" />
        <span className="-mt-0.5 h-4 w-4 rounded-full border-[1.5px] border-kansa-light shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Lacquer sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25" />
    </motion.div>
  );
}

/**
 * Twin Lotus-Arch Courtyard Doors Intro:
 * Tapping swings open carved sindoor-lacquer doors to reveal the celebration.
 */
export default function ShubhoDrishtiIntro({ onEnter }) {
  const [opening, setOpening] = useState(false);
  const reduced = useReducedMotion();
  const doorRef = useRef(null);
  const entered = useRef(false);
  const patternId = `jali-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  // Door swing angle in degrees: follows the finger while dragging, then springs.
  const angle = useMotionValue(0);
  const leftRotate = useTransform(angle, (a) => -a);
  const seamOpacity = useTransform(angle, [0, DRAG_MAX_DEG, OPEN_DEG], [0.8, 1, 0]);
  const seamGlow = useTransform(
    angle,
    [0, DRAG_MAX_DEG],
    ['0 0 10px 3px rgba(255,220,140,0.55)', '0 0 34px 14px rgba(255,232,165,0.95)']
  );
  const sealScale = useTransform(angle, [0, DRAG_MAX_DEG], [1, 1.14]);
  // Seal lifts away early so it never muddies the names revealed behind it
  const sealFade = useTransform(angle, [0, DRAG_MAX_DEG * 0.45, DRAG_MAX_DEG], [1, 0.15, 0]);
  const namesOpacity = useTransform(angle, [0, DRAG_MAX_DEG], [0.4, 0.9]);

  const drag = useRef(null); // { id, x0, width, dragging, crossed, samples }
  const suppressClick = useRef(false);
  const [coarse] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    doorRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const finish = () => {
    if (entered.current) return;
    entered.current = true;
    onEnter();
  };

  // Must run synchronously inside the pointerup/click handler (iOS audio unlock).
  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    // Enables SFX, plays the door chime and starts music inside the user gesture (iOS autoplay)
    soundEngine.beginCelebration();
    if (!reduced) {
      vibrate([12, 40, 18]);
      animate(angle, OPEN_DEG, { type: 'spring', stiffness: 90, damping: 17, mass: 1 });
    }
    // Safety net in case the fade's completion callback never fires
    setTimeout(finish, reduced ? 500 : 1600);
  };

  /* ---- Swipe-to-part gesture ---- */
  const onPointerDown = (e) => {
    suppressClick.current = false;
    if (reduced || opening || (e.pointerType === 'mouse' && e.button !== 0)) return;
    angle.stop();
    drag.current = {
      id: e.pointerId,
      x0: e.clientX,
      width: e.currentTarget.getBoundingClientRect().width,
      dragging: false,
      crossed: false,
      samples: [{ x: e.clientX, t: e.timeStamp }],
    };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    if (!d.dragging) {
      if (Math.abs(dx) < TAP_SLOP) return;
      d.dragging = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    const p = Math.min(1, Math.abs(dx) / (d.width * 0.6));
    angle.set(p * DRAG_MAX_DEG);
    if (!d.crossed && p > COMMIT_PROGRESS) {
      d.crossed = true;
      vibrate(8);
    } else if (d.crossed && p < COMMIT_PROGRESS) {
      d.crossed = false;
    }
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    if (d.samples.length > 6) d.samples.shift();
  };

  const springBack = () => animate(angle, 0, { type: 'spring', stiffness: 260, damping: 22 });

  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId || !d.dragging) return;
    suppressClick.current = true; // the click that follows a drag must not re-open
    const p = Math.min(1, Math.abs(e.clientX - d.x0) / (d.width * 0.6));
    // Outward speed over the last ~100ms
    const recent = d.samples.filter((smp) => e.timeStamp - smp.t < 100);
    const first = recent[0] || d.samples[0];
    const dt = Math.max(1, e.timeStamp - first.t);
    const velocity = (Math.abs(e.clientX - d.x0) - Math.abs(first.x - d.x0)) / dt;
    if (p > COMMIT_PROGRESS || velocity > COMMIT_VELOCITY) {
      handleOpen(); // synchronous: keeps the gesture's audio permission
    } else {
      springBack();
    }
  };

  const onPointerCancel = () => {
    if (drag.current?.dragging) springBack();
    drag.current = null;
  };

  const onClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    handleOpen();
  };

  const hasGuest = !!GUEST.name;
  const hint = reduced
    ? 'Tap the doors to enter'
    : coarse
      ? 'Swipe the doors apart'
      : 'Tap or part the doors to enter';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={hasGuest ? `Wedding invitation for ${GUEST.name}` : 'Wedding invitation'}
      initial={{ opacity: 1 }}
      animate={{ opacity: opening ? 0 : 1, scale: opening && !reduced ? 1.035 : 1 }}
      transition={{
        duration: reduced ? 0.35 : 0.7,
        delay: opening ? (reduced ? 0 : 0.7) : 0,
        ease: EASE,
      }}
      onAnimationComplete={() => {
        if (opening) finish();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-sindoor-deep"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 45%, #9A1A22 0%, #781117 45%, #4A0A0E 100%)',
      }}
    >
      {/* Rotating antique-gold mandala */}
      <svg
        viewBox="0 0 240 240"
        style={{ width: 'min(150vw, 820px)', height: 'min(150vw, 820px)' }}
        className={`pointer-events-none absolute text-kansa-light opacity-[0.17] ${reduced ? '' : 'animate-slow-spin'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        aria-hidden="true"
      >
        <circle cx="120" cy="120" r="116" strokeDasharray="1 3" />
        <circle cx="120" cy="120" r="108" strokeDasharray="4 4" />
        <circle cx="120" cy="120" r="84" />
        <circle cx="120" cy="120" r="58" strokeDasharray="2 5" />
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={`a${i}`} d="M120 22 Q132 52 120 82 Q108 52 120 22 Z" transform={`rotate(${i * 22.5} 120 120)`} />
        ))}
        {Array.from({ length: 32 }).map((_, i) => (
          <circle key={`d${i}`} cx="120" cy="8" r="1.4" fill="currentColor" stroke="none" transform={`rotate(${i * 11.25} 120 120)`} />
        ))}
      </svg>

      {/* Warm candle glow + vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(230,202,126,0.16) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(20,4,6,0.55) 100%)',
        }}
      />

      {/* Ivory deckle folio */}
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 28, scale: reduced ? 1 : 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-10 flex w-[min(90vw,27rem)] flex-col items-center rounded-[3px] bg-ivory px-6 pb-9 pt-10 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:px-10 sm:pb-10 sm:pt-11"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(197,155,56,0.08), transparent 50%), radial-gradient(circle at 80% 95%, rgba(166,28,36,0.05), transparent 50%)',
        }}
      >
        {/* Double gold hairline frame */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-kansa/70" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-[13px] border border-sindoor/25" />
        <CornerFlourish className="left-3 top-3" />
        <CornerFlourish className="right-3 top-3 rotate-90" />
        <CornerFlourish className="bottom-3 left-3 -rotate-90" />
        <CornerFlourish className="bottom-3 right-3 rotate-180" />

        {hasGuest ? (
          <>
            <p className="line-clamp-2 max-w-full break-words px-2 font-script text-3xl leading-tight text-sindoor">
              Dearest {GUEST.name}
            </p>
            <p className="mt-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-kansa-muted">
              You are invited to the wedding of
            </p>
          </>
        ) : (
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-kansa-muted">
            The Wedding Celebration Of
          </p>
        )}
        <div aria-hidden="true" className="mt-3 flex items-center gap-2 text-kansa">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-kansa" />
          <span className="text-[10px]">✦</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-kansa" />
        </div>

        {/* Interactive twin carved doors */}
        <button
          ref={doorRef}
          onClick={onClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          aria-label="Open the wedding invitation doors"
          className="group select-none relative mt-5 mb-6 block aspect-[3/4] w-[min(70vw,17.5rem)] sm:aspect-[5/6] rounded-t-full p-[5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-kansa focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
          style={{
            background: 'linear-gradient(160deg, #E6CA7E 0%, #C59B38 35%, #8F6D22 65%, #E6CA7E 100%)',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
          }}
        >
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <pattern id={patternId} width="16" height="16" patternUnits="userSpaceOnUse">
                <path
                  d="M8 0 Q11 5 16 8 Q11 11 8 16 Q5 11 0 8 Q5 5 8 0 Z"
                  fill="none"
                  stroke="#E6CA7E"
                  strokeWidth="0.6"
                  opacity="0.32"
                />
                <circle cx="8" cy="8" r="1" fill="#E6CA7E" opacity="0.35" />
              </pattern>
            </defs>
          </svg>

          <div
            className="relative h-full w-full overflow-hidden rounded-t-full bg-cream"
            style={{ perspective: '900px' }}
          >
            {/* Revealed courtyard behind the doors */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 55%, #FFF6DA 0%, #F6E3B4 35%, #E6CA7E 70%, #C59B38 100%)',
              }}
            />
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{ opacity: opening ? 1 : 0, scale: opening ? 1.4 : 0.6 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,250,230,0.95) 0%, rgba(255,236,170,0.4) 40%, transparent 70%)' }}
            />
            <motion.div
              initial={false}
              animate={{
                scale: opening ? 1.04 : 0.92,
                ...(opening || reduced ? { opacity: opening ? 1 : 0.4 } : {}),
              }}
              style={opening || reduced ? undefined : { opacity: namesOpacity }}
              transition={{ duration: 0.8, delay: opening ? 0.15 : 0, ease: EASE }}
              className="absolute inset-0 flex flex-col items-center justify-center px-3"
            >
              <span className="font-script text-[2.4rem] leading-tight text-sindoor">
                {WEDDING_DATA.couple.groom}
              </span>
              <span className="font-serif text-lg italic text-kansa-muted">&amp;</span>
              <span className="font-script text-[2.4rem] leading-tight text-sindoor">
                {WEDDING_DATA.couple.bride}
              </span>
              <span className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-sindoor-deep">
                {WEDDING_DATA.couple.dateRange}
              </span>
              {hasGuest && (
                <span className="mt-1.5 block max-w-full truncate px-4 font-serif text-sm italic text-sindoor-deep">
                  Welcome, {GUEST.name}
                </span>
              )}
            </motion.div>

            {/* Warm light leaking through the seam */}
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={reduced ? { opacity: opening ? 0 : 0.8 } : undefined}
              style={reduced ? undefined : { opacity: seamOpacity, boxShadow: seamGlow }}
              transition={{ duration: 0.4 }}
              className="absolute inset-y-0 left-1/2 z-[5] w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#FFE9A8] to-transparent"
            />
            {/* Hover/focus bloom on the seam (separate layer so it doesn't fight the drag glow) */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 left-1/2 z-[5] w-[3px] -translate-x-1/2 opacity-0 shadow-[0_0_18px_6px_rgba(255,225,150,0.85)] transition-opacity duration-500 ${
                opening ? '' : 'group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}
            />

            <DoorLeaf side="left" patternId={patternId} opening={opening} reduced={reduced} rotateY={leftRotate} />
            <DoorLeaf side="right" patternId={patternId} opening={opening} reduced={reduced} rotateY={angle} />

            {/* Arch keystone shadow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-t-full shadow-[inset_0_6px_14px_rgba(0,0,0,0.35)]" />
          </div>

          {/* Wax-seal medallion over the seam */}
          <motion.div
            style={reduced ? undefined : { scale: sealScale, opacity: sealFade }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <motion.div
              initial={false}
              animate={{ opacity: opening ? 0 : 1, scale: opening ? 1.35 : 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full shadow-[0_6px_16px_rgba(40,5,8,0.55)] transition-transform duration-300 group-hover:scale-105"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #C92A2A 0%, #A61C24 45%, #6A0E13 100%)',
              }}
            >
              <span className="absolute inset-1 rounded-full border border-kansa-light/80" />
              <span className="absolute inset-[7px] rounded-full border border-dashed border-kansa-light/50" />
              <span className="font-serif text-[15px] font-bold tracking-[0.18em] text-kansa-light">
                {WEDDING_DATA.couple.monogram}
              </span>
            </motion.div>
          </motion.div>
        </button>

        <motion.p
          animate={reduced || opening ? { opacity: 1 } : { opacity: [0.75, 1, 0.75] }}
          transition={reduced || opening ? { duration: 0.2 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-sindoor"
        >
          {hint}
        </motion.p>
        <p className="mt-1.5 font-serif text-base italic text-ink/75">
          {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city}
        </p>
      </motion.div>
    </motion.div>
  );
}
