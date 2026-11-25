/**
 * Personalised invite links.
 *   ?guest=Mehra+Family          → greeting + RSVP name prefill
 *   &team=bride|groom            → RSVP side prefill
 *   &n=4                         → RSVP guest count prefill (1–10)
 * Short aliases: ?g= &t= .  All values are sanitised & length-capped;
 * React escapes them on render, so nothing is ever injected as HTML.
 */
const clean = (v, max) =>
  (v || '')
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

function read() {
  if (typeof window === 'undefined') return { name: '', team: null, count: null };
  const q = new URLSearchParams(window.location.search);
  const name = clean(q.get('guest') || q.get('g'), 60);
  const teamRaw = (q.get('team') || q.get('t') || '').toLowerCase();
  const team = teamRaw === 'bride' || teamRaw === 'groom' ? teamRaw : null;
  const n = parseInt(q.get('n'), 10);
  const count = Number.isFinite(n) ? Math.min(10, Math.max(1, n)) : null;
  return { name, team, count };
}

export const GUEST = read();

/** Build a personalised link for the couple to send out. */
export function buildGuestLink({ name, team, count }, base = window.location.origin + window.location.pathname) {
  const q = new URLSearchParams();
  if (name?.trim()) q.set('guest', name.trim());
  if (team) q.set('team', team);
  if (count) q.set('n', String(count));
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

/** `?host` shows the couple's link-maker panel. */
export const IS_HOST =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('host');
