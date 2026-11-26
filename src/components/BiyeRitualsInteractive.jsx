import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';
import { toast } from '../utils/toast';
import { WEDDING_DATA } from '../data/weddingData';

const EASE = [0.22, 1, 0.36, 1];

const VOWS = [
  { name: 'Nourishment', note: 'Walking together in shared abundance and care.' },
  { name: 'Strength', note: 'Standing beside each other in courage and health.' },
  { name: 'Prosperity', note: 'Building a warm, welcoming home together.' },
  { name: 'Joy & Family', note: 'Honouring both families with love and gratitude.' },
  { name: 'Blessings', note: 'Cherishing every chapter yet to unfold.' },
  { name: 'Harmony', note: 'Choosing patience, laughter, and kindness daily.' },
  { name: 'Eternal Friendship', note: 'Seven steps, seven vows — friends for a lifetime.' },
];

/* 1. BORON · বরণ — Groom's Threshold Welcome with Kulo & Pradip */
function BoronStage() {
  const [circles, setCircles] = useState(0);

  const bless = () => {
    const next = circles >= 3 ? 1 : circles + 1;
    setCircles(next);
    if (next === 3) {
      soundEngine.playShankha();
      window.dispatchEvent(new CustomEvent('wedding-petal-burst'));
      toast('বরণ · Boron blessings complete ✦');
    } else {
      soundEngine.playKansaThali();
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-2 sm:flex-row sm:justify-between">
      <div
        onClick={bless}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            bless();
          }
        }}
        aria-label="Circle the Kulo for Boron blessing"
        className="relative flex h-44 w-64 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-kansa/35 bg-gradient-to-b from-ivory to-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-kansa"
      >
        <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden="true">
          {/* Pratyush Caricature Silhouette at Threshold */}
          <path d="M 90 156 C 90 116, 150 116, 150 156 Z" fill="#FAF7F2" stroke="#C59B38" strokeWidth="1.5" />
          <path d="M 102 124 L 138 156" stroke="#A61C24" strokeWidth="6.5" strokeLinecap="round" opacity="0.9" />
          <circle cx="120" cy="88" r="20" fill="#F2C8A4" stroke="#2A2320" strokeWidth="1.2" />
          <path d="M 100 84 C 100 66, 140 66, 140 84 C 132 75, 108 75, 100 84 Z" fill="#2A2320" />
          <path d="M 102 70 L 120 30 L 138 70 Z" fill="#FFFFFF" stroke="#C59B38" strokeWidth="1.5" />
          <ellipse cx="120" cy="70" rx="20" ry="4" fill="#FAF7F2" stroke="#C59B38" strokeWidth="1.3" />
          <circle cx="120" cy="29" r="2.4" fill="#A61C24" />
          <circle cx="113" cy="88" r="2" fill="#2A2320" />
          <circle cx="127" cy="88" r="2" fill="#2A2320" />
          <path d="M 115 96 Q 120 100 125 96" fill="none" stroke="#781117" strokeWidth="1.5" strokeLinecap="round" />

          {/* Orbiting Woven Bamboo Kulo with Dhan-Durba & Pradip */}
          <motion.g
            animate={{ rotate: circles * 360 }}
            transition={{ duration: 1.0, ease: EASE }}
            style={{ transformOrigin: '120px 88px' }}
          >
            <g transform="translate(164, 54)">
              <ellipse cx="18" cy="14" rx="18" ry="11" fill="#E6CA7E" stroke="#8F6D22" strokeWidth="1.3" />
              <path d="M 4 14 Q 18 22 32 14" fill="none" stroke="#8F6D22" strokeWidth="0.9" />
              {/* Green Durba & Golden Dhan */}
              <path d="M 10 12 L 6 5 M 14 11 L 12 4" stroke="#2D6A4F" strokeWidth="1.2" strokeLinecap="round" />
              {/* Clay Pradip Flame */}
              <path d="M 21 15 Q 25 20 29 15 Z" fill="#C85A32" />
              <motion.path
                d="M 25 5 Q 28 10 25 14 Q 22 10 25 5 Z"
                fill="#FFE699"
                animate={{ scaleY: [1, 1.2, 0.9, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                style={{ transformOrigin: '25px 14px' }}
              />
            </g>
          </motion.g>
        </svg>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">
          Boron · বরণ · {circles} / 3 Blessings
        </p>
        <h4 className="mt-1 font-serif text-2xl font-semibold text-sindoor">
          {circles === 3 ? 'Threshold Welcomed' : 'The Kulo & Pradip Welcome'}
        </h4>
        <p className="mt-1 font-serif text-base italic text-ink/80">
          {circles === 3
            ? 'Three auspicious circles of Dhan-Durba & Pradip complete — welcome, Pratyush!'
            : 'Tap to circle the bamboo Kulo, paddy & clay Pradip three times around the groom.'}
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={bless}
          className="mt-4 inline-flex min-h-[42px] items-center rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory shadow-sm transition-colors hover:bg-sindoor-deep"
        >
          {circles >= 3 ? 'Replay Boron' : `Circle Kulo (${circles + 1} / 3)`}
        </motion.button>
      </div>
    </div>
  );
}

/* 2. BOR & KONE · শুভদৃষ্টি — Bengali Couple Caricature */
function CoupleCaricatureStage() {
  const [revealed, setRevealed] = useState(false);

  const toggle = () => {
    const next = !revealed;
    setRevealed(next);
    if (next) {
      soundEngine.playShubhoDrishti();
      window.dispatchEvent(new CustomEvent('wedding-petal-burst'));
      toast('শুভদৃষ্টি · Pratyush & Sayanee ✦');
    } else {
      soundEngine.playSoftTick();
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-2 sm:flex-row sm:justify-between">
      <div
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        aria-label={revealed ? 'Hide bride betel leaves' : 'Reveal Shubho Drishti couple caricature'}
        className="relative flex h-44 w-64 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-kansa/35 bg-gradient-to-b from-ivory to-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-kansa"
      >
        {revealed && (
          <>
            <motion.span
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="pointer-events-none absolute h-20 w-20 rounded-full border-2 border-kansa bg-kansa/15"
            />
            <motion.span
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: -46, opacity: [0, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="pointer-events-none absolute top-14 text-sm text-sindoor"
            >
              ♥
            </motion.span>
          </>
        )}

        <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden="true">
          <motion.g
            animate={{ x: revealed ? 7 : 0, rotate: revealed ? 2 : 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 16 }}
            style={{ transformOrigin: '78px 140px' }}
          >
            <path d="M 48 156 C 48 118, 108 118, 108 156 Z" fill="#FAF7F2" stroke="#C59B38" strokeWidth="1.5" />
            <path d="M 60 124 L 96 156" stroke="#A61C24" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
            <circle cx="78" cy="86" r="22" fill="#F2C8A4" stroke="#2A2320" strokeWidth="1.2" />
            <path d="M 56 82 C 56 64, 100 64, 100 82 C 92 72, 64 72, 56 82 Z" fill="#2A2320" />
            <path d="M 58 68 L 78 24 L 98 68 Z" fill="#FFFFFF" stroke="#C59B38" strokeWidth="1.6" />
            <ellipse cx="78" cy="68" rx="22" ry="4.5" fill="#FAF7F2" stroke="#C59B38" strokeWidth="1.4" />
            <circle cx="78" cy="23" r="2.6" fill="#A61C24" />
            <circle cx="70" cy="86" r="2.2" fill="#2A2320" />
            <circle cx="86" cy="86" r="2.2" fill="#2A2320" />
            <motion.ellipse cx="65" cy="92" rx="3.5" ry="2" fill="#E88B8E" animate={{ opacity: revealed ? 0.85 : 0.3 }} />
            <motion.ellipse cx="91" cy="92" rx="3.5" ry="2" fill="#E88B8E" animate={{ opacity: revealed ? 0.85 : 0.3 }} />
            <path d={revealed ? 'M 71 95 Q 78 102 85 95' : 'M 73 96 Q 78 99 83 96'} fill="none" stroke="#781117" strokeWidth="1.6" strokeLinecap="round" />
          </motion.g>

          <motion.g
            animate={{ x: revealed ? -7 : 0, rotate: revealed ? -2 : 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 16 }}
            style={{ transformOrigin: '162px 140px' }}
          >
            <path d="M 132 156 C 132 114, 192 114, 192 156 Z" fill="#A61C24" stroke="#E6CA7E" strokeWidth="1.5" />
            <path d="M 140 124 Q 162 142 184 124" fill="none" stroke="#E6CA7E" strokeWidth="2.2" />
            <circle cx="162" cy="84" r="25" fill="#2A2320" />
            <circle cx="162" cy="88" r="21" fill="#F4CEAE" stroke="#2A2320" strokeWidth="1.2" />
            <path d="M 142 68 Q 162 42 182 68 Z" fill="#FFFFFF" stroke="#C59B38" strokeWidth="1.6" />
            <circle cx="162" cy="54" r="2.6" fill="#A61C24" />
            <circle cx="162" cy="76" r="2.2" fill="#A61C24" />
            {[-8, -4, 4, 8].map((dx) => (
              <circle key={dx} cx={162 + dx} cy={74 + Math.abs(dx) * 0.25} r="1" fill="#FAF7F2" />
            ))}
            <circle cx="154" cy="88" r="2.2" fill="#2A2320" />
            <circle cx="170" cy="88" r="2.2" fill="#2A2320" />
            <motion.ellipse cx="149" cy="94" rx="3.5" ry="2" fill="#E88B8E" animate={{ opacity: revealed ? 0.9 : 0.35 }} />
            <motion.ellipse cx="175" cy="94" rx="3.5" ry="2" fill="#E88B8E" animate={{ opacity: revealed ? 0.9 : 0.35 }} />
            <circle cx="168" cy="95" r="3" fill="none" stroke="#E6CA7E" strokeWidth="1.1" />
            <path d={revealed ? 'M 155 97 Q 162 103 169 97' : 'M 157 98 Q 162 101 167 98'} fill="none" stroke="#781117" strokeWidth="1.6" strokeLinecap="round" />

            <motion.g
              animate={{
                y: revealed ? 34 : 0,
                opacity: revealed ? 0.25 : 1,
                scale: revealed ? 0.85 : 1,
              }}
              transition={{ duration: 0.75, ease: EASE }}
              style={{ transformOrigin: '162px 104px' }}
            >
              <path d="M 150 72 C 160 80, 162 98, 150 105 C 138 98, 140 80, 150 72 Z" fill="#1E5631" stroke="#E6CA7E" strokeWidth="1.2" />
              <path d="M 174 72 C 184 80, 186 98, 174 105 C 162 98, 164 80, 174 72 Z" fill="#246A3B" stroke="#E6CA7E" strokeWidth="1.2" />
            </motion.g>
          </motion.g>
        </svg>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">
          Bor &amp; Kone · শুভদৃষ্টি
        </p>
        <h4 className="mt-1 font-serif text-2xl font-semibold text-sindoor">
          {revealed ? `${WEDDING_DATA.couple.groom} & ${WEDDING_DATA.couple.bride}` : 'Shubho Drishti Moment'}
        </h4>
        <p className="mt-1 font-serif text-base italic text-ink/80">
          {revealed
            ? 'The betel leaves lower, eyes meet, and both families burst into Uludhwani.'
            : 'Tap to lower the Paan Pata leaves for Pratyush & Sayanee’s Shubho Drishti.'}
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          className="mt-4 inline-flex min-h-[42px] items-center rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory shadow-sm transition-colors hover:bg-sindoor-deep"
        >
          {revealed ? 'Reset Betel Leaves' : 'Reveal Shubho Drishti'}
        </motion.button>
      </div>
    </div>
  );
}

/* 3. SAPTAPADI · সপ্তপদী — Orbiting Sacred Agni */
function SaptapadiStage() {
  const [step, setStep] = useState(0);

  const walkStep = () => {
    const next = step >= 7 ? 1 : step + 1;
    soundEngine.playSaatPaakStep(next - 1);
    setStep(next);
    if (next === 7) {
      soundEngine.playPradipLit();
      window.dispatchEvent(new CustomEvent('wedding-petal-burst'));
      toast('সপ্তপদী · Seven sacred vows complete ✦');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-2 sm:flex-row sm:justify-between">
      <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
        <svg viewBox="0 0 180 180" className="h-full w-full overflow-visible" aria-hidden="true">
          <circle
            cx="90"
            cy="90"
            r="68"
            fill="none"
            stroke="#C59B38"
            strokeOpacity="0.4"
            strokeWidth="1.2"
            strokeDasharray="4 5"
          />
          <circle cx="90" cy="90" r="54" fill="none" stroke="#A61C24" strokeOpacity="0.18" strokeWidth="1" />

          {VOWS.map((v, i) => {
            const rad = ((i * 360) / 7 - 90) * (Math.PI / 180);
            const px = 90 + Math.cos(rad) * 68;
            const py = 90 + Math.sin(rad) * 68;
            const lit = i < step;
            return (
              <g key={v.name} transform={`translate(${px}, ${py})`}>
                <motion.circle
                  r={lit ? 6 : 4.5}
                  fill={lit ? '#A61C24' : '#FAF7F2'}
                  stroke="#C59B38"
                  strokeWidth="1.3"
                  animate={lit ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.35 }}
                />
                {lit && <circle r="2" fill="#E6CA7E" />}
              </g>
            );
          })}

          <ellipse cx="90" cy="108" rx="20" ry="6" fill="#C85A32" opacity="0.85" />
          <rect x="76" y="102" width="28" height="7" rx="2" fill="#781117" />
          <motion.path
            d="M 90 64 C 102 80, 104 96, 90 103 C 76 96, 78 80, 90 64 Z"
            fill="#E8B923"
            animate={{ scaleY: [1, 1.12, 0.94, 1], scaleX: [1, 0.96, 1.04, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '90px 102px' }}
          />
          <motion.path
            d="M 90 73 C 97 84, 98 96, 90 102 C 82 96, 83 84, 90 73 Z"
            fill="#A61C24"
            animate={{ scaleY: [1, 0.92, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '90px 102px' }}
          />
          <circle cx="90" cy="94" r="4" fill="#FFF3C9" opacity="0.9" />
        </svg>

        <motion.div
          aria-hidden="true"
          animate={{ rotate: step * 360 }}
          transition={{ duration: 1.05, ease: EASE }}
          className="pointer-events-none absolute inset-0"
        >
          <span className="absolute left-1/2 top-[13px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-ivory bg-sindoor shadow-[0_0_10px_rgba(166,28,36,0.7)]" />
          <span className="absolute bottom-[13px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-ivory bg-kansa shadow-[0_0_10px_rgba(197,155,56,0.8)]" />
        </motion.div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">
          Saat Paak &amp; Saptapadi · {step} / 7 Steps
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <h4 className="mt-1 font-serif text-2xl font-semibold text-sindoor">
              {step === 0 ? 'Saptapadi Around the Agni' : `Step ${step}: ${VOWS[step - 1].name}`}
            </h4>
            <p className="mt-1 font-serif text-base italic text-ink/80">
              {step === 0
                ? 'Tap below to walk each of the seven auspicious steps of Saptapadi.'
                : VOWS[step - 1].note}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={walkStep}
          className="mt-4 inline-flex min-h-[42px] items-center rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory shadow-sm transition-colors hover:bg-sindoor-deep"
        >
          {step >= 7 ? 'Replay Saptapadi' : `Walk Step ${step + 1} / 7`}
        </motion.button>
      </div>
    </div>
  );
}

/* 4. KHOI DAAN · খই দান — Puffed-Rice Offerings Into the Sacred Agni */
function KhoiDaanStage() {
  const [offerings, setOfferings] = useState(0);

  const tossKhoi = () => {
    setOfferings((c) => c + 1);
    soundEngine.playHoludSplash();
    if ((offerings + 1) % 3 === 0) {
      toast('খই দান · Offerings accepted by the sacred fire ✦');
    }
  };

  const grains = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 68 + ((i * 19) % 104) - 52,
    delay: (i % 5) * 0.06,
  }));

  return (
    <div className="flex flex-col items-center gap-5 py-2 sm:flex-row sm:justify-between">
      <div
        onClick={tossKhoi}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tossKhoi();
          }
        }}
        aria-label="Offer Khoi into the sacred fire"
        className="relative flex h-44 w-64 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-kansa/35 bg-gradient-to-b from-ivory to-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-kansa"
      >
        <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden="true">
          {/* Cupped Hands at Top */}
          <path d="M 88 26 Q 120 42 152 26" fill="#F2C8A4" stroke="#8F6D22" strokeWidth="1.2" />
          <path d="M 96 28 Q 120 35 144 28" fill="#FAF7F2" stroke="#E6CA7E" strokeWidth="1" />

          {/* Falling Golden Khoi Grains on Tap */}
          {offerings > 0 && (
            <g key={offerings}>
              {grains.map((gr) => (
                <motion.ellipse
                  key={gr.id}
                  cx={120 + gr.x * 0.35}
                  cy={34}
                  rx="3.2"
                  ry="2.2"
                  fill={gr.id % 2 === 0 ? '#FAF7F2' : '#FFE699'}
                  stroke="#C59B38"
                  strokeWidth="0.5"
                  initial={{ y: 0, opacity: 1, scale: 0.9 }}
                  animate={{ y: 74, x: gr.x * 0.15, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.85, delay: gr.delay, ease: 'easeIn' }}
                />
              ))}
            </g>
          )}

          {/* Sacred Homa Kund & Brightening Flames */}
          <ellipse cx="120" cy="134" rx="34" ry="8" fill="#C85A32" opacity="0.85" />
          <rect x="96" y="126" width="48" height="9" rx="3" fill="#781117" />
          <motion.path
            d="M 120 72 C 138 96, 140 120, 120 128 C 100 120, 102 96, 120 72 Z"
            fill="#E8B923"
            animate={{
              scaleY: offerings > 0 ? [1, 1.24, 1.04] : [1, 1.08, 0.95, 1],
            }}
            transition={{ duration: 0.8, repeat: offerings > 0 ? 0 : Infinity }}
            style={{ transformOrigin: '120px 127px' }}
          />
          <path d="M 120 86 C 130 102, 131 119, 120 126 C 109 119, 110 102, 120 86 Z" fill="#A61C24" />
          <circle cx="120" cy="116" r="5" fill="#FFF3C9" opacity="0.9" />
        </svg>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">
          Khoi Daan · খই দান {offerings > 0 ? `· ${offerings} Offered` : ''}
        </p>
        <h4 className="mt-1 font-serif text-2xl font-semibold text-sindoor">
          Offerings to the Sacred Fire
        </h4>
        <p className="mt-1 font-serif text-base italic text-ink/80">
          Tap to shower golden puffed rice (Khoi) into the Homa Agni for warmth &amp; prosperity.
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={tossKhoi}
          className="mt-4 inline-flex min-h-[42px] items-center rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory shadow-sm transition-colors hover:bg-sindoor-deep"
        >
          Offer Khoi to Agni
        </motion.button>
      </div>
    </div>
  );
}

