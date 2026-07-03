import { useEffect, useRef } from "react";
import "./Confetti.css";

const COLORS = [
  "#2563EB",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#4F46E5",
  "#EF4444",
];
const PIECE_COUNT = 80;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: PIECE_COUNT }, () => ({
      x: randomBetween(0, canvas.width),
      y: randomBetween(-canvas.height, 0),
      w: randomBetween(7, 14),
      h: randomBetween(4, 8),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: randomBetween(0, Math.PI * 2),
      vx: randomBetween(-1.2, 1.2),
      vy: randomBetween(2.5, 5),
      vr: randomBetween(-0.05, 0.05),
      opacity: randomBetween(0.6, 1),
    }));

    let rafId;
    let active = true;

    const draw = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = randomBetween(0, canvas.width);
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      rafId = requestAnimationFrame(draw);
    };

    draw();

    // Stop after 3.5 seconds to avoid distracting from UI
    const stopId = setTimeout(() => {
      active = false;
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 3500);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      clearTimeout(stopId);
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}
