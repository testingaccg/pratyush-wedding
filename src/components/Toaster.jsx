import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/** Listens for `wedding-toast` events (see utils/toast.js) and shows one at a time. */
export default function Toaster() {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let timer;
    const onToast = (e) => {
      setMsg({ text: e.detail, id: Date.now() });
      clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 3200);
    };
    window.addEventListener('wedding-toast', onToast);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('wedding-toast', onToast);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 sm:bottom-8"
    >
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="flex max-w-sm items-center gap-2.5 rounded-full border border-kansa/60 bg-sindoor px-5 py-3 font-sans text-xs font-semibold tracking-wide text-ivory shadow-2xl"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-kansa-light" />
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
