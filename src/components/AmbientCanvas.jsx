import { useEffect, useRef } from 'react';

export default function AmbientCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let W = window.innerWidth;
    let H = window.innerHeight;

    // Crisp on Retina screens: scale the backing store by devicePixelRatio (capped at 2).
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const count = window.innerWidth < 640 ? 20 : 32;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: i % 3 === 0 ? 5 + Math.random() * 4.5 : 1.5 + Math.random() * 2.2,
      speedY: 0.25 + Math.random() * 0.42,
      speedX: (Math.random() - 0.5) * 0.32,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.014,
      isPetal: i % 3 === 0,
      opacity: 0.2 + Math.random() * 0.34,
    }));

    const bursts = [];

    const onBurst = () => {
      const n = reduceMq.matches ? 16 : 42;
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
        const speed = 3 + Math.random() * 6.5;
        bursts.push({
          x: W * (0.3 + Math.random() * 0.4),
          y: H * 0.55,
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

        if (p.isPetal) {
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
        ctx.fillStyle = b.isGold ? '#E6CA7E' : '#E89BA7';
        ctx.beginPath();
        ctx.ellipse(0, 0, b.size, b.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
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
