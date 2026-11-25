import { WEDDING_DATA } from '../data/weddingData';

/**
 * Renders the personalised Royal Guest Pass to a 1080×1920 canvas
 * (Instagram Story size) and returns a PNG Blob.
 */
const W = 1080;
const H = 1920;
const C = {
  sindoor: '#A61C24',
  deep: '#781117',
  ivory: '#FAF7F2',
  gold: '#C59B38',
  goldLight: '#E6CA7E',
};

const SCRIPT = '"Great Vibes", cursive';
const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = 'Manrope, system-ui, sans-serif';

async function ensureFonts() {
  if (!document.fonts?.load) return;
  await Promise.all([
    document.fonts.load(`150px ${SCRIPT}`),
    document.fonts.load(`600 72px ${SERIF}`),
    document.fonts.load(`italic 400 44px ${SERIF}`),
    document.fonts.load(`600 30px ${SANS}`),
  ]).catch(() => {});
}

/** Centered text with manual letter-spacing (canvas letterSpacing isn't universal). */
function spaced(ctx, text, x, y, spacing) {
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let cx = x - total / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  chars.forEach((ch, i) => {
    ctx.fillText(ch, cx, y);
    cx += widths[i] + spacing;
  });
  ctx.textAlign = prev;
}

/** Wrap text into lines that fit maxWidth, shrinking font down to minSize first. */
function fitLines(ctx, text, maxWidth, font, size, minSize, maxLines = 2) {
  let s = size;
  while (s >= minSize) {
    ctx.font = font(s);
    const words = text.split(/\s+/);
    const lines = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxWidth)) {
      return { lines, size: s };
    }
    s -= 4;
  }
  ctx.font = font(minSize);
  // Hard truncate as last resort
  const t = text.length > 40 ? `${text.slice(0, 38)}…` : text;
  return { lines: [t], size: minSize };
}