/* 5. SINDOOR DAAN · সিঁদুরদান — Sacred Vermilion Blessing */
function SindoorDaanStage() {
  const [applied, setApplied] = useState(false);

  const applySindoor = () => {
    const next = !applied;
    setApplied(next);
    if (next) {
      soundEngine.playPradipLit();
      window.dispatchEvent(new CustomEvent('wedding-petal-burst'));
      toast('সিঁদুরদান · Blessed in eternal vermilion ✦');
    } else {
      soundEngine.playSoftTick();
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-2 sm:flex-row sm:justify-between">
      <div
        onClick={applySindoor}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            applySindoor();
          }
        }}
        aria-label={applied ? 'Reset Sindoor Daan' : 'Apply Sindoor blessing'}
        className="relative flex h-44 w-64 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-kansa/35 bg-gradient-to-b from-ivory to-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-kansa"
      >
        {applied && (
          <motion.span
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="pointer-events-none absolute h-20 w-20 rounded-full border-2 border-sindoor/60 bg-kansa/15"
          />
        )}

        <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden="true">
          {/* Lajja Bastra Crimson Bridal Veil Drape */}
          <path d="M 62 158 C 62 72, 92 26, 120 24 C 148 26, 178 72, 178 158 Z" fill="#A61C24" opacity="0.92" />
          <path d="M 66 156 C 68 80, 96 34, 120 32 C 144 34, 172 80, 174 156" fill="none" stroke="#E6CA7E" strokeWidth="2.5" />

          {/* Sayanee's Hairline & Forehead */}
          <circle cx="120" cy="88" r="28" fill="#2A2320" />
          <circle cx="120" cy="96" r="24" fill="#F4CEAE" />
          {/* Hair parting (Maang) */}
          <line x1="120" y1="62" x2="120" y2="82" stroke="#F4CEAE" strokeWidth="3.5" strokeLinecap="round" />

          {/* Animated Vermilion Sindoor Stroke */}
          <motion.line
            x1="120"
            y1="82"
            x2="120"
            y2="62"
            stroke="#C92A2A"
            strokeWidth="4.2"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: applied ? 1 : 0, opacity: applied ? 1 : 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          />
          {applied && (
            <motion.circle
              cx="120"
              cy="72"
              r="14"
              fill="#A61C24"
              initial={{ opacity: 0.4, scale: 0.5 }}
              animate={{ opacity: 0, scale: 1.8 }}
              transition={{ duration: 1.1 }}
            />
          )}

          {/* Chandan Dots & Bindi */}
          <circle cx="120" cy="86" r="2.6" fill="#A61C24" />
          {[-9, -4.5, 4.5, 9].map((dx) => (
            <circle key={dx} cx={120 + dx} cy={83 + Math.abs(dx) * 0.2} r="1.1" fill="#FAF7F2" />
          ))}
          {/* Closed serene eyes */}
          <path d="M 106 96 Q 111 99 116 96 M 124 96 Q 129 99 134 96" fill="none" stroke="#2A2320" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 114 108 Q 120 113 126 108" fill="none" stroke="#781117" strokeWidth="1.5" strokeLinecap="round" />

          {/* Golden Sindoor Kouto (Box) on the side */}
          <g transform="translate(174, 114)">
            <ellipse cx="14" cy="18" rx="14" ry="5" fill="#C59B38" stroke="#8F6D22" strokeWidth="1" />
            <ellipse cx="14" cy="14" rx="12" ry="4" fill="#A61C24" />
            <path d="M 6 10 Q 14 2 22 10 Z" fill="#E6CA7E" stroke="#8F6D22" strokeWidth="1" />
          </g>
        </svg>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">
          Sindoor Daan · সিঁদুরদান
        </p>
        <h4 className="mt-1 font-serif text-2xl font-semibold text-sindoor">
          {applied ? 'Forever Sealed in Sindoor' : 'Sacred Vermilion Blessing'}
        </h4>
        <p className="mt-1 font-serif text-base italic text-ink/80">
          {applied
            ? 'Beneath the crimson Lajja Bastra veil, Pratyush adorns Sayanee with auspicious sindoor.'
            : 'Tap to gently apply the sacred sindoor stroke beneath the bridal veil.'}
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={applySindoor}
          className="mt-4 inline-flex min-h-[42px] items-center rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory shadow-sm transition-colors hover:bg-sindoor-deep"
        >
          {applied ? 'Replay Sindoor Daan' : 'Apply Sindoor'}
        </motion.button>
      </div>
    </div>
  );
}

