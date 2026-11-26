import { WEDDING_DATA } from '../data/weddingData';

/** 2027-02-16T19:00:00+05:30 → 20270216T133000Z */
const toUtcStamp = (iso) =>
  new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const escapeIcs = (text = '') =>
  String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/**
 * RFC 5545: fold lines at 75 octets (UTF-8 bytes, not characters). We also
 * avoid splitting inside a backslash escape so naive parsers stay happy.
 */
const enc = new TextEncoder();
const fold = (line) => {
  const chars = [...line];
  const out = [];
  let current = '';
  let bytes = 0;
  chars.forEach((ch, i) => {
    const size = enc.encode(ch).length;
    const limit = out.length ? 74 : 75; // continuation lines start with a space
    if (bytes + size > limit && !(chars[i - 1] === '\\' && current.length > 1)) {
      out.push(current);
      current = '';
      bytes = 0;
    } else if (bytes + size > limit) {
      // previous char is a backslash: move it to the next line with its pair
      out.push(current.slice(0, -1));
      current = '\\';
      bytes = 1;
    }
    current += ch;
    bytes += size;
  });
  out.push(current);
  return out.join('\r\n ');
};

const { groom, bride } = WEDDING_DATA.couple;

export function eventSummary(ev) {
  return `${ev.title} · ${groom} & ${bride}`;
}

export function googleCalendarUrl(ev) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventSummary(ev),
    dates: `${toUtcStamp(ev.startISO)}/${toUtcStamp(ev.endISO)}`,
    details: `${ev.description}\n\nAttire: ${ev.dressCode}\n${WEDDING_DATA.couple.hashtag}`,
    location: `${ev.venue}, ${ev.city}, West Bengal`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildWeddingIcs(events = WEDDING_DATA.events) {
  const now = toUtcStamp(new Date().toISOString());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PratyushWedsSayanee//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcs(`${groom} & ${bride} · Shubho Biye`)}`,
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];
  events.forEach((ev) => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}-2027@pratyush-weds-sayanee`,
      `DTSTAMP:${now}`,
      `DTSTART:${toUtcStamp(ev.startISO)}`,
      `DTEND:${toUtcStamp(ev.endISO)}`,
      `SUMMARY:${escapeIcs(eventSummary(ev))}`,
      `DESCRIPTION:${escapeIcs(`${ev.description}\n\nAttire: ${ev.dressCode}\n${WEDDING_DATA.couple.hashtag}`)}`,
      `LOCATION:${escapeIcs(`${ev.venue}, ${ev.city}, West Bengal`)}`,
      `URL:${ev.mapsUrl}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT3H',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcs(`${ev.title} begins soon`)}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n');
}

export function downloadWeddingIcs() {
  const blob = new Blob([buildWeddingIcs()], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pratyush-Sayanee-Shubho-Biye.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
