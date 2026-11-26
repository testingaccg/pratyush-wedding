import { useEffect, useRef } from 'react';

export default function AmbientCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const reduceMq = { matches: false };
    let W = window.innerWidth;
    let H = window.innerHeight;

    // Scale backing store by devicePixelRatio (capped at 1 on mobile, 1.5 on desktop for smooth 60fps).
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = W < 640 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const count = window.innerWidth < 640 ? 10 : 22;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: i % 4 === 0 ? 5.5 + Math.random() * 3.5 : i % 3 === 0 ? 5 + Math.random() * 4.5 : 1.5 + Math.random() * 2.2,
      speedY: 0.25 + Math.random() * 0.42,
      speedX: (Math.random() - 0.5) * 0.32,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.014,
      kind: i % 4 === 0 ? 'shiuli' : i % 3 === 0 ? 'petal' : 'gold',
      opacity: i % 4 === 0 ? 0.42 + Math.random() * 0.28 : 0.2 + Math.random() * 0.34,
    }));

    const drawShiuli = (size) => {
      // Iconic Bengali Shiuli (Parijat) flower: 5 ivory petals + coral-orange center
      ctx.fillStyle = '#FFFDF9';
      const dist = size * 0.62;
      const rx = size * 0.28;
      const ry = size * 0.5;
      for (let k = 0; k < 5; k++) {
        const a = (k * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.ellipse(Math.sin(a) * dist, -Math.cos(a) * dist, rx, ry, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#D95D24';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.24, 0, Math.PI * 2);
      ctx.fill();
    };

    const bursts = [];

    // detail {x, y} (viewport px) bursts from that point, fanning up & inward;
    // without it, a centred shower (used by the quiz).
    const onBurst = (e) => {
      if (bursts.length > 360) return; // rapid tapping can't snowball
      const origin = e?.detail;
      const n = reduceMq.matches ? 16 : origin ? 34 : 42;
      const aim = origin ? (origin.x < W / 2 ? -Math.PI / 3 : (-2 * Math.PI) / 3) : -Math.PI / 2;
      for (let i = 0; i < n; i++) {
        const angle = aim + (Math.random() - 0.5) * (origin ? 1.1 : 1.9);
        const speed = origin ? 7 + Math.random() * 7 : 3 + Math.random() * 6.5;
        bursts.push({
          x: origin ? origin.x : W * (0.3 + Math.random() * 0.4),
          y: origin ? origin.y : H * 0.55,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 4 + Math.random() * 5,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.12,
          isGold: i % 3 === 0,
          life: 1,
        });
      }
    };

    window.addEventListener('wedding-petal-burst', onBurst);

    const draw = () => {
      if (document.hidden) {
        animId = null;
        return;
      }
      ctx.clearRect(0, 0, W, H);

      // Reduced motion: no ambient drift — only user-triggered bursts are drawn.
      for (const p of reduceMq.matches ? [] : particles) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.012) * 0.22;
        p.rot += p.rotSpeed;

        if (p.y > H + 20) {
          p.y = -20;
          p.x = Math.random() * W;
        }
        if (p.x > W + 20) p.x = -20;
        if (p.x < -20) p.x = W + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity;

        if (p.kind === 'shiuli') {
          drawShiuli(p.size);
        } else if (p.kind === 'petal') {
          ctx.fillStyle = '#E8B4BC';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.58, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#C59B38';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.12; // soft gravity
        b.rot += b.rotSpeed;
        b.life -= 0.011;

        if (b.life <= 0) {
          bursts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.globalAlpha = Math.max(0, b.life);
        if (i % 4 === 0) {
          drawShiuli(b.size * 0.9);
        } else {
          ctx.fillStyle = b.isGold ? '#E6CA7E' : '#E89BA7';
          ctx.beginPath();
          ctx.ellipse(0, 0, b.size, b.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    const onVis = () => {
      if (!document.hidden && !animId) {
        animId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
      window.removeEventListener('wedding-petal-burst', onBurst);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10"
    />
  );
}
