import { useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Ticket, Check, X, Download, Share2, Loader2 } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';
import { useModal } from '../utils/useModal';
import { renderPassBlob, passFileName } from '../utils/passCanvas';
import { toast } from '../utils/toast';
import { GUEST } from '../utils/guest';

const LUXURY_EASE = [0.22, 1, 0.36, 1];
const MAX_GUESTS = 10;

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export default function RsvpSection() {
  const uid = useId();
  const nameId = `${uid}-name`;
  const noteId = `${uid}-note`;
  const errId = `${uid}-err`;
  const nameRef = useRef(null);

  // Personalised links (?guest=…&team=…&n=…) pre-fill the form.
  const [team, setTeam] = useState(GUEST.team || 'groom');
  const [guests, setGuests] = useState(GUEST.count || 2);
  const [name, setName] = useState(GUEST.name);
  const [note, setNote] = useState('');
  const [touched, setTouched] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(WEDDING_DATA.events.map((e) => e.id));
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(null); // 'save' | 'share' | null

  const passRef = useModal(showPass, () => setShowPass(false));

  const nameValid = name.trim().length > 0;
  const eventsValid = selectedEvents.length > 0;
  const showNameError = touched && !nameValid;
  const showEventsError = touched && !eventsValid;

  const toggleEvent = (id) => {
    soundEngine.playSoftTick();
    setSelectedEvents((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const chosenEvents = WEDDING_DATA.events.filter((e) => selectedEvents.includes(e.id));
  const eventNames = chosenEvents.map((e) => e.title).join(', ');

  const teamLabel =
    team === 'groom'
      ? `Team Groom (${WEDDING_DATA.couple.groom})`
      : `Team Bride (${WEDDING_DATA.couple.bride})`;

  /** Validates; on failure surfaces the error and focuses the first bad field. */
  const validate = () => {
    setTouched(true);
    if (!nameValid) {
      nameRef.current?.focus();
      return false;
    }
    return eventsValid;
  };

  const handleWhatsApp = () => {
    if (!validate()) return;
    soundEngine.playPradipLit();
    const lines = [
      `Namaste! RSVP for ${WEDDING_DATA.couple.groom} & ${WEDDING_DATA.couple.bride}'s Wedding`,
      `Name: ${name.trim()}`,
      `Side: ${teamLabel}`,
      `Guests: ${guests}`,
      `Attending: ${eventNames}`,
    ];
    if (note.trim()) lines.push(`Note: ${note.trim()}`);
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WEDDING_DATA.couple.whatsappNumber}?text=${text}`, '_blank', 'noopener');
  };

  const openPass = () => {
    if (!validate()) return;
    soundEngine.playPradipLit();
    setShowPass(true);
  };

  const passPayload = () => ({ name: name.trim(), teamLabel, guests, events: chosenEvents });

  const savePass = async () => {
    setBusy('save');
    try {
      const blob = await renderPassBlob(passPayload());
      downloadBlob(blob, passFileName(name));
      soundEngine.playHoludSplash();
      toast('Your Royal Guest Pass is saved ✦');
    } catch {
      toast('Could not create the image — please try again');
    } finally {
      setBusy(null);
    }
  };

  const sharePass = async () => {
    setBusy('share');
    try {
      const blob = await renderPassBlob(passPayload());
      const file = new File([blob], passFileName(name), { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${WEDDING_DATA.couple.groom} & ${WEDDING_DATA.couple.bride}`,
          text: `See you in ${WEDDING_DATA.couple.city}! ${WEDDING_DATA.couple.hashtag}`,
        });
      } else {
        downloadBlob(blob, passFileName(name));
        toast('Saved! Share it from your photos ✦');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') toast('Sharing is unavailable — try “Save Pass”');
    } finally {
      setBusy(null);
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <section id="rsvp" className="scroll-mt-20 bg-cream/65 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.7, ease: LUXURY_EASE }}
          className="text-center"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted">RSVP</p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">Will You Join Us?</h2>
          <p className="mt-2 font-serif text-lg italic text-ink/75">
            Choose your side, pick your celebrations &amp; unlock your digital keepsake pass.
          </p>
        </motion.div>

        <motion.form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleWhatsApp();
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.7, delay: 0.1, ease: LUXURY_EASE }}
          className="rajbari-frame mt-10 bg-ivory p-6 shadow-md sm:p-10"
        >
          <fieldset>
            <legend className="sr-only">Which side are you celebrating with?</legend>
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
                    aria-pressed={active}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      soundEngine.playSoftTick();
                      setTeam(item.id);
                    }}
                    className={`flex flex-col items-center rounded-sm border p-4 transition-[background-color,border-color,color,box-shadow] ${
                      active
                        ? 'border-kansa bg-sindoor text-ivory shadow-md'
                        : 'border-kansa/45 bg-cream/60 text-sindoor hover:border-sindoor'
                    }`}
                  >
                    <Heart
                      aria-hidden="true"
                      className={`h-5 w-5 ${active ? 'fill-kansa-light text-kansa-light' : 'text-sindoor'}`}
                    />
                    <span className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] opacity-90">
                      {item.label}
                    </span>
                    <span className="mt-0.5 font-serif text-2xl font-semibold">{item.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6" aria-describedby={showEventsError ? `${errId}-ev` : undefined}>
            <legend className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
              Celebrations Attending
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {WEDDING_DATA.events.map((ev) => {
                const checked = selectedEvents.includes(ev.id);
                return (
                  <button
                    key={ev.id}
                    type="button"
                    aria-pressed={checked}
                    onClick={() => toggleEvent(ev.id)}
                    className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 font-sans text-xs font-medium transition-colors ${
                      checked
                        ? 'border-sindoor bg-sindoor text-ivory'
                        : 'border-kansa/45 bg-ivory text-ink/75 hover:border-sindoor'
                    }`}
                  >
                    {checked && <Check aria-hidden="true" className="h-3 w-3 text-kansa-light" />}
                    {ev.title}
                  </button>
                );
              })}
            </div>
            {showEventsError && (
              <p id={`${errId}-ev`} role="alert" className="mt-2 font-sans text-xs font-medium text-sindoor">
                Pick at least one celebration to attend.
              </p>
            )}
          </fieldset>

          <div className="mt-6 flex items-center justify-between rounded-sm border border-kansa/35 bg-cream/55 px-4 py-2">
            <span id={`${uid}-guests`} className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sindoor">
              Number of Guests
            </span>
            <div className="flex items-center gap-2" role="group" aria-labelledby={`${uid}-guests`}>
              <button
                type="button"
                aria-label="Decrease number of guests"
                disabled={guests <= 1}
                onClick={() => {
                  soundEngine.playSoftTick();
                  setGuests((g) => Math.max(1, g - 1));
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-kansa/60 bg-ivory text-lg font-semibold text-sindoor transition-colors hover:bg-sindoor hover:text-ivory disabled:opacity-40 disabled:hover:bg-ivory disabled:hover:text-sindoor"
              >
                −
              </button>
              <span aria-live="polite" className="w-7 text-center font-serif text-xl font-semibold tabular-nums text-sindoor">
                {guests}
              </span>
              <button
                type="button"
                aria-label="Increase number of guests"
                disabled={guests >= MAX_GUESTS}
                onClick={() => {
                  soundEngine.playSoftTick();
                  setGuests((g) => Math.min(MAX_GUESTS, g + 1));
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-kansa/60 bg-ivory text-lg font-semibold text-sindoor transition-colors hover:bg-sindoor hover:text-ivory disabled:opacity-40 disabled:hover:bg-ivory disabled:hover:text-sindoor"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor={nameId}
                className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted"
              >
                Your Name(s) <span aria-hidden="true">*</span>
              </label>
              <input
                ref={nameRef}
                id={nameId}
                type="text"
                autoComplete="name"
                enterKeyHint="send"
                required
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={showNameError}
                aria-describedby={showNameError ? errId : undefined}
                placeholder="e.g., Aarav & family"
                className={`mt-1.5 w-full rounded-sm border bg-ivory px-3.5 py-3 font-sans text-base text-ink placeholder:text-ink/60 focus:outline-none focus:ring-2 focus:ring-kansa/40 sm:text-sm ${
                  showNameError ? 'border-sindoor' : 'border-kansa/45 focus:border-sindoor'
                }`}
              />
              <AnimatePresence>
                {showNameError && (
                  <motion.p
                    id={errId}
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1.5 font-sans text-xs font-medium text-sindoor"
                  >
                    Please add your name so the couple knows who’s coming.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label
                htmlFor={noteId}
                className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted"
              >
                A Note for the Couple (Optional)
              </label>
              <textarea
                id={noteId}
                rows={3}
                maxLength={400}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your blessings or arrival details..."
                className="mt-1.5 w-full rounded-sm border border-kansa/45 bg-ivory px-3.5 py-2.5 font-sans text-base text-ink placeholder:text-ink/60 focus:border-sindoor focus:outline-none focus:ring-2 focus:ring-kansa/40 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-sindoor px-6 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ivory shadow-md transition-colors hover:bg-sindoor-deep"
            >
              <Send aria-hidden="true" className="h-4 w-4 text-kansa-light" />
              Send RSVP on WhatsApp
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openPass}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-kansa bg-cream px-5 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sindoor transition-colors hover:bg-kansa/20"
            >
              <Ticket aria-hidden="true" className="h-4 w-4" />
              Invite Pass
            </motion.button>
          </div>
        </motion.form>
      </div>

      <AnimatePresence>
        {showPass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPass(false)}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-indigoNight/85 p-4 backdrop-blur-md"
          >
            <motion.div
              ref={passRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-pass-title`}
              tabIndex={-1}
              initial={{ scale: 0.9, y: 18, rotateX: 8 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 18, opacity: 0 }}
              transition={{ duration: 0.45, ease: LUXURY_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="alpona-frame relative my-auto w-full max-w-md overflow-hidden bg-sindoor p-7 text-center text-ivory shadow-2xl focus:outline-none sm:p-8"
            >
              <motion.span
                aria-hidden="true"
                initial={{ x: '-120%' }}
                animate={{ x: '220%' }}
                transition={{ duration: 2.2, delay: 0.25, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-kansa-light/20 to-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPass(false)}
                aria-label="Close pass"
                className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full text-kansa-light transition-colors hover:bg-sindoor-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kansa-light"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>

              <p className="px-8 font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-kansa-light">
                Royal Guest Pass · {WEDDING_DATA.couple.hashtag}
              </p>
              <h3 id={`${uid}-pass-title`} className="mt-2 px-3 py-1 font-script text-5xl leading-[1.2] text-ivory">
                {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
              </h3>
              <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.22em] text-kansa-light">
                {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city}
              </p>

              <div className="my-6 border-y border-dashed border-kansa-light/50 py-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-kansa-light">Honoured Guest(s)</p>
                <p className="mt-1 break-words font-serif text-3xl font-semibold text-ivory">{name}</p>
                <p className="mt-2 font-sans text-xs uppercase tracking-[0.18em] text-kansa-light">
                  {teamLabel} · {guests} {guests === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>

              <ul className="space-y-1.5 text-left">
                {chosenEvents.map((ev) => (
                  <li key={ev.id} className="flex items-baseline justify-between gap-3 border-b border-kansa-light/15 pb-1.5">
                    <span className="font-serif text-lg font-semibold text-ivory">
                      <span className="mr-2 font-sans text-[10px] tracking-[0.2em] text-kansa-light">{ev.number}</span>
                      {ev.title}
                    </span>
                    <span className="shrink-0 font-serif text-sm italic text-ivory/90">
                      {ev.date.replace(/^\w+, /, '').replace(' 2027', '')}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={`mt-6 grid gap-2.5 ${canNativeShare ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <button
                  type="button"
                  data-autofocus
                  onClick={savePass}
                  disabled={!!busy}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ivory px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sindoor shadow-md transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kansa-light focus-visible:ring-offset-2 focus-visible:ring-offset-sindoor disabled:opacity-70"
                >
                  {busy === 'save' ? (
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download aria-hidden="true" className="h-4 w-4" />
                  )}
                  Save Pass as Image
                </button>
                {canNativeShare && (
                  <button
                    type="button"
                    onClick={sharePass}
                    disabled={!!busy}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-kansa-light px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-kansa-light transition-colors hover:bg-sindoor-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kansa-light disabled:opacity-70"
                  >
                    {busy === 'share' ? (
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    ) : (
                      <Share2 aria-hidden="true" className="h-4 w-4" />
                    )}
                    Share to Story
                  </button>
                )}
              </div>
              <p className="mt-3 font-serif text-sm italic text-ivory/85">
                A 1080×1920 keepsake, sized for Instagram &amp; WhatsApp Stories.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
