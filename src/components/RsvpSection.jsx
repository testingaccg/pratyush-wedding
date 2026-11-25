import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Ticket, Check, X } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

export default function RsvpSection() {
  const [team, setTeam] = useState('groom');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [selectedEvents, setSelectedEvents] = useState(
    WEDDING_DATA.events.map((e) => e.id)
  );
  const [showPass, setShowPass] = useState(false);

  const toggleEvent = (id) => {
    soundEngine.playSoftTick();
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const eventNames = WEDDING_DATA.events
    .filter((e) => selectedEvents.includes(e.id))
    .map((e) => e.title)
    .join(', ');

  const teamLabel =
    team === 'groom'
      ? `Team Groom (${WEDDING_DATA.couple.groom})`
      : `Team Bride (${WEDDING_DATA.couple.bride})`;

  const handleWhatsApp = () => {
    if (!name.trim()) return;
    soundEngine.playPradipLit();
    const text = encodeURIComponent(
      `Namaste! RSVP for ${WEDDING_DATA.couple.groom} & ${WEDDING_DATA.couple.bride}'s Wedding\n` +
        `Name: ${name.trim()}\n` +
        `Side: ${teamLabel}\n` +
        `Guests: ${guests}\n` +
        `Attending: ${eventNames || 'All 5 celebrations'}\n` +
        (note.trim() ? `Note: ${note.trim()}` : '')
    );
    window.open(
      `https://wa.me/${WEDDING_DATA.couple.whatsappNumber}?text=${text}`,
      '_blank'
    );
  };

  return (
    <section id="rsvp" className="bg-cream/65 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.7, ease: LUXURY_EASE }}
          className="text-center"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted">
            RSVP
          </p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">
            Will You Join Us?
          </h2>
          <p className="mt-2 font-serif text-lg italic text-ink/75">
            Choose your side, pick your celebrations &amp; unlock your digital keepsake pass.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.7, delay: 0.1, ease: LUXURY_EASE }}
          className="rajbari-frame mt-10 bg-ivory p-6 shadow-md sm:p-10"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { id: 'groom', label: 'Team Groom', name: WEDDING_DATA.couple.groom },
              { id: 'bride', label: 'Team Bride', name: WEDDING_DATA.couple.bride },
            ].map((item) => {
              const active = team === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    soundEngine.playSoftTick();
                    setTeam(item.id);
                  }}
                  className={`flex flex-col items-center rounded-sm border p-4 transition-all ${
                    active
                      ? 'border-kansa bg-sindoor text-ivory shadow-md'
                      : 'border-kansa/45 bg-cream/60 text-sindoor hover:border-sindoor'
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      active ? 'fill-kansa-light text-kansa-light' : 'text-sindoor'
                    }`}
                  />
                  <span className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] opacity-90">
                    {item.label}
                  </span>
                  <span className="mt-0.5 font-serif text-2xl font-semibold">
                    {item.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6">
            <label className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
              Celebrations Attending
            </label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {WEDDING_DATA.events.map((ev) => {
                const checked = selectedEvents.includes(ev.id);
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => toggleEvent(ev.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium transition-colors ${
                      checked
                        ? 'border-sindoor bg-sindoor text-ivory'
                        : 'border-kansa/45 bg-ivory text-ink/75 hover:border-sindoor'
                    }`}
                  >
                    {checked && <Check className="h-3 w-3 text-kansa-light" />}
                    {ev.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-sm border border-kansa/35 bg-cream/55 px-4 py-3">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sindoor">
              Number of Guests
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSoftTick();
                  setGuests((g) => Math.max(1, g - 1));
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-kansa/60 bg-ivory font-semibold text-sindoor hover:bg-sindoor hover:text-ivory"
              >
                -
              </button>
              <span className="w-6 text-center font-serif text-xl font-semibold text-sindoor">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSoftTick();
                  setGuests((g) => Math.min(10, g + 1));
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-kansa/60 bg-ivory font-semibold text-sindoor hover:bg-sindoor hover:text-ivory"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
                Your Name(s) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Aarav & family"
                className="mt-1.5 w-full rounded-sm border border-kansa/45 bg-ivory px-3.5 py-2.5 font-sans text-sm text-ink placeholder:text-ink/40 focus:border-sindoor focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
                A Note for the Couple (Optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your blessings or arrival details..."
                className="mt-1.5 w-full rounded-sm border border-kansa/45 bg-ivory px-3.5 py-2.5 font-sans text-sm text-ink placeholder:text-ink/40 focus:border-sindoor focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <motion.button
              type="button"
              whileHover={name.trim() ? { scale: 1.02 } : {}}
              whileTap={name.trim() ? { scale: 0.98 } : {}}
              disabled={!name.trim()}
              onClick={handleWhatsApp}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sindoor px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ivory shadow-md transition-all hover:bg-sindoor-deep disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Send className="h-4 w-4 text-kansa-light" />
              Send RSVP on WhatsApp
            </motion.button>

            <motion.button
              type="button"
              whileHover={name.trim() ? { scale: 1.02 } : {}}
              whileTap={name.trim() ? { scale: 0.98 } : {}}
              disabled={!name.trim()}
              onClick={() => {
                soundEngine.playPradipLit();
                setShowPass(true);
              }}
              className="flex items-center justify-center gap-2 rounded-full border border-kansa bg-cream px-5 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sindoor transition-colors hover:bg-kansa/20 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Ticket className="h-4 w-4" />
              Invite Pass
            </motion.button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPass(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-indigoNight/85 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 18, rotateX: 8 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 18 }}
              transition={{ duration: 0.45, ease: LUXURY_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="alpona-frame relative w-full max-w-md overflow-hidden bg-sindoor p-8 text-center text-ivory shadow-2xl"
            >
              <button
                onClick={() => setShowPass(false)}
                aria-label="Close pass"
                className="absolute right-3 top-3 rounded-full p-1.5 text-kansa-light hover:bg-sindoor-deep"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-kansa-light">
                Royal Guest Pass · {WEDDING_DATA.couple.hashtag}
              </p>
              <h3 className="mt-2 font-script text-5xl text-ivory">
                {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
              </h3>
              <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.22em] text-kansa-light/90">
                {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city}
              </p>

              <div className="my-6 border-y border-dashed border-kansa-light/50 py-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-kansa-light">
                  Honoured Guest(s)
                </p>
                <p className="mt-1 font-serif text-3xl font-semibold text-ivory">
                  {name}
                </p>
                <p className="mt-2 font-sans text-xs uppercase tracking-[0.18em] text-kansa-light">
                  {teamLabel} · {guests} {guests === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>

              <p className="font-serif text-sm italic text-ivory/90">
                Celebrations: {eventNames || 'All 5 Celebrations'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
