import { WEDDING_DATA } from '../data/weddingData';

/**
 * Live wedding-week awareness.
 * Preview any moment with ?now=2027-02-15T11:00 (interpreted in IST when no
 * offset is given), e.g. to see "Happening now · Haldi".
 */
const EVENTS = WEDDING_DATA.events.map((e) => ({
  ...e,
  start: new Date(e.startISO).getTime(),
  end: new Date(e.endISO).getTime(),
}));

// Wedding week begins at midnight IST on the first event's day.
const WEEK_START = new Date(`${WEDDING_DATA.events[0].startISO.slice(0, 10)}T00:00:00+05:30`).getTime();
const CEREMONY = new Date(WEDDING_DATA.couple.ceremonyISO).getTime();

function readOffset() {
  if (typeof window === 'undefined') return 0;
  const raw = new URLSearchParams(window.location.search).get('now');
  if (!raw) return 0;
  let iso = raw.trim();
  if (!/([zZ]|[+-]\d\d:?\d\d)$/.test(iso)) {
    if (iso.length === 10) iso += 'T00:00:00'; // YYYY-MM-DD
    else if (iso.length === 16) iso += ':00'; // YYYY-MM-DDTHH:MM
    iso += '+05:30';
  }
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t - Date.now() : 0;
}

const OFFSET = readOffset();
export const now = () => Date.now() + OFFSET;

/** True on the main wedding day (IST calendar date of the ceremony). */
export function isWeddingDay(t = now()) {
  const ist = new Date(t + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
  return ist === WEDDING_DATA.couple.ceremonyISO.slice(0, 10);
}

/**
 * phase: 'before' (pre-week) | 'week' | 'after'
 * live:  the event happening right now (or null)
 * next:  the next event yet to start (or null)
 * target/targetLabel: what the countdown should count to
 */
export function getSchedule(t = now()) {
  const last = EVENTS[EVENTS.length - 1];
  if (t >= last.end) return { phase: 'after', live: null, next: null, target: null, targetLabel: '' };

  const live = EVENTS.find((e) => t >= e.start && t < e.end) || null;
  const next = EVENTS.find((e) => e.start > t) || null;

  if (t < WEEK_START) {
    return { phase: 'before', live: null, next, target: CEREMONY, targetLabel: 'until the sacred vows' };
  }
  return {
    phase: 'week',
    live,
    next,
    target: next ? next.start : null,
    targetLabel: next ? `until ${next.title}` : '',
  };
}
