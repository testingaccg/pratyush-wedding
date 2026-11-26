import { useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CalendarPlus, CalendarHeart, Ticket, Download, Share2, Loader2, X } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import { ShankhaIcon } from './BengaliMotifs';
import BiyeRitualsInteractive from './BiyeRitualsInteractive';
import { soundEngine } from '../utils/soundEngine';
import { googleCalendarUrl, downloadWeddingIcs } from '../utils/calendar';
import { renderPassBlob, passFileName } from '../utils/passCanvas';
import { useModal } from '../utils/useModal';
import { GUEST } from '../utils/guest';
import { toast, copyText } from '../utils/toast';
import { useLang } from '../context/LangContext';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

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

export default function SacredThreadEvents() {
  const { lang } = useLang();
  const uid = useId();
  const ev = WEDDING_DATA.events[0];
  const [pulsing, setPulsing] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [guestName, setGuestName] = useState(GUEST.name || '');
  const [busy, setBusy] = useState(null); // 'save' | 'share' | null
  const pulseTimerRef = useRef(null);
  const passRef = useModal(showPass, () => setShowPass(false));

  const playShankha = () => {
    setPulsing(true);
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = setTimeout(() => setPulsing(false), 1900);
    soundEngine.playShankha();
  };

  const savePass = async () => {
    setBusy('save');
    try {
      const displayName = guestName.trim() || 'Our Honoured Guest';
      const blob = await renderPassBlob({ name: displayName });
      downloadBlob(blob, passFileName(displayName));
      soundEngine.playHoludSplash();
      toast('Your Keepsake Invite Pass is saved ✦');
    } catch {
      toast('Could not create the image — please try again');
    } finally {
      setBusy(null);
    }
  };

  const sharePass = async () => {
    setBusy('share');
    try {
      const displayName = guestName.trim() || 'Our Honoured Guest';
      const blob = await renderPassBlob({ name: displayName });
      const file = new File([blob], passFileName(displayName), { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${WEDDING_DATA.couple.groom} & ${WEDDING_DATA.couple.bride}`,
          text: `Shubho Biye in ${WEDDING_DATA.couple.city} · ${WEDDING_DATA.couple.hashtag}`,
        });
      } else {
        downloadBlob(blob, passFileName(displayName));
        toast('Saved! Share it from your photos ✦');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') toast('Sharing unavailable — try “Save PNG”');
    } finally {
      setBusy(null);
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <section id="celebrations" className="relative mx-auto max-w-4xl scroll-mt-20 px-4 py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.7, ease: LUXURY_EASE }}
        className="text-center"
      >
        <p className={lang === 'bn' ? 'font-bengali text-sm font-semibold text-sindoor' : 'font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted'}>
          {lang === 'bn' ? 'শুভ বিবাহের অনুষ্ঠান' : 'The Wedding Ceremony'}
        </p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">
          {lang === 'bn' ? <span lang="bn" className="font-bengali">শুভ বিবাহ · Shubho Biye</span> : 'Shubho Biye'}
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic text-ink/75">
          One sacred evening of conch shells, seven vows, and joyful celebration in Kolkata.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundEngine.playPradipLit();
              downloadWeddingIcs();
              toast('Wedding added — open the file to save to your calendar');
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory shadow-md transition-colors hover:bg-sindoor-deep"
          >
            <CalendarHeart aria-hidden="true" className="h-4 w-4 text-kansa-light" />
            Save The Date (.ics)
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundEngine.playPradipLit();
              setShowPass(true);
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-kansa bg-cream px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-sindoor transition-colors hover:bg-kansa/20"
          >
            <Ticket aria-hidden="true" className="h-4 w-4" />
            Keepsake Invite Pass
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={async () => {
              soundEngine.playSoftTick();
              const shareUrl = window.location.href;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: `${WEDDING_DATA.couple.groom} & ${WEDDING_DATA.couple.bride} — Shubho Biye`,
                    text: `Join us in ${WEDDING_DATA.couple.city} on ${WEDDING_DATA.couple.dateRange}!`,
                    url: shareUrl,
                  });
                  return;
                } catch {
                  /* fallback to copy */
                }
              }
              if (await copyText(shareUrl)) toast('Invitation link copied to share ✦');
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-kansa/60 bg-ivory px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sindoor transition-colors hover:bg-cream"
          >
            <Share2 aria-hidden="true" className="h-3.5 w-3.5" />
            Share
          </motion.button>
        </div>
      </motion.div>

      {/* Single Ceremony Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.65, ease: LUXURY_EASE }}
        className="rajbari-frame mt-12 bg-ivory p-6 shadow-md sm:p-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-kansa/25 pb-5">
          <div>
            <span lang="bn" className="font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-kansa-muted">
              {ev.number} · {ev.eyebrow}
            </span>
            <h3 className="mt-1 font-serif text-3xl font-semibold text-sindoor sm:text-4xl">
              {ev.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={playShankha}
            aria-label="Sound the Shankha conch shell"
            className="relative inline-flex min-h-[40px] items-center gap-2 rounded-full border border-kansa/55 bg-cream px-4 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-sindoor transition-colors hover:bg-kansa/20"
          >
            {pulsing && (
              <>
                <span aria-hidden="true" className="shankha-ring pointer-events-none absolute inset-0 rounded-full border border-kansa" />
                <span
                  aria-hidden="true"
                  className="shankha-ring pointer-events-none absolute inset-0 rounded-full border border-sindoor/55"
                  style={{ animationDelay: '0.35s' }}
                />
              </>
            )}
            <ShankhaIcon className="h-4 w-4 text-sindoor" />
            Shankha Sound
          </button>
        </div>

        <div className="grid gap-6 pt-6 sm:grid-cols-2">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sindoor">
              {ev.date}
            </p>
            <p className="mt-1 font-sans text-sm text-ink/80">{ev.time}</p>
            <p className="mt-3 font-serif text-xl font-semibold text-ink">
              {ev.venue} · {ev.city}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span
                className="h-3.5 w-3.5 rounded-full border border-kansa/60"
                style={{ backgroundColor: ev.dressColor }}
              />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-kansa-muted">
                Attire · {ev.dressCode}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <p className="font-serif text-lg italic leading-relaxed text-ink/85">
              {ev.description}
            </p>
          </div>
        </div>

        {/* Interactive Saptapadi & Bor-Kone Caricature */}
        <BiyeRitualsInteractive />

        <div className="mt-6 flex flex-wrap gap-3 border-t border-kansa/20 pt-5">
          <a
            href={ev.mapsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundEngine.playSoftTick()}
            aria-label={`Get directions to ${ev.venue} for ${ev.title}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-[transform,background-color,box-shadow] active:scale-[0.97] hover:-translate-y-0.5 hover:bg-sindoor-deep"
          >
            <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-kansa-light" />
            Get Directions
          </a>

          <a
            href={googleCalendarUrl(ev)}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundEngine.playSoftTick()}
            aria-label={`Add ${ev.title} to Google Calendar`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-kansa bg-cream px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sindoor transition-[transform,background-color,box-shadow] active:scale-[0.97] hover:-translate-y-0.5 hover:bg-kansa/20"
          >
            <CalendarPlus aria-hidden="true" className="h-3.5 w-3.5" />
            Add to Google Calendar
          </a>
        </div>
      </motion.div>

      {/* Keepsake Invite Pass Modal */}
      <AnimatePresence>
        {showPass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPass(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-indigoNight/85 p-4 backdrop-blur-md"
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
                className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-kansa-light hover:bg-sindoor-deep"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-kansa-light">
                Royal Keepsake Pass · {WEDDING_DATA.couple.hashtag}
              </p>
              <h3 id={`${uid}-pass-title`} className="mt-2 font-script text-5xl text-ivory">
                {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
              </h3>
              <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.22em] text-kansa-light/90">
                {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city}
              </p>

              <div className="my-5 border-y border-dashed border-kansa-light/50 py-4">
                <label htmlFor={`${uid}-gname`} className="block font-sans text-[10px] uppercase tracking-[0.22em] text-kansa-light">
                  Personalise Card Name
                </label>
                <input
                  id={`${uid}-gname`}
                  type="text"
                  maxLength={60}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Our Honoured Guest"
                  className="mt-2 w-full rounded-sm border border-kansa-light/40 bg-sindoor-deep/70 px-3 py-2 text-center font-serif text-xl font-semibold text-ivory placeholder:text-ivory/45 focus:border-kansa-light focus:outline-none"
                />
                <p className="mt-2 font-serif text-sm italic text-ivory/85">
                  {ev.title} · {ev.date} · {ev.venue}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={savePass}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ivory px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sindoor shadow-md transition-colors hover:bg-cream disabled:opacity-60"
                >
                  {busy === 'save' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Save PNG (Story)
                </button>

                {canNativeShare && (
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={sharePass}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-kansa-light/70 bg-sindoor-deep px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-sindoor disabled:opacity-60"
                  >
                    {busy === 'share' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                    Share
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
