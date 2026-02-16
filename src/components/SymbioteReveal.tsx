import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen symbiote reveal on page load.
 * A dark organic mass expands with fluid tendrils, then splits apart to reveal content.
 */
const SymbioteReveal = () => {
  const [phase, setPhase] = useState<"expanding" | "splitting" | "done">("expanding");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTime = useRef(Date.now());

  const drawSymbiote = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Main mass
    const blobCount = 8;
    ctx.fillStyle = "hsl(0, 0%, 2%)";

    for (let b = 0; b < 3; b++) {
      ctx.beginPath();
      const layerAlpha = 1 - b * 0.15;
      ctx.fillStyle = `hsla(0, 0%, ${2 + b * 3}%, ${layerAlpha})`;

      for (let i = 0; i <= blobCount; i++) {
        const angle = (i / blobCount) * Math.PI * 2;
        const baseRadius = Math.min(w, h) * 0.6 * progress;
        const wobble = Math.sin(angle * 3 + progress * 8 + b) * 40 * progress;
        const tendrilStretch = Math.sin(angle * 5 + progress * 12) * 30 * progress;
        const r = baseRadius + wobble + tendrilStretch + b * 15;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevAngle = ((i - 0.5) / blobCount) * Math.PI * 2;
          const cpR = baseRadius + Math.sin(prevAngle * 4 + progress * 10) * 50 * progress + b * 15;
          const cpx = cx + Math.cos(prevAngle) * cpR;
          const cpy = cy + Math.sin(prevAngle) * cpR;
          ctx.quadraticCurveTo(cpx, cpy, x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    }

    // Tendrils extending outward
    const tendrilCount = 12;
    for (let t = 0; t < tendrilCount; t++) {
      const angle = (t / tendrilCount) * Math.PI * 2 + progress * 0.5;
      const length = Math.min(w, h) * 0.4 * progress;
      const startR = Math.min(w, h) * 0.3 * progress;

      ctx.beginPath();
      ctx.strokeStyle = `hsla(0, 0%, 5%, ${0.6 * progress})`;
      ctx.lineWidth = 3 - progress * 1.5;

      const sx = cx + Math.cos(angle) * startR;
      const sy = cy + Math.sin(angle) * startR;
      ctx.moveTo(sx, sy);

      const segments = 5;
      for (let s = 1; s <= segments; s++) {
        const frac = s / segments;
        const deviation = Math.sin(frac * Math.PI * 2 + progress * 6 + t) * 25;
        const ex = cx + Math.cos(angle + deviation * 0.01) * (startR + length * frac);
        const ey = cy + Math.sin(angle + deviation * 0.01) * (startR + length * frac) + deviation;
        ctx.lineTo(ex, ey);
      }
      ctx.stroke();
    }

    // Vein-like internal details
    ctx.strokeStyle = `hsla(0, 0%, 12%, ${0.3 * progress})`;
    ctx.lineWidth = 1;
    for (let v = 0; v < 6; v++) {
      const angle = (v / 6) * Math.PI * 2;
      const veinLen = Math.min(w, h) * 0.25 * progress;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const points = 8;
      for (let p = 1; p <= points; p++) {
        const frac = p / points;
        const jitter = Math.sin(frac * 5 + progress * 8 + v * 2) * 15;
        ctx.lineTo(
          cx + Math.cos(angle) * veinLen * frac + jitter,
          cy + Math.sin(angle) * veinLen * frac + jitter * 0.5
        );
      }
      ctx.stroke();
    }
  }, []);

  const drawSplit = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    ctx.clearRect(0, 0, w, h);

    const splitGap = w * progress * 0.8;
    const cx = w / 2;

    // Left mass
    for (let side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      ctx.fillStyle = `hsla(0, 0%, 2%, ${1 - progress * 0.8})`;

      const offsetX = side * splitGap / 2;
      const points = 12;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const baseR = Math.min(w, h) * 0.5 * (1 - progress * 0.3);
        const distort = Math.sin(angle * 3 + progress * 6) * 30 * (1 - progress);
        const r = baseR + distort;

        // Stretch horizontally away from center
        const stretchX = side * progress * 200;
        const x = cx + offsetX + Math.cos(angle) * r * (1 + progress * 0.5) + stretchX;
        const y = h / 2 + Math.sin(angle) * r * (1 - progress * 0.2);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Dripping strands between halves
      if (progress > 0.1 && progress < 0.8) {
        const strandCount = 6;
        for (let s = 0; s < strandCount; s++) {
          const sy = h * 0.3 + (h * 0.4 * s) / strandCount;
          const thickness = 2 * (1 - progress);
          const strandProgress = Math.max(0, 1 - progress * 2 + s * 0.1);

          ctx.beginPath();
          ctx.strokeStyle = `hsla(0, 0%, 5%, ${strandProgress * 0.5})`;
          ctx.lineWidth = thickness;
          ctx.moveTo(cx - splitGap * 0.3, sy + Math.sin(progress * 4 + s) * 10);
          ctx.quadraticCurveTo(
            cx, sy + 20 * progress + Math.sin(progress * 6) * 15,
            cx + splitGap * 0.3, sy + Math.sin(progress * 4 + s + 1) * 10
          );
          ctx.stroke();
        }
      }
    }

    // Droplets falling
    if (progress > 0.3) {
      const dropCount = 8;
      for (let d = 0; d < dropCount; d++) {
        const dropProgress = Math.max(0, (progress - 0.3) * 1.4);
        const dx = cx + (Math.sin(d * 3.7) * w * 0.3);
        const dy = h * 0.4 + dropProgress * h * 0.5 + d * 20;
        const dropSize = 4 * (1 - dropProgress);

        if (dropSize > 0) {
          ctx.beginPath();
          ctx.fillStyle = `hsla(0, 0%, 3%, ${(1 - dropProgress) * 0.6})`;
          ctx.ellipse(dx, dy, dropSize, dropSize * 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      const elapsed = (Date.now() - startTime.current) / 1000;

      if (phase === "expanding") {
        const progress = Math.min(1, elapsed / 1.2);
        // Non-linear easing
        const eased = 1 - Math.pow(1 - progress, 3);
        drawSymbiote(ctx, canvas.width, canvas.height, eased);
        if (progress >= 1) {
          setPhase("splitting");
          startTime.current = Date.now();
        }
      } else if (phase === "splitting") {
        const progress = Math.min(1, elapsed / 1.0);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        drawSplit(ctx, canvas.width, canvas.height, eased);
        if (progress >= 1) {
          setPhase("done");
        }
      }

      if (phase !== "done") {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, drawSymbiote, drawSplit]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          <canvas ref={canvasRef} className="w-full h-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SymbioteReveal;
