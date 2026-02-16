import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen Venom-style symbiote reveal.
 * A viscous, glossy black mass with organic tendrils expands and splits to reveal content.
 */
const SymbioteReveal = () => {
  const [phase, setPhase] = useState<"expanding" | "splitting" | "done">("expanding");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTime = useRef(Date.now());

  const drawVenomMass = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const t = progress;

    // Background darkness
    ctx.fillStyle = `rgba(0, 0, 0, ${t * 0.95})`;
    ctx.fillRect(0, 0, w, h);

    // Multiple organic blob layers for depth
    for (let layer = 0; layer < 4; layer++) {
      const layerScale = 1 - layer * 0.12;
      const baseRadius = Math.max(w, h) * 0.55 * t * layerScale;
      const points = 64;

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Multiple noise frequencies for organic feel
        const n1 = Math.sin(angle * 3 + t * 6 + layer * 1.5) * 0.15;
        const n2 = Math.sin(angle * 7 + t * 10 + layer * 0.8) * 0.08;
        const n3 = Math.sin(angle * 13 + t * 14 + layer * 2.1) * 0.04;
        const distort = 1 + n1 + n2 + n3;
        const r = baseRadius * distort;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else {
          // Smooth curves between points
          const prevAngle = ((i - 0.5) / points) * Math.PI * 2;
          const pn = 1 + Math.sin(prevAngle * 5 + t * 8 + layer) * 0.12;
          const cpx = cx + Math.cos(prevAngle) * baseRadius * pn;
          const cpy = cy + Math.sin(prevAngle) * baseRadius * pn;
          ctx.quadraticCurveTo(cpx, cpy, x, y);
        }
      }
      ctx.closePath();

      // Glossy gradient for each layer
      const grad = ctx.createRadialGradient(
        cx - baseRadius * 0.3, cy - baseRadius * 0.3, 0,
        cx, cy, baseRadius * 1.2
      );
      if (layer === 0) {
        grad.addColorStop(0, `rgba(30, 30, 35, ${0.95 * t})`);
        grad.addColorStop(0.5, `rgba(8, 8, 12, ${0.98 * t})`);
        grad.addColorStop(1, `rgba(0, 0, 0, ${t})`);
      } else if (layer === 1) {
        grad.addColorStop(0, `rgba(25, 25, 30, ${0.7 * t})`);
        grad.addColorStop(1, `rgba(5, 5, 8, ${0.9 * t})`);
      } else {
        // Highlight/sheen layers
        grad.addColorStop(0, `rgba(60, 60, 70, ${0.15 * t})`);
        grad.addColorStop(0.4, `rgba(20, 20, 25, ${0.3 * t})`);
        grad.addColorStop(1, `rgba(0, 0, 0, 0)`);
      }
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Thick organic tendrils reaching outward
    const tendrilCount = 16;
    for (let i = 0; i < tendrilCount; i++) {
      const angle = (i / tendrilCount) * Math.PI * 2 + Math.sin(t * 3 + i) * 0.3;
      const maxReach = Math.max(w, h) * 0.6 * t;
      const startR = Math.max(w, h) * 0.3 * t;
      const thickness = (8 + Math.sin(i * 2.7) * 4) * t;

      // Draw thick tapered tendril
      const segments = 12;
      ctx.beginPath();
      for (let s = 0; s <= segments; s++) {
        const frac = s / segments;
        const segAngle = angle + Math.sin(frac * Math.PI * 2 + t * 8 + i * 1.7) * 0.2 * frac;
        const r = startR + (maxReach - startR) * frac;
        const taper = thickness * (1 - frac * 0.85);
        const perpAngle = segAngle + Math.PI / 2;

        const px = cx + Math.cos(segAngle) * r + Math.cos(perpAngle) * taper;
        const py = cy + Math.sin(segAngle) * r + Math.sin(perpAngle) * taper;

        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      // Return on other side
      for (let s = segments; s >= 0; s--) {
        const frac = s / segments;
        const segAngle = angle + Math.sin(frac * Math.PI * 2 + t * 8 + i * 1.7) * 0.2 * frac;
        const r = startR + (maxReach - startR) * frac;
        const taper = thickness * (1 - frac * 0.85);
        const perpAngle = segAngle - Math.PI / 2;

        const px = cx + Math.cos(segAngle) * r + Math.cos(perpAngle) * taper;
        const py = cy + Math.sin(segAngle) * r + Math.sin(perpAngle) * taper;
        ctx.lineTo(px, py);
      }
      ctx.closePath();

      const tGrad = ctx.createLinearGradient(
        cx + Math.cos(angle) * startR, cy + Math.sin(angle) * startR,
        cx + Math.cos(angle) * maxReach, cy + Math.sin(angle) * maxReach
      );
      tGrad.addColorStop(0, `rgba(10, 10, 14, ${0.9 * t})`);
      tGrad.addColorStop(0.7, `rgba(5, 5, 8, ${0.6 * t})`);
      tGrad.addColorStop(1, `rgba(0, 0, 0, 0)`);
      ctx.fillStyle = tGrad;
      ctx.fill();
    }

    // Glossy highlight sheen
    const sheenGrad = ctx.createRadialGradient(
      cx - w * 0.15, cy - h * 0.2, 0,
      cx, cy, Math.max(w, h) * 0.4 * t
    );
    sheenGrad.addColorStop(0, `rgba(255, 255, 255, ${0.06 * t})`);
    sheenGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.02 * t})`);
    sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(w, h) * 0.5 * t, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const drawSplit = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const t = progress;

    // Fading background
    ctx.fillStyle = `rgba(0, 0, 0, ${(1 - t) * 0.9})`;
    ctx.fillRect(0, 0, w, h);

    // Two separating masses
    for (let side = -1; side <= 1; side += 2) {
      const offsetX = side * w * t * 0.7;
      const baseR = Math.max(w, h) * 0.5 * (1 - t * 0.4);
      const points = 48;

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const n1 = Math.sin(angle * 4 + t * 5 + side * 2) * 0.12 * (1 - t);
        const n2 = Math.sin(angle * 9 + t * 8) * 0.06 * (1 - t);
        const stretch = side * Math.cos(angle) > 0 ? 1 + t * 0.6 : 1 - t * 0.3;
        const r = baseR * (1 + n1 + n2) * stretch;

        const x = cx + offsetX + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r * (1 - t * 0.15);

        if (i === 0) ctx.moveTo(x, y);
        else {
          const pa = ((i - 0.5) / points) * Math.PI * 2;
          const pr = baseR * (1 + Math.sin(pa * 6 + t * 7) * 0.1) * stretch;
          ctx.quadraticCurveTo(
            cx + offsetX + Math.cos(pa) * pr,
            cy + Math.sin(pa) * pr * (1 - t * 0.15),
            x, y
          );
        }
      }
      ctx.closePath();

      const mGrad = ctx.createRadialGradient(
        cx + offsetX - baseR * 0.2, cy - baseR * 0.2, 0,
        cx + offsetX, cy, baseR
      );
      mGrad.addColorStop(0, `rgba(25, 25, 30, ${(1 - t) * 0.9})`);
      mGrad.addColorStop(0.6, `rgba(8, 8, 12, ${(1 - t) * 0.95})`);
      mGrad.addColorStop(1, `rgba(0, 0, 0, ${(1 - t) * 0.8})`);
      ctx.fillStyle = mGrad;
      ctx.fill();
    }

    // Viscous strands stretching between halves
    if (t > 0.05 && t < 0.85) {
      const strandCount = 10;
      for (let s = 0; s < strandCount; s++) {
        const sy = h * 0.2 + (h * 0.6 * s) / strandCount;
        const strandAlpha = Math.max(0, 1 - t * 1.8 + s * 0.05);
        const thickness = (4 + Math.sin(s * 1.3) * 2) * strandAlpha;
        const leftX = cx - w * t * 0.5;
        const rightX = cx + w * t * 0.5;
        const midSag = 15 * t + Math.sin(t * 6 + s) * 10;

        if (thickness > 0.3) {
          // Draw thick viscous strand
          ctx.beginPath();
          ctx.moveTo(leftX, sy - thickness / 2);
          ctx.quadraticCurveTo(cx, sy + midSag - thickness / 2, rightX, sy - thickness / 2);
          ctx.lineTo(rightX, sy + thickness / 2);
          ctx.quadraticCurveTo(cx, sy + midSag + thickness / 2 + 3, leftX, sy + thickness / 2);
          ctx.closePath();

          ctx.fillStyle = `rgba(8, 8, 12, ${strandAlpha * 0.7})`;
          ctx.fill();

          // Strand highlight
          ctx.beginPath();
          ctx.moveTo(leftX, sy - thickness * 0.2);
          ctx.quadraticCurveTo(cx, sy + midSag - thickness * 0.3, rightX, sy - thickness * 0.2);
          ctx.strokeStyle = `rgba(60, 60, 70, ${strandAlpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Dripping droplets
    if (t > 0.2) {
      for (let d = 0; d < 12; d++) {
        const dropT = Math.max(0, (t - 0.2 - d * 0.03) * 1.5);
        if (dropT <= 0 || dropT > 1) continue;
        const dx = cx + Math.sin(d * 4.3 + 1.7) * w * 0.35;
        const dy = cy + dropT * h * 0.6 + Math.sin(d * 2.1) * 30;
        const dropW = (3 + Math.sin(d) * 2) * (1 - dropT * 0.7);
        const dropH = dropW * 1.8 + dropT * 8;

        if (dropW > 0.5) {
          ctx.beginPath();
          ctx.ellipse(dx, dy, dropW, dropH, 0, 0, Math.PI * 2);
          const dGrad = ctx.createRadialGradient(dx - dropW * 0.3, dy - dropH * 0.3, 0, dx, dy, dropH);
          dGrad.addColorStop(0, `rgba(30, 30, 35, ${(1 - dropT) * 0.8})`);
          dGrad.addColorStop(1, `rgba(5, 5, 8, ${(1 - dropT) * 0.6})`);
          ctx.fillStyle = dGrad;
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

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const animate = () => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

      if (phase === "expanding") {
        const progress = Math.min(1, elapsed / 1.4);
        const eased = 1 - Math.pow(1 - progress, 4);
        drawVenomMass(ctx, w, h, eased);
        if (progress >= 1) {
          setPhase("splitting");
          startTime.current = Date.now();
        }
      } else if (phase === "splitting") {
        const progress = Math.min(1, elapsed / 1.2);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        drawSplit(ctx, w, h, eased);
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
  }, [phase, drawVenomMass, drawSplit]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: "100vw", height: "100vh" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SymbioteReveal;
