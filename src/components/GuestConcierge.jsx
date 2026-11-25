import { motion } from 'framer-motion';
import { WEDDING_DATA } from '../data/weddingData';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

export default function GuestConcierge() {
  return (
    <section id="concierge" className="mx-auto max-w-5xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.7, ease: LUXURY_EASE }}
        className="text-center"
      >
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted">
          Guest Concierge
        </p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">
          Things To Know
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WEDDING_DATA.concierge.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.55, delay: idx * 0.08, ease: LUXURY_EASE }}
            whileHover={{ y: -4 }}
            className="alpona-frame bg-ivory p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">
              {item.label}
            </p>
            <h3 className="mt-2 font-serif text-xl font-semibold text-sindoor">
              {item.value}
            </h3>
            <p className="mt-2 font-sans text-xs leading-relaxed text-ink/75">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