function drawMandala(ctx, cx, cy, r, alpha) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = `rgba(230, 202, 126, ${alpha})`;
  ctx.lineWidth = 2;
  [1, 0.78, 0.54].forEach((k, i) => {
    ctx.beginPath();
    ctx.setLineDash(i === 1 ? [] : [8, 10]);
    ctx.arc(0, 0, r * k, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.setLineDash([]);
  for (let i = 0; i < 16; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 8);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.9);
    ctx.quadraticCurveTo(r * 0.12, -r * 0.62, 0, -r * 0.34);
    ctx.quadraticCurveTo(-r * 0.12, -r * 0.62, 0, -r * 0.9);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function drawCrest(ctx, cx, cy) {
  ctx.save();
  ctx.strokeStyle = C.goldLight;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 78, 90, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([5, 6]);
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = 'rgba(250,247,242,0.7)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 64, 76, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  // laurel sprigs
  ctx.strokeStyle = C.goldLight;
  ctx.lineWidth = 2;
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.moveTo(cx + dir * 96, cy);
    ctx.bezierCurveTo(cx + dir * 150, cy - 26, cx + dir * 190, cy - 6, cx + dir * 230, cy);
    ctx.bezierCurveTo(cx + dir * 190, cy + 8, cx + dir * 150, cy + 22, cx + dir * 96, cy);
    ctx.stroke();
    [120, 158, 196].forEach((d, i) => {
      ctx.beginPath();
      ctx.moveTo(cx + dir * d, cy - 4);
      ctx.quadraticCurveTo(cx + dir * (d - 10), cy - 34 + i * 3, cx + dir * (d + 8), cy - 40 + i * 2);
      ctx.stroke();
    });
  });
  ctx.fillStyle = C.goldLight;
  [-102, 102].forEach((dy) => {
    ctx.beginPath();
    ctx.arc(cx, cy + dy, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = C.ivory;
  ctx.font = `600 44px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  spaced(ctx, WEDDING_DATA.couple.monogram, cx, cy + 2, 4);
  ctx.restore();
}

function dashedRule(ctx, y, x1 = 150, x2 = W - 150) {
  ctx.save();
  ctx.strokeStyle = 'rgba(230, 202, 126, 0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
  // diamond centre ornament
  ctx.save();
  ctx.fillStyle = C.goldLight;
  ctx.translate(W / 2, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-8, -8, 16, 16);
  ctx.restore();
}

export async function renderPassBlob({ name, teamLabel, guests, events }) {
  await ensureFonts();
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Lacquered sindoor background with warm glow
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, C.sindoor);
  bg.addColorStop(1, C.deep);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 560, 40, W / 2, 560, 760);
  glow.addColorStop(0, 'rgba(230, 202, 126, 0.24)');
  glow.addColorStop(1, 'rgba(230, 202, 126, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  drawMandala(ctx, W / 2, 560, 470, 0.12);
  drawMandala(ctx, W / 2, H + 120, 520, 0.08);

  // Handmade paper grain
  for (let i = 0; i < 9000; i++) {
    const a = Math.random() * 0.06;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,240,220,${a})` : `rgba(40,0,0,${a})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.6, 1.6);
  }

  // Double gold hairline frame + corner ornaments
  ctx.strokeStyle = C.goldLight;
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.strokeStyle = 'rgba(230, 202, 126, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(66, 66, W - 132, H - 132);
  ctx.fillStyle = C.goldLight;
  [[66, 66], [W - 66, 66], [66, H - 66], [W - 66, H - 66]].forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-9, -9, 18, 18);
    ctx.restore();
  });

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  drawCrest(ctx, W / 2, 215);

  ctx.fillStyle = C.goldLight;
  ctx.font = `600 28px ${SANS}`;
  spaced(ctx, 'ROYAL GUEST PASS', W / 2, 372, 9);

  ctx.fillStyle = C.ivory;
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 12;
  ctx.font = `150px ${SCRIPT}`;
  ctx.fillText(WEDDING_DATA.couple.groom, W / 2, 530);
  ctx.font = `110px ${SCRIPT}`;
  ctx.fillStyle = C.goldLight;
  ctx.fillText('&', W / 2, 622);
  ctx.font = `150px ${SCRIPT}`;
  ctx.fillStyle = C.ivory;
  ctx.fillText(WEDDING_DATA.couple.bride, W / 2, 745);
  ctx.shadowBlur = 0;

  ctx.fillStyle = C.goldLight;
  ctx.font = `600 30px ${SANS}`;
  spaced(ctx, `${WEDDING_DATA.couple.dateRange} · ${WEDDING_DATA.couple.city}`.toUpperCase(), W / 2, 822, 6);

  dashedRule(ctx, 880);

  ctx.font = `600 26px ${SANS}`;
  spaced(ctx, 'HONOURED GUEST(S)', W / 2, 950, 8);

  const fitted = fitLines(ctx, name, W - 300, (s) => `600 ${s}px ${SERIF}`, 80, 52, 2);
  ctx.fillStyle = C.ivory;
  ctx.font = `600 ${fitted.size}px ${SERIF}`;
  let y = 1035;
  fitted.lines.forEach((line) => {
    ctx.fillText(line, W / 2, y);
    y += fitted.size * 1.08;
  });

  ctx.fillStyle = C.goldLight;
  ctx.font = `600 28px ${SANS}`;
  spaced(ctx, `${teamLabel} · ${guests} ${guests === 1 ? 'GUEST' : 'GUESTS'}`.toUpperCase(), W / 2, y + 26, 5);

  dashedRule(ctx, y + 82);

  // Selected celebrations
  const list = events.length ? events : WEDDING_DATA.events;
  const startY = y + 165;
  const footerTop = H - 230;
  const rowH = Math.min(96, (footerTop - startY) / Math.max(1, list.length - 1 + 0.6));
  const titleSize = Math.round(Math.min(46, rowH * 0.62));
  list.forEach((ev, i) => {
    const ry = startY + i * rowH;
    ctx.textAlign = 'left';
    ctx.fillStyle = C.goldLight;
    ctx.font = `600 26px ${SANS}`;
    ctx.fillText(ev.number, 190, ry);
    ctx.fillStyle = C.ivory;
    ctx.font = `600 ${titleSize}px ${SERIF}`;
    ctx.fillText(ev.title, 250, ry + 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(250,247,242,0.85)';
    ctx.font = `italic 400 ${Math.round(titleSize * 0.74)}px ${SERIF}`;
    ctx.fillText(ev.date.replace(/^\w+, /, '').replace(' 2027', ''), W - 190, ry + 2);
    if (i < list.length - 1) {
      ctx.strokeStyle = 'rgba(230, 202, 126, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(190, ry + rowH * 0.42);
      ctx.lineTo(W - 190, ry + rowH * 0.42);
      ctx.stroke();
    }
  });
  ctx.textAlign = 'center';

  // Footer
  ctx.fillStyle = C.goldLight;
  ctx.font = `600 30px ${SANS}`;
  spaced(ctx, WEDDING_DATA.couple.hashtag.toUpperCase(), W / 2, H - 160, 6);
  ctx.fillStyle = 'rgba(250,247,242,0.85)';
  ctx.font = `italic 400 38px ${SERIF}`;
  ctx.fillText('We cannot wait to celebrate with you', W / 2, H - 110);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

export function passFileName(name) {
  const slug = name.trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 40) || 'Guest';
  return `Royal-Guest-Pass-${slug}.png`;
}
