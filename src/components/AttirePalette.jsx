import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

const SWATCHES = [
  { name: 'Sindoor Crimson', hex: '#A61C24' },
  { name: 'Burnished Gold', hex: '#C59B38' },
  { name: 'Sandstone Cream', hex: '#F3ECE1' },
];

export default function AttirePalette() {
  const { lang } = useLang();

  return (
    <section id="attire" className="mx-auto max-w-5xl scroll-mt-20 px-4 pb-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.7, ease: LUXURY_EASE }}
        className="text-center"
      >
        <p className={lang === 'bn' ? 'font-bengali text-sm font-semibold text-sindoor' : 'font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted'}>
          {lang === 'bn' ? 'বিবাহের পোশাক-সজ্জা' : 'Curated Styling Guide'}
        </p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">
          {lang === 'bn' ? <span lang="bn" className="font-bengali">সাবেকি সাজ ও রঙ</span> : 'The Wedding Palette'}
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic text-ink/75">
          Timeless silhouettes &amp; festive colours for our Shubho Biye evening in Kolkata.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.6, ease: LUXURY_EASE }}
        className="rajbari-frame mt-8 overflow-hidden bg-ivory p-6 sm:p-10"
      >
        <div className="grid items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-kansa-muted">
              Shubho Biye · 16 February 2027
            </p>
            <h3 className="mt-2 font-serif text-3xl font-semibold text-sindoor">
              Timeless Crimson &amp; Heritage Gold
            </h3>

            <div className="mt-5 space-y-3 border-l-2 border-kansa/55 pl-4">
              <div>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
                  For Ladies
                </span>
                <p className="font-serif text-lg text-ink/85">
                  Banarasi, Garad or Kanjivaram silk sarees paired with heirloom gold or temple jewellery
                </p>
              </div>
              <div>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
                  For Gentlemen
                </span>
                <p className="font-serif text-lg text-ink/85">
                  Embroidered silk Panjabis with Dhuti, or classic Bandhgalas &amp; light winter shawls
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:col-span-5">
            {SWATCHES.map((swatch, idx) => (
              <motion.div
                key={swatch.name}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
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
        </div>
      </motion.div>
    </section>
  );
}