/* 6. KORI KHELA · কড়ি খেলা — Playful Post-Biye Cowrie Shell Game */
const SHELL_LAYOUT = [
  { cx: 88, cy: 64, rot: -22 },
  { cx: 120, cy: 52, rot: 14 },
  { cx: 152, cy: 68, rot: 38 },
  { cx: 98, cy: 96, rot: 18 },
  { cx: 138, cy: 100, rot: -34 },
];

function KoriKhelaStage() {
  const [rollCount, setRollCount] = useState(0);
  const [faceUp, setFaceUp] = useState([true, false, true, true, false]);

  const tossShells = () => {
    const nextRoll = rollCount + 1;
    // Alternate lively outcomes so guests enjoy seeing both Pratyush & Sayanee win
    const nextFaces = SHELL_LAYOUT.map((_, i) => ((nextRoll + i) * 7) % 3 !== 0);
    setRollCount(nextRoll);
    setFaceUp(nextFaces);
    soundEngine.playKansaThali();
  };

  const count = faceUp.filter(Boolean).length;
  const winnerLine =
    rollCount === 0
      ? 'Tap to toss five auspicious white cowrie shells onto the Alpona mat.'
      : count >= 3
        ? `${WEDDING_DATA.couple.bride} scooped ${count} of 5 shells — she holds the keys to the home!`
        : `${WEDDING_DATA.couple.groom} won this round (${5 - count} shells) — a playful tie-breaker awaits!`;

  return (
    <div className="flex flex-col items-center gap-5 py-2 sm:flex-row sm:justify-between">
      <div
        onClick={tossShells}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tossShells();
          }
        }}
        aria-label="Toss cowrie shells for Kori Khela"
        className="relative flex h-44 w-64 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-kansa/35 bg-gradient-to-b from-ivory to-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-kansa"
      >
        <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden="true">
          {/* Alpona Mat Ring */}
          <circle cx="120" cy="80" r="56" fill="#A61C24" fillOpacity="0.06" stroke="#C59B38" strokeWidth="1.2" strokeDasharray="4 4" />
          <circle cx="120" cy="80" r="40" fill="none" stroke="#A61C24" strokeOpacity="0.25" strokeWidth="1" />

          {/* 5 Cowrie Shells (Kori) */}
          {SHELL_LAYOUT.map((sh, i) => {
            const up = faceUp[i];
            return (
              <motion.g
                key={`${rollCount}-${i}`}
                initial={{ y: -26, opacity: 0.4, rotate: sh.rot - 90 }}
                animate={{ y: 0, opacity: 1, rotate: sh.rot + (rollCount % 2 === 0 ? 0 : 25) }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: i * 0.04 }}
                style={{ transformOrigin: `${sh.cx}px ${sh.cy}px` }}
              >
                <ellipse
                  cx={sh.cx}
                  cy={sh.cy}
                  rx="11"
                  ry="7.5"
                  fill={up ? '#FFFFFF' : '#F3ECE1'}
                  stroke={up ? '#C59B38' : '#8F6D22'}
                  strokeWidth="1.3"
                />
                {up && (
                  <line
                    x1={sh.cx - 6}
                    y1={sh.cy}
                    x2={sh.cx + 6}
                    y2={sh.cy}
                    stroke="#A61C24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">
          Kori Khela · কড়ি খেলা {rollCount > 0 ? `· Round ${rollCount}` : ''}
        </p>
        <h4 className="mt-1 font-serif text-2xl font-semibold text-sindoor">
          The Cowrie Shell Game
        </h4>
        <p className="mt-1 font-serif text-base italic text-ink/80">
          {winnerLine}
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={tossShells}
          className="mt-4 inline-flex min-h-[42px] items-center rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory shadow-sm transition-colors hover:bg-sindoor-deep"
        >
          {rollCount === 0 ? 'Toss Cowrie Shells' : 'Play Another Round'}
        </motion.button>
      </div>
    </div>
  );
}

const RITUAL_TABS = [
  { id: 'boron', label: 'Boron · বরণ' },
  { id: 'caricature', label: 'Shubho Drishti · শুভদৃষ্টি' },
  { id: 'saptapadi', label: 'Saptapadi · সপ্তপদী' },
  { id: 'khoidaan', label: 'Khoi Daan · খই দান' },
  { id: 'sindoordaan', label: 'Sindoor Daan · সিঁদুরদান' },
  { id: 'korikhela', label: 'Kori Khela · কড়ি খেলা' },
];

export default function BiyeRitualsInteractive() {
  const [tab, setTab] = useState('caricature');

  return (
    <div className="mt-7 rounded-sm border border-kansa/35 bg-cream/45 p-4 sm:p-6">
      <div className="mb-4 border-b border-kansa/20 pb-3">
        <p className="mb-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">
          Interactive Ceremony Moments · Tap a Ritual
        </p>

        <div role="tablist" aria-label="Interactive ceremony rituals" className="flex flex-wrap items-center gap-1.5">
          {RITUAL_TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => {
                  soundEngine.playSoftTick();
                  setTab(item.id);
                }}
                className={`relative min-h-[36px] rounded-full px-3 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  active ? 'text-ivory' : 'text-sindoor hover:bg-ivory'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="biyeRitualPill"
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="absolute inset-0 rounded-full bg-sindoor shadow-sm"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {tab === 'boron' && <BoronStage />}
          {tab === 'caricature' && <CoupleCaricatureStage />}
          {tab === 'saptapadi' && <SaptapadiStage />}
          {tab === 'khoidaan' && <KhoiDaanStage />}
          {tab === 'sindoordaan' && <SindoorDaanStage />}
          {tab === 'korikhela' && <KoriKhelaStage />}
        </motion.div>
      </AnimatePresence>

      {/* Guided Chapter Progression */}
      <div className="mt-4 flex items-center justify-between border-t border-kansa/20 pt-3">
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink/55">
          {RITUAL_TABS.findIndex((t) => t.id === tab) + 1} of {RITUAL_TABS.length} · Tap stage to interact
        </span>
        <button
          type="button"
          onClick={() => {
            soundEngine.playSoftTick();
            const idx = RITUAL_TABS.findIndex((t) => t.id === tab);
            setTab(RITUAL_TABS[(idx + 1) % RITUAL_TABS.length].id);
          }}
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-sindoor underline-offset-4 hover:underline"
        >
          Next: {RITUAL_TABS[(RITUAL_TABS.findIndex((t) => t.id === tab) + 1) % RITUAL_TABS.length].label.split(' · ')[0]} →
        </button>
      </div>
    </div>
  );
}
