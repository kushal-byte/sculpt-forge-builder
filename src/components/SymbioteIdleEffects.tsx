import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Movie-quality Venom idle effects.
 * Thick, wet symbiote blots with iridescent highlights and organic ripples.
 */
interface Splatter {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const IDLE_TIMEOUT = 5000;
const SPLATTER_INTERVAL = 3500;
const RIPPLE_INTERVAL = 7000;

const SymbioteIdleEffects = () => {
  const [isIdle, setIsIdle] = useState(false);
  const [splatters, setSplatters] = useState<Splatter[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  const splatterTimer = useRef<ReturnType<typeof setInterval>>();
  const rippleTimer = useRef<ReturnType<typeof setInterval>>();

  const resetIdle = useCallback(() => {
    setIsIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
  }, []);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
    idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle]);

  useEffect(() => {
    if (!isIdle) {
      if (splatterTimer.current) clearInterval(splatterTimer.current);
      const t = setTimeout(() => setSplatters([]), 1000);
      return () => clearTimeout(t);
    }
    splatterTimer.current = setInterval(() => {
      setSplatters((prev) => [
        ...prev.slice(-3),
        {
          id: Date.now(),
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          size: 60 + Math.random() * 40,
          rotation: Math.random() * 360,
        },
      ]);
    }, SPLATTER_INTERVAL);
    return () => { if (splatterTimer.current) clearInterval(splatterTimer.current); };
  }, [isIdle]);

  useEffect(() => {
    if (!isIdle) {
      if (rippleTimer.current) clearInterval(rippleTimer.current);
      setRipples([]);
      return;
    }
    rippleTimer.current = setInterval(() => {
      setRipples((prev) => [...prev.slice(-2), { id: Date.now(), x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 }]);
    }, RIPPLE_INTERVAL);
    setRipples([{ id: Date.now(), x: 50, y: 50 }]);
    return () => { if (rippleTimer.current) clearInterval(rippleTimer.current); };
  }, [isIdle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {/* Venom symbiote blots — canvas-based for movie quality */}
      <AnimatePresence>
        {splatters.map((s) => (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SplatCanvas size={s.size} rotation={s.rotation} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Organic ripples with symbiote feel */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="absolute"
            style={{ left: `${r.x}%`, top: `${r.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ width: 0, height: 0, opacity: 0.1 }}
            animate={{ width: 600, height: 600, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                border: "2px solid rgba(20, 25, 50, 0.08)",
                boxShadow: "0 0 30px rgba(30, 20, 60, 0.04), inset 0 0 30px rgba(20, 30, 50, 0.03)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/** Individual splat rendered on a small canvas for movie-quality look */
const SplatCanvas = ({ size, rotation }: { size: number; rotation: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = size * 2;
    canvas.width = s;
    canvas.height = s;
    const cx = s / 2;
    const cy = s / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotation * Math.PI) / 180);

    // Main blob
    const mainR = size * 0.35;
    const points = 16;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const r = mainR * (0.7 + Math.random() * 0.4);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else {
        const pa = ((i - 0.5) / points) * Math.PI * 2;
        const pr = mainR * (0.5 + Math.random() * 0.6);
        ctx.quadraticCurveTo(Math.cos(pa) * pr, Math.sin(pa) * pr, x, y);
      }
    }
    ctx.closePath();

    // Glossy black fill
    const grad = ctx.createRadialGradient(-mainR * 0.3, -mainR * 0.3, 0, 0, 0, mainR * 1.2);
    grad.addColorStop(0, "rgba(18, 18, 28, 0.12)");
    grad.addColorStop(0.5, "rgba(6, 6, 14, 0.1)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.04)");
    ctx.fillStyle = grad;
    ctx.fill();

    // Iridescent highlight
    ctx.globalCompositeOperation = "screen";
    const sGrad = ctx.createRadialGradient(-mainR * 0.2, -mainR * 0.25, 0, 0, 0, mainR * 0.6);
    sGrad.addColorStop(0, "rgba(50, 30, 100, 0.06)");
    sGrad.addColorStop(0.5, "rgba(20, 40, 90, 0.04)");
    sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = sGrad;
    ctx.fill();

    // Satellite drips
    ctx.globalCompositeOperation = "source-over";
    const dripCount = 3 + Math.floor(Math.random() * 3);
    for (let d = 0; d < dripCount; d++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = mainR * (0.9 + Math.random() * 0.5);
      const dr = mainR * (0.15 + Math.random() * 0.15);
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(angle) * dist,
        Math.sin(angle) * dist,
        dr, dr * 1.3, angle, 0, Math.PI * 2
      );
      ctx.fillStyle = "rgba(8, 8, 16, 0.08)";
      ctx.fill();
    }

    // Connecting strands
    for (let s = 0; s < 2; s++) {
      const angle = Math.random() * Math.PI * 2;
      const startR = mainR * 0.5;
      const endR = mainR * (0.8 + Math.random() * 0.4);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * startR, Math.sin(angle) * startR);
      ctx.lineTo(Math.cos(angle) * endR, Math.sin(angle) * endR);
      ctx.strokeStyle = "rgba(8, 8, 16, 0.06)";
      ctx.lineWidth = 1.5 + Math.random() * 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }, [size, rotation]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
    />
  );
};

export default SymbioteIdleEffects;
