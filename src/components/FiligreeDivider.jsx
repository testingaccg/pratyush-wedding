import { motion } from 'framer-motion';

/**
 * Scroll-triggered gold filigree botanical divider between major sections.
 */
export default function FiligreeDivider() {
  return (
    <div className="mx-auto flex max-w-md items-center justify-center px-6 py-4" aria-hidden="true">
      <svg viewBox="0 0 320 36" className="h-7 w-full text-kansa" fill="none">
        <motion.path
          d="M10 18 Q85 4 140 18 Q85 32 10 18 Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.55"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M310 18 Q235 4 180 18 Q235 32 310 18 Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.55"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx="160"
          cy="18"
          r="5"
          fill="#A61C24"
          stroke="currentColor"
          strokeWidth="1.2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.5, delay: 0.35 }}
        />
      </svg>
    </div>
  );
}
