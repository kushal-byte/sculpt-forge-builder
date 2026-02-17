import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Movie-accurate Venom symbiote page reveal.
 * Liquid black mass with iridescent blue-purple highlights,
 * wet specular sheen, muscular tendrils, and viscous splitting.
 */
const SymbioteReveal = () => {
  const [phase, setPhase] = useState<"expanding" | "splitting" | "done">("expanding");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const startTime = useRef(Date.now());

  const drawVenomMass = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const t = progress;
    const time = Date.now() / 1000;

    // Deep black background
    ctx.fillStyle = `rgba(0, 0, 0, ${t * 0.97})`;
    ctx.fillRect(0, 0, w, h);

    // Main organic mass — multiple layers for depth
    for (let layer = 0; layer < 5; layer++) {
      const layerScale = 1 - layer * 0.08;
      const baseRadius = Math.max(w, h) * 0.6 * t * layerScale;
      const points = 80;

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Organic noise — multiple overlapping sine waves
        const n1 = Math.sin(angle * 3 + time * 2.5 + layer * 1.2) * 0.12;
        const n2 = Math.sin(angle * 5 + time * 3.8 + layer * 0.7) * 0.08;
        const n3 = Math.sin(angle * 8 + time * 5.2 + layer * 2.3) * 0.05;
        const n4 = Math.sin(angle * 13 + time * 7 + layer * 1.5) * 0.03;
        const muscular = Math.abs(Math.sin(angle * 6 + time * 1.5)) * 0.06; // muscular bulges
        const distort = 1 + n1 + n2 + n3 + n4 + muscular;
        const r = baseRadius * distort;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else {
          const pAngle = ((i - 0.5) / points) * Math.PI * 2;
          const pR = baseRadius * (1 + Math.sin(pAngle * 5 + time * 4 + layer) * 0.1);
          ctx.quadraticCurveTo(cx + Math.cos(pAngle) * pR, cy + Math.sin(pAngle) * pR, x, y);
        }
      }
      ctx.closePath();

      // Layered glossy gradients
      const grad = ctx.createRadialGradient(
        cx - baseRadius * 0.35, cy - baseRadius * 0.35, 0,
        cx, cy, baseRadius * 1.3
      );
      if (layer === 0) {
        grad.addColorStop(0, `rgba(18, 18, 28, ${0.97 * t})`);
        grad.addColorStop(0.3, `rgba(8, 8, 14, ${0.98 * t})`);
        grad.addColorStop(0.7, `rgba(4, 4, 8, ${0.99 * t})`);
        grad.addColorStop(1, `rgba(0, 0, 0, ${t})`);
      } else if (layer <= 2) {
        grad.addColorStop(0, `rgba(15, 15, 25, ${0.6 * t})`);
        grad.addColorStop(1, `rgba(3, 3, 6, ${0.8 * t})`);
      } else {
        // Iridescent highlight layers
        grad.addColorStop(0, `rgba(30, 20, 60, ${0.08 * t})`);
        grad.addColorStop(0.5, `rgba(15, 25, 50, ${0.06 * t})`);
        grad.addColorStop(1, `rgba(0, 0, 0, 0)`);
      }
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Thick muscular tendrils
    const tendrilCount = 20;
    for (let i = 0; i < tendrilCount; i++) {
      const angle = (i / tendrilCount) * Math.PI * 2 + Math.sin(time * 1.5 + i) * 0.15;
      const maxReach = Math.max(w, h) * 0.65 * t;
      const startR = Math.max(w, h) * 0.35 * t;
      const thickness = (10 + Math.sin(i * 2.7 + time) * 5) * t;

      const segments = 10;
      const leftPts: [number, number][] = [];
      const rightPts: [number, number][] = [];

      for (let s = 0; s <= segments; s++) {
        const frac = s / segments;
        const wobble = Math.sin(frac * Math.PI * 2.5 + time * 3 + i * 1.7) * 12 * frac;
        const segAngle = angle + wobble * 0.01;
        const r = startR + (maxReach - startR) * frac;
        const taper = thickness * (1 - frac * frac * 0.85);
        const perpAngle = segAngle + Math.PI / 2;

        const px = cx + Math.cos(segAngle) * r;
        const py = cy + Math.sin(segAngle) * r;

        leftPts.push([px + Math.cos(perpAngle) * taper, py + Math.sin(perpAngle) * taper]);
        rightPts.unshift([px - Math.cos(perpAngle) * taper, py - Math.sin(perpAngle) * taper]);
      }

      ctx.beginPath();
      ctx.moveTo(leftPts[0][0], leftPts[0][1]);
      for (let p = 1; p < leftPts.length; p++) {
        const prev = leftPts[p - 1];
        const curr = leftPts[p];
        ctx.quadraticCurveTo((prev[0] + curr[0]) / 2, (prev[1] + curr[1]) / 2, curr[0], curr[1]);
      }
      const tipL = leftPts[leftPts.length - 1];
      const tipR = rightPts[0];
      ctx.quadraticCurveTo(tipL[0], tipL[1], tipR[0], tipR[1]);
      for (let p = 1; p < rightPts.length; p++) {
        const prev = rightPts[p - 1];
        const curr = rightPts[p];
        ctx.quadraticCurveTo((prev[0] + curr[0]) / 2, (prev[1] + curr[1]) / 2, curr[0], curr[1]);
      }
      ctx.closePath();

      const tGrad = ctx.createLinearGradient(
        cx + Math.cos(angle) * startR, cy + Math.sin(angle) * startR,
        cx + Math.cos(angle) * maxReach, cy + Math.sin(angle) * maxReach
      );
      tGrad.addColorStop(0, `rgba(6, 6, 14, ${0.9 * t})`);
      tGrad.addColorStop(0.5, `rgba(4, 4, 10, ${0.6 * t})`);
      tGrad.addColorStop(1, `rgba(0, 0, 0, 0)`);
      ctx.fillStyle = tGrad;
      ctx.fill();

      // Specular highlight on each tendril
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.moveTo(leftPts[0][0], leftPts[0][1]);
      for (let p = 1; p < leftPts.length; p++) {
        const prev = leftPts[p - 1];
        const curr = leftPts[p];
        ctx.quadraticCurveTo((prev[0] + curr[0]) / 2, (prev[1] + curr[1]) / 2, curr[0], curr[1]);
      }
      ctx.strokeStyle = `rgba(100, 130, 200, ${0.06 * t})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // Iridescent sheen (moving across surface)
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const sheenX = cx + Math.cos(time * 0.4) * w * 0.2;
    const sheenY = cy + Math.sin(time * 0.3) * h * 0.2;
    const sheenGrad = ctx.createRadialGradient(sheenX, sheenY, 0, cx, cy, Math.max(w, h) * 0.45 * t);
    sheenGrad.addColorStop(0, `rgba(60, 40, 120, ${0.07 * t})`);
    sheenGrad.addColorStop(0.3, `rgba(30, 50, 110, ${0.05 * t})`);
    sheenGrad.addColorStop(0.6, `rgba(20, 30, 80, ${0.03 * t})`);
    sheenGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(w, h) * 0.55 * t, 0, Math.PI * 2);
    ctx.fillStyle = sheenGrad;
    ctx.fill();
    ctx.restore();

    // Wet white specular highlight
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const hlGrad = ctx.createRadialGradient(
      cx - w * 0.18, cy - h * 0.22, 0,
      cx, cy, Math.max(w, h) * 0.3 * t
    );
    hlGrad.addColorStop(0, `rgba(255, 255, 255, ${0.08 * t})`);
    hlGrad.addColorStop(0.4, `rgba(200, 210, 240, ${0.03 * t})`);
    hlGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = hlGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(w, h) * 0.4 * t, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, []);

  const drawSplit = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const t = progress;
    const time = Date.now() / 1000;

    ctx.fillStyle = `rgba(0, 0, 0, ${(1 - t) * 0.95})`;
    ctx.fillRect(0, 0, w, h);

    // Two separating masses
    for (let side = -1; side <= 1; side += 2) {
      const offsetX = side * w * t * 0.75;
      const baseR = Math.max(w, h) * 0.5 * (1 - t * 0.3);
      const points = 60;

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const n1 = Math.sin(angle * 4 + time * 3 + side * 2) * 0.1 * (1 - t);
        const n2 = Math.sin(angle * 7 + time * 5) * 0.05 * (1 - t);
        const muscular = Math.abs(Math.sin(angle * 5 + time * 2)) * 0.04 * (1 - t);
        const stretch = side * Math.cos(angle) > 0 ? 1 + t * 0.8 : 1 - t * 0.4;
        const r = baseR * (1 + n1 + n2 + muscular) * stretch;

        const x = cx + offsetX + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r * (1 - t * 0.1);

        if (i === 0) ctx.moveTo(x, y);
        else {
          const pa = ((i - 0.5) / points) * Math.PI * 2;
          const pr = baseR * (1 + Math.sin(pa * 6 + time * 4) * 0.08) * stretch;
          ctx.quadraticCurveTo(cx + offsetX + Math.cos(pa) * pr, cy + Math.sin(pa) * pr, x, y);
        }
      }
      ctx.closePath();

      const mGrad = ctx.createRadialGradient(
        cx + offsetX - baseR * 0.25, cy - baseR * 0.25, 0,
        cx + offsetX, cy, baseR
      );
      mGrad.addColorStop(0, `rgba(18, 18, 28, ${(1 - t) * 0.95})`);
      mGrad.addColorStop(0.4, `rgba(6, 6, 12, ${(1 - t) * 0.97})`);
      mGrad.addColorStop(1, `rgba(0, 0, 0, ${(1 - t) * 0.85})`);
      ctx.fillStyle = mGrad;
      ctx.fill();

      // Iridescent highlight on each half
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const sGrad = ctx.createRadialGradient(
        cx + offsetX - baseR * 0.2, cy - baseR * 0.2, 0,
        cx + offsetX, cy, baseR * 0.6
      );
      sGrad.addColorStop(0, `rgba(50, 30, 100, ${0.06 * (1 - t)})`);
      sGrad.addColorStop(0.5, `rgba(20, 40, 90, ${0.04 * (1 - t)})`);
      sGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sGrad;
      ctx.fill();
      ctx.restore();
    }

    // Thick viscous strands stretching between halves
    if (t > 0.02 && t < 0.9) {
      const strandCount = 14;
      for (let s = 0; s < strandCount; s++) {
        const sy = h * 0.15 + (h * 0.7 * s) / strandCount;
        const alpha = Math.max(0, 1 - t * 2 + s * 0.04);
        const thickness = (5 + Math.sin(s * 1.3) * 3) * alpha;
        if (thickness < 0.4) continue;

        const leftX = cx - w * t * 0.55;
        const rightX = cx + w * t * 0.55;
        const sag = 20 * t * t + Math.sin(time * 3 + s * 0.7) * 8 * t;

        // Thick filled strand
        ctx.beginPath();
        ctx.moveTo(leftX, sy - thickness);
        ctx.bezierCurveTo(
          cx - w * 0.1, sy + sag - thickness,
          cx + w * 0.1, sy + sag - thickness,
          rightX, sy - thickness
        );
        ctx.lineTo(rightX, sy + thickness);
        ctx.bezierCurveTo(
          cx + w * 0.1, sy + sag + thickness + 4,
          cx - w * 0.1, sy + sag + thickness + 4,
          leftX, sy + thickness
        );
        ctx.closePath();

        ctx.fillStyle = `rgba(5, 5, 12, ${alpha * 0.75})`;
        ctx.fill();

        // Specular line on strand
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.beginPath();
        ctx.moveTo(leftX, sy - thickness * 0.3);
        ctx.bezierCurveTo(cx - w * 0.1, sy + sag - thickness * 0.4, cx + w * 0.1, sy + sag - thickness * 0.4, rightX, sy - thickness * 0.3);
        ctx.strokeStyle = `rgba(120, 140, 200, ${alpha * 0.12})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Dripping drops
    if (t > 0.15) {
      for (let d = 0; d < 15; d++) {
        const dropT = Math.max(0, (t - 0.15 - d * 0.025) * 1.8);
        if (dropT <= 0 || dropT > 1) continue;
        const dx = cx + Math.sin(d * 4.3 + 1.7) * w * 0.4;
        const dy = cy + dropT * h * 0.55 + Math.sin(d * 2.1) * 25;
        const dropW = (3.5 + Math.sin(d) * 2) * (1 - dropT * 0.6);
        const dropH = dropW * 2 + dropT * 10;

        if (dropW > 0.5) {
          ctx.beginPath();
          ctx.ellipse(dx, dy, dropW, dropH, 0, 0, Math.PI * 2);
          const dGrad = ctx.createRadialGradient(dx - dropW * 0.3, dy - dropH * 0.25, 0, dx, dy, dropH);
          dGrad.addColorStop(0, `rgba(20, 20, 30, ${(1 - dropT) * 0.85})`);
          dGrad.addColorStop(1, `rgba(3, 3, 8, ${(1 - dropT) * 0.5})`);
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
    };
    resize();

    const animate = () => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

      if (phase === "expanding") {
        const progress = Math.min(1, elapsed / 1.6);
        const eased = 1 - Math.pow(1 - progress, 4);
        drawVenomMass(ctx, w, h, eased);
        if (progress >= 1) {
          setPhase("splitting");
          startTime.current = Date.now();
        }
      } else if (phase === "splitting") {
        const progress = Math.min(1, elapsed / 1.3);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        drawSplit(ctx, w, h, eased);
        if (progress >= 1) setPhase("done");
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
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
