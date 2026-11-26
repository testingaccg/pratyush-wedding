/**
 * Personalised invite links.
 *   ?guest=Mehra+Family          → personalised greeting & keepsake pass name
 * Short alias: ?g= . All values are sanitised & length-capped;
 * React escapes them on render, so nothing is ever injected as HTML.
 */
const clean = (v, max) =>
  (v || '')
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

function read() {
  if (typeof window === 'undefined') return { name: '' };
  const q = new URLSearchParams(window.location.search);
  const name = clean(q.get('guest') || q.get('g'), 60);
  return { name };
}

export const GUEST = read();

/** Build a personalised link for the couple to send out. */
export function buildGuestLink({ name }, base = window.location.origin + window.location.pathname) {
  const q = new URLSearchParams();
  if (name?.trim()) q.set('guest', name.trim());
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

/** `?host` shows the couple's link-maker panel. */
export const IS_HOST =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('host');
