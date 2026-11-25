import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

const LOOKBOOK = [
  {
    id: 'mehendi',
    event: '01 · Mehendi',
    title: 'Garden Botanicals & Sunlit Greens',
    fabric: 'Breezy Organza, Chanderi & Floral Silhouettes',
    jewelry: 'Fresh floral jhumkas, pearls & minimal gold',
    swatches: [
      { name: 'Emerald', hex: '#2D6A4F' },
      { name: 'Pistachio', hex: '#95D5B2' },
      { name: 'Blush Rose', hex: '#F2C6C2' },
    ],
  },
  {
    id: 'haldi',
    event: '02 · Haldi',
    title: 'Golden Marigold & Ivory',
    fabric: 'Breathable Cotton, Mulmul & Linen',
    jewelry: 'Shells, gotta patti & sunlit statement drops',
    swatches: [
      { name: 'Marigold', hex: '#E8B923' },
      { name: 'Saffron', hex: '#F4A261' },
      { name: 'Raw Ivory', hex: '#FAF7F2' },
    ],
  },
  {
    id: 'sangeet',
    event: '03 · Sangeet',
    title: 'Starlit Jewel Tones & Shimmer',
    fabric: 'Raw Silk, Sequined Georgette & Velvet',
    jewelry: 'Polki chokers, cocktail rings & metallic heels',
    swatches: [
      { name: 'Midnight Indigo', hex: '#1B263B' },
      { name: 'Wine Plum', hex: '#5B1A33' },
      { name: 'Antique Gold', hex: '#C59B38' },
    ],
  },
  {
    id: 'wedding',
    event: '04 · Wedding',
    title: 'Timeless Crimson & Heritage Gold',
    fabric: 'Banarasi Silk, Kanjivaram & Embroidered Sherwanis',
    jewelry: 'Heirloom kundan, temple gold & traditional bangles',
    swatches: [
      { name: 'Sindoor Crimson', hex: '#A61C24' },
      { name: 'Burnished Gold', hex: '#C59B38' },
      { name: 'Sandstone Cream', hex: '#F3ECE1' },
    ],
  },
  {
    id: 'reception',
    event: '05 · Reception',
    title: 'Candlelit Champagne & Terracotta',
    fabric: 'Satin Drapes, Ivory Silk & Tailored Tuxedos',
    jewelry: 'Diamonds, delicate solitaire drops & sleek clutches',
    swatches: [
      { name: 'Terracotta', hex: '#C85A32' },
      { name: 'Champagne', hex: '#E6CA7E' },
      { name: 'Ivory Silk', hex: '#FAF7F2' },
    ],
  },
];

const LUXURY_EASE = [0.22, 1, 0.36, 1];

export default function AttirePalette() {
  const [activeId, setActiveId] = useState('wedding');
  const active = LOOKBOOK.find((item) => item.id === activeId) || LOOKBOOK[0];

  return (
    <section className="mx-auto max-w-5xl px-4 pb-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.7, ease: LUXURY_EASE }}
        className="text-center"
      >
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted">
          Curated Styling Guide
        </p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">
          The Wedding Palette
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic text-ink/75">
          Tap each celebration to explore the fabric moodboard &amp; colour swatches curated for our guests.
        </p>
      </motion.div>

      {/* Event Pill Tabs */}
      <div role="tablist" aria-label="Celebration lookbooks" className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {LOOKBOOK.map((item) => {
          const isSelected = item.id === activeId;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls="attire-panel"
              onClick={() => {
                soundEngine.playSoftTick();
                setActiveId(item.id);
              }}
              className={`relative min-h-[44px] rounded-full px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                isSelected ? 'text-ivory' : 'text-sindoor hover:bg-cream'
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="attireTabPill"
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="absolute inset-0 rounded-full bg-sindoor shadow-md"
                />
              )}
              <span className="relative z-10">{item.event}</span>
            </button>
          );
        })}
      </div>

      {/* Lookbook Card */}
      <div id="attire-panel" role="tabpanel" aria-live="polite" className="rajbari-frame mt-8 overflow-hidden bg-ivory p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: LUXURY_EASE }}
            className="grid items-center gap-8 md:grid-cols-12"
          >
            {/* Left Styling Notes */}
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-kansa-muted">
                <Sparkles className="h-3.5 w-3.5 text-kansa" />
                {active.event} Lookbook
              </div>
              <h3 className="mt-2 font-serif text-3xl font-semibold text-sindoor">
                {active.title}
              </h3>

              <div className="mt-5 space-y-3 border-l-2 border-kansa/55 pl-4">
                <div>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
                    Silhouettes &amp; Fabrics
                  </span>
                  <p className="font-serif text-lg text-ink/85">{active.fabric}</p>
                </div>
                <div>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
                    Finishing Touches
                  </span>
                  <p className="font-serif text-lg text-ink/85">{active.jewelry}</p>
                </div>
              </div>
            </div>

            {/* Right Silk Swatches */}
            <div className="grid grid-cols-3 gap-3 md:col-span-5">
              {active.swatches.map((swatch, idx) => (
                <motion.div
                  key={swatch.name}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center rounded-sm border border-kansa/35 bg-cream/60 p-3 text-center shadow-sm"
                >
                  <div
                    role="img"
                    aria-label={`${swatch.name} swatch ${swatch.hex}`}
                    className="h-16 w-16 rounded-full border-2 border-ivory shadow-inner ring-1 ring-kansa/45 sm:h-20 sm:w-20"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 60%), ${swatch.hex}`,
                    }}
                  />
                  <span className="mt-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/80">
                    {swatch.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
