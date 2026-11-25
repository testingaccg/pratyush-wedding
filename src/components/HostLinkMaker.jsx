import { useId, useMemo, useState } from 'react';
import { Link2, Copy, Send, ListPlus } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import { buildGuestLink } from '../utils/guest';
import { copyText, toast } from '../utils/toast';

/**
 * Couple-only tool (visible at ?host): create personalised invite links
 * one at a time, or in bulk from a pasted guest list.
 */
const inviteMessage = (name, link) =>
  `Dearest ${name},\n\nWith joy in our hearts, we invite you to celebrate our wedding — ${WEDDING_DATA.couple.dateRange}, ${WEDDING_DATA.couple.city}.\n\nOpen your invitation: ${link}\n\n— ${WEDDING_DATA.couple.groom} & ${WEDDING_DATA.couple.bride}`;

export default function HostLinkMaker() {
  const uid = useId();
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [count, setCount] = useState('');
  const [bulk, setBulk] = useState('');

  const link = buildGuestLink({ name, team: team || null, count: count ? Number(count) : null });

  // Bulk lines: "Name" or "Name, bride, 4"
  const bulkLinks = useMemo(
    () =>
      bulk
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 500)
        .map((line) => {
          const [n, t, c] = line.split(',').map((x) => x.trim());
          const tm = /^(bride|groom)$/i.test(t || '') ? t.toLowerCase() : null;
          const ct = parseInt(c, 10);
          return { name: n, link: buildGuestLink({ name: n, team: tm, count: ct > 0 ? Math.min(ct, 10) : null }) };
        }),
    [bulk]
  );

  const copy = async (text, msg) => {
    if (await copyText(text)) toast(msg);
  };

  const input =
    'mt-1 w-full rounded-sm border border-kansa/45 bg-ivory px-3 py-2.5 font-sans text-base text-ink focus:border-sindoor focus:outline-none sm:text-sm';
  const label = 'block font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-kansa-muted';

  return (
    <section id="host" className="scroll-mt-20 px-4 py-16" aria-labelledby={`${uid}-h`}>
      <div className="rajbari-frame mx-auto max-w-2xl bg-ivory p-6 sm:p-9">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-kansa-muted">
          For Pratyush &amp; Sayanee only · hidden from guests
        </p>
        <h2 id={`${uid}-h`} className="mt-1 font-serif text-3xl font-semibold text-sindoor">
          Personal Invite Links
        </h2>
        <p className="mt-1 font-serif text-base italic text-ink/75">
          Each link opens the doors to “Dearest &lt;name&gt;” and pre-fills their RSVP.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor={`${uid}-n`} className={label}>Guest name(s)</label>
            <input id={`${uid}-n`} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="Mehra Family" className={input} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-t`} className={label}>Side</label>
            <select id={`${uid}-t`} value={team} onChange={(e) => setTeam(e.target.value)} className={input}>
              <option value="">Not set</option>
              <option value="groom">Team Groom</option>
              <option value="bride">Team Bride</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <label htmlFor={`${uid}-c`} className={label}>Guests</label>
            <input id={`${uid}-c`} type="number" min="1" max="10" value={count} onChange={(e) => setCount(e.target.value)} className={input} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-sm border border-dashed border-kansa/60 bg-cream/60 px-3 py-2.5">
          <Link2 aria-hidden="true" className="h-4 w-4 shrink-0 text-kansa" />
          <code className="min-w-0 flex-1 truncate font-sans text-xs text-ink/80">{link}</code>
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => copy(link, 'Invite link copied ✦')}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory hover:bg-sindoor-deep"
          >
            <Copy aria-hidden="true" className="h-3.5 w-3.5" /> Copy Link
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(inviteMessage(name.trim() || 'Friend', link))}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-kansa bg-cream px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sindoor hover:bg-kansa/20"
          >
            <Send aria-hidden="true" className="h-3.5 w-3.5" /> Send on WhatsApp
          </a>
        </div>

        <div className="mt-8 border-t border-kansa/25 pt-6">
          <label htmlFor={`${uid}-b`} className={label}>
            Bulk — one guest per line · optional “, bride|groom, count”
          </label>
          <textarea
            id={`${uid}-b`}
            rows={4}
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            placeholder={'Mehra Family, groom, 4\nAnanya & Rohit, bride, 2\nDadu'}
            className={input}
          />
          {bulkLinks.length > 0 && (
            <>
              <button
                type="button"
                onClick={() =>
                  copy(bulkLinks.map((b) => `${b.name}\t${b.link}`).join('\n'), `${bulkLinks.length} links copied — paste into a spreadsheet`)
                }
                className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory hover:bg-sindoor-deep"
              >
                <ListPlus aria-hidden="true" className="h-3.5 w-3.5" /> Copy all {bulkLinks.length} links
              </button>
              <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto pr-1">
                {bulkLinks.map((b, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 border-b border-kansa/15 py-1.5">
                    <span className="truncate font-serif text-base font-semibold text-sindoor">{b.name}</span>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(inviteMessage(b.name, b.link))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[40px] shrink-0 items-center gap-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-kansa-muted hover:text-sindoor"
                    >
                      <Send aria-hidden="true" className="h-3 w-3" /> WhatsApp
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
