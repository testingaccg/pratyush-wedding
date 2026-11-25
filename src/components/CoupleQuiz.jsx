import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';

const LUXURY_EASE = [0.22, 1, 0.36, 1];
const QUIZ = WEDDING_DATA.quiz;

const VERDICTS = [
  { title: 'A Fresh Baraati!', line: 'Read the invite once more — then come dance with us.' },
  { title: 'A Promising Guest', line: 'You know the essentials. The dance floor will teach the rest.' },
  { title: 'Almost Family', line: 'Nearly flawless — the aunties will be impressed.' },
  { title: 'Inner Circle Royalty', line: 'Perfect score! You clearly belong on the front row.' },
];

export default function CoupleQuiz() {
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const done = qIdx >= QUIZ.length;
  const current = QUIZ[qIdx];

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === current.answer;
    if (correct) {
      setScore((s) => s + 1);
      soundEngine.playHoludSplash();
      window.dispatchEvent(new CustomEvent('wedding-petal-burst'));
    } else {
      soundEngine.playSoftTick();
    }
    setTimeout(() => {
      setPicked(null);
      setQIdx((q) => q + 1);
    }, 1500);
  };

  const finalScore = score;
  const restart = () => {
    soundEngine.playSoftTick();
    setQIdx(0);
    setScore(0);
    setPicked(null);
  };

  return (
    <section id="quiz" className="scroll-mt-20 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.7, ease: LUXURY_EASE }}
          className="text-center"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted">
            A Little Game While You Wait
          </p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">
            How Well Do You Know <span className="font-script font-normal">P &amp; S</span>?
          </h2>
        </motion.div>

        <div className="rajbari-frame relative mt-8 overflow-hidden bg-ivory p-6 sm:p-9">
          {/* Progress pips */}
          <div className="flex items-center justify-center gap-2" aria-hidden="true">
            {QUIZ.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  i < qIdx ? 'w-8 bg-sindoor' : i === qIdx ? 'w-8 bg-kansa' : 'w-4 bg-kansa/30'
                }`}
              />
            ))}
          </div>

          <div aria-live="polite" className="min-h-[18rem] sm:min-h-[15rem]">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key={qIdx}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: LUXURY_EASE }}
                  className="pt-6 text-center"
                >
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-kansa-muted">
                    Question {qIdx + 1} of {QUIZ.length}
                  </p>
                  <h3 className="mx-auto mt-2 max-w-md font-serif text-2xl font-semibold leading-snug text-ink">
                    {current.q}
                  </h3>
                  <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                    {current.options.map((opt, i) => {
                      const isPicked = picked === i;
                      const isAnswer = i === current.answer;
                      const reveal = picked !== null;
                      const state = reveal && isAnswer ? 'right' : reveal && isPicked ? 'wrong' : 'idle';
                      return (
                        <motion.button
                          key={opt}
                          type="button"
                          data-option
                          disabled={reveal}
                          onClick={() => choose(i)}
                          whileHover={reveal ? {} : { y: -2 }}
                          whileTap={reveal ? {} : { scale: 0.97 }}
                          animate={state === 'wrong' ? { x: [0, -6, 6, -4, 0] } : state === 'right' ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 0.4 }}
                          className={`min-h-[52px] rounded-sm border px-3 py-2.5 font-serif text-lg font-semibold transition-colors ${
                            state === 'right'
                              ? 'border-sindoor bg-sindoor text-ivory'
                              : state === 'wrong'
                                ? 'border-ink/30 bg-cream text-ink/60 line-through'
                                : 'border-kansa/50 bg-cream/50 text-sindoor hover:border-sindoor'
                          } ${reveal && state === 'idle' ? 'opacity-50' : ''}`}
                        >
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {picked !== null && (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-5 font-serif text-lg italic text-ink/80"
                      >
                        {picked === current.answer ? current.yes : current.no}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: LUXURY_EASE }}
                  className="pt-6 text-center"
                >
                  <Sparkles aria-hidden="true" className="mx-auto h-6 w-6 text-kansa" />
                  <p className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-kansa-muted">
                    You scored {finalScore} / {QUIZ.length}
                  </p>
                  <h3 className="mt-1 font-script text-5xl text-sindoor">{VERDICTS[finalScore].title}</h3>
                  <p className="mx-auto mt-2 max-w-sm font-serif text-lg italic text-ink/80">{VERDICTS[finalScore].line}</p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="#rsvp"
                      onClick={() => soundEngine.playSoftTick()}
                      className="inline-flex min-h-[44px] items-center rounded-full bg-sindoor px-6 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory shadow-md transition-colors hover:bg-sindoor-deep"
                    >
                      Now RSVP
                    </a>
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-kansa bg-cream px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-sindoor transition-colors hover:bg-kansa/20"
                    >
                      <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                      Play Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
