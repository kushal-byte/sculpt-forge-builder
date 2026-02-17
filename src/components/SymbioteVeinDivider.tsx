import { useRef, useMemo, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Movie-accurate Venom symbiote divider.
 * Thick, liquid-black mass crawling across the screen with
 * wet glossy highlights and iridescent blue-purple sheen.
 */
interface SymbioteVeinDividerProps {
  seed?: number;
  flip?: boolean;
  className?: string;
}

const pr = (seed: number, n: number) => {
  const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const SymbioteVeinDivider = ({ seed = 1, flip = false, className = "" }: SymbioteVeinDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Trigger canvas animation when scrolled into view
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.05 && !visible) {
        setVisible(true);
        startRef.current = Date.now();
      }
    });
    return unsub;
  }, [scrollYProgress, visible]);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1200;
    const H = 120;
    canvas.width = W * 2;
    canvas.height = H * 2;
    ctx.scale(2, 2);

    const animate = () => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const growProgress = Math.min(1, elapsed / 1.2);
      const t = 1 - Math.pow(1 - growProgress, 3); // ease-out cubic

      ctx.clearRect(0, 0, W, H);

      const baseY = flip ? 25 : H - 25;
      const dir = flip ? 1 : -1;

      // Main symbiote mass — thick filled shape
      const massHeight = 35 + t * 15;
      ctx.beginPath();
      // Top edge (organic, wavy)
      ctx.moveTo(-10, flip ? 0 : H);
      const segs = 60;
      for (let i = 0; i <= segs; i++) {
        const x = (i / segs) * (W + 20) - 10;
        const frac = i / segs;
        const spreadT = Math.max(0, Math.min(1, (t - Math.abs(frac - 0.5) * 0.8) * 2.5));

        const wave1 = Math.sin(frac * Math.PI * 4 + seed * 3 + elapsed * 0.8) * 8 * spreadT;
        const wave2 = Math.sin(frac * Math.PI * 7 + seed * 5 + elapsed * 1.2) * 4 * spreadT;
        const wave3 = Math.sin(frac * Math.PI * 13 + seed * 8) * 2 * spreadT;
        const bulge = Math.sin(frac * Math.PI) * 12 * spreadT;

        const y = baseY + dir * (massHeight * spreadT + wave1 + wave2 + wave3 + bulge);
        ctx.lineTo(x, y);
      }
      // Bottom edge (flat to edge)
      ctx.lineTo(W + 10, flip ? 0 : H);
      ctx.closePath();

      // Glossy black gradient fill
      const grad = ctx.createLinearGradient(0, flip ? 0 : H, 0, baseY + dir * massHeight);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.98)");
      grad.addColorStop(0.4, "rgba(8, 8, 14, 0.95)");
      grad.addColorStop(0.7, "rgba(12, 12, 20, 0.9)");
      grad.addColorStop(1, "rgba(5, 5, 10, 0.7)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Iridescent blue-purple highlight band
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const sheenGrad = ctx.createLinearGradient(
        W * (0.2 + Math.sin(elapsed * 0.3) * 0.15), 0,
        W * (0.6 + Math.sin(elapsed * 0.3) * 0.15), 0
      );
      sheenGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      sheenGrad.addColorStop(0.3, `rgba(40, 20, 80, ${0.12 * t})`);
      sheenGrad.addColorStop(0.5, `rgba(20, 40, 100, ${0.15 * t})`);
      sheenGrad.addColorStop(0.7, `rgba(40, 20, 80, ${0.12 * t})`);
      sheenGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sheenGrad;
      ctx.fill();
      ctx.restore();

      // Wet specular highlight
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      for (let i = 0; i <= segs; i++) {
        const x = (i / segs) * (W + 20) - 10;
        const frac = i / segs;
        const spreadT = Math.max(0, Math.min(1, (t - Math.abs(frac - 0.5) * 0.8) * 2.5));
        const wave = Math.sin(frac * Math.PI * 4 + seed * 3 + elapsed * 0.8) * 6 * spreadT;
        const y = baseY + dir * (massHeight * spreadT * 0.6 + wave);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(180, 190, 220, ${0.15 * t})`;
      ctx.stroke();
      ctx.restore();

      // Thick tendrils reaching out from the mass
      const tendrilCount = 8 + Math.floor(pr(seed, 100) * 5);
      for (let i = 0; i < tendrilCount; i++) {
        const startX = pr(seed, i + 200) * W;
        const startFrac = startX / W;
        const spreadT = Math.max(0, Math.min(1, (t - Math.abs(startFrac - 0.5) * 0.8) * 2.5));
        if (spreadT < 0.1) continue;

        const tendrilLen = (25 + pr(seed, i + 300) * 40) * spreadT;
        const angle = (flip ? Math.PI * 0.5 : -Math.PI * 0.5) + (pr(seed, i + 400) - 0.5) * 1.2;
        const thickness = (3 + pr(seed, i + 500) * 5) * spreadT;

        const wave1 = Math.sin(startFrac * Math.PI * 4 + seed * 3 + elapsed * 0.8) * 8 * spreadT;
        const startY = baseY + dir * (massHeight * spreadT + wave1);

        const segments = 6;
        const pointsLeft: [number, number][] = [];
        const pointsRight: [number, number][] = [];

        for (let s = 0; s <= segments; s++) {
          const frac = s / segments;
          const wobble = Math.sin(frac * Math.PI * 3 + elapsed * 2 + i * 1.7) * 6 * frac;
          const taper = thickness * (1 - frac * 0.9);
          const perpAngle = angle + Math.PI / 2;

          const cx = startX + Math.cos(angle) * tendrilLen * frac + wobble * Math.cos(perpAngle);
          const cy = startY + Math.sin(angle) * tendrilLen * frac + wobble * Math.sin(perpAngle);

          pointsLeft.push([cx + Math.cos(perpAngle) * taper, cy + Math.sin(perpAngle) * taper]);
          pointsRight.unshift([cx - Math.cos(perpAngle) * taper, cy - Math.sin(perpAngle) * taper]);
        }

        ctx.beginPath();
        ctx.moveTo(pointsLeft[0][0], pointsLeft[0][1]);
        for (let p = 1; p < pointsLeft.length; p++) {
          const prev = pointsLeft[p - 1];
          const curr = pointsLeft[p];
          ctx.quadraticCurveTo((prev[0] + curr[0]) / 2, (prev[1] + curr[1]) / 2, curr[0], curr[1]);
        }
        // Tip
        const tipL = pointsLeft[pointsLeft.length - 1];
        const tipR = pointsRight[0];
        ctx.quadraticCurveTo(tipL[0], tipL[1], tipR[0], tipR[1]);
        for (let p = 1; p < pointsRight.length; p++) {
          const prev = pointsRight[p - 1];
          const curr = pointsRight[p];
          ctx.quadraticCurveTo((prev[0] + curr[0]) / 2, (prev[1] + curr[1]) / 2, curr[0], curr[1]);
        }
        ctx.closePath();

        const tGrad = ctx.createLinearGradient(startX, startY, startX + Math.cos(angle) * tendrilLen, startY + Math.sin(angle) * tendrilLen);
        tGrad.addColorStop(0, "rgba(5, 5, 12, 0.9)");
        tGrad.addColorStop(0.6, "rgba(8, 8, 16, 0.6)");
        tGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = tGrad;
        ctx.fill();

        // Tendril highlight
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.beginPath();
        ctx.moveTo(pointsLeft[0][0], pointsLeft[0][1]);
        for (let p = 1; p < pointsLeft.length; p++) {
          const prev = pointsLeft[p - 1];
          const curr = pointsLeft[p];
          ctx.quadraticCurveTo((prev[0] + curr[0]) / 2, (prev[1] + curr[1]) / 2, curr[0], curr[1]);
        }
        ctx.strokeStyle = `rgba(100, 120, 180, ${0.08 * spreadT})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      // Dripping drops at the edge
      const dropCount = 5 + Math.floor(pr(seed, 900) * 4);
      for (let d = 0; d < dropCount; d++) {
        const dropX = pr(seed, d + 950) * W;
        const dropFrac = dropX / W;
        const spreadT = Math.max(0, Math.min(1, (t - Math.abs(dropFrac - 0.5) * 0.8) * 2.5));
        if (spreadT < 0.3) continue;

        const dropLen = (8 + pr(seed, d + 960) * 18) * spreadT;
        const wave = Math.sin(dropFrac * Math.PI * 4 + seed * 3 + elapsed * 0.8) * 8 * spreadT;
        const dropY = baseY + dir * (massHeight * spreadT + wave);
        const dropW = 2 + pr(seed, d + 970) * 2;

        // Teardrop shape
        ctx.beginPath();
        ctx.moveTo(dropX, dropY);
        ctx.quadraticCurveTo(dropX + dropW, dropY + dir * dropLen * 0.5, dropX, dropY + dir * dropLen);
        ctx.quadraticCurveTo(dropX - dropW, dropY + dir * dropLen * 0.5, dropX, dropY);
        ctx.closePath();

        const dGrad = ctx.createLinearGradient(dropX, dropY, dropX, dropY + dir * dropLen);
        dGrad.addColorStop(0, "rgba(5, 5, 12, 0.8)");
        dGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = dGrad;
        ctx.fill();
      }

      if (growProgress < 1 || true) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, seed, flip]);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ height: "120px" }}>
      <motion.div className="w-full h-full" style={{ opacity }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
      </motion.div>
    </div>
  );
};

export default SymbioteVeinDivider;
