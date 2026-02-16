import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Venom-style idle effects:
 * - Thick, viscous ink blots with glossy highlights
 * - Organic ripple waves with depth
 */
interface Splatter {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  paths: string[];
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const generateVenomSplatter = (size: number): string[] => {
  const paths: string[] = [];

  // Main blob - thick, irregular
  const mainPoints = 12 + Math.floor(Math.random() * 8);
  let mainPath = "";
  const mainR = size;
  for (let i = 0; i <= mainPoints; i++) {
    const angle = (i / mainPoints) * Math.PI * 2;
    const r = mainR * (0.6 + Math.random() * 0.5);
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) {
      mainPath = `M ${x} ${y}`;
    } else {
      const cpAngle = ((i - 0.5) / mainPoints) * Math.PI * 2;
      const cpR = mainR * (0.4 + Math.random() * 0.8);
      mainPath += ` Q ${Math.cos(cpAngle) * cpR} ${Math.sin(cpAngle) * cpR} ${x} ${y}`;
    }
  }
  paths.push(mainPath + " Z");

  // Satellite drips
  const dripCount = 3 + Math.floor(Math.random() * 4);
  for (let d = 0; d < dripCount; d++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = mainR * (0.8 + Math.random() * 0.6);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const dr = size * (0.15 + Math.random() * 0.2);
    const pts = 6;
    let dPath = "";
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const r = dr * (0.7 + Math.random() * 0.4);
      const px = dx + Math.cos(a) * r;
      const py = dy + Math.sin(a) * r;
      if (i === 0) dPath = `M ${px} ${py}`;
      else {
        const cpa = ((i - 0.5) / pts) * Math.PI * 2;
        const cpr = dr * (0.5 + Math.random() * 0.6);
        dPath += ` Q ${dx + Math.cos(cpa) * cpr} ${dy + Math.sin(cpa) * cpr} ${px} ${py}`;
      }
    }
    paths.push(dPath + " Z");
  }

  // Connecting strands from main to drips
  for (let s = 0; s < Math.min(dripCount, 2); s++) {
    const angle = Math.random() * Math.PI * 2;
    const startR = mainR * 0.5;
    const endR = mainR * (0.9 + Math.random() * 0.5);
    const sx = Math.cos(angle) * startR;
    const sy = Math.sin(angle) * startR;
    const ex = Math.cos(angle + 0.1) * endR;
    const ey = Math.sin(angle + 0.1) * endR;
    const w = 1 + Math.random() * 2;
    const perp = angle + Math.PI / 2;
    paths.push(
      `M ${sx + Math.cos(perp) * w} ${sy + Math.sin(perp) * w} ` +
      `L ${ex + Math.cos(perp) * 0.3} ${ey + Math.sin(perp) * 0.3} ` +
      `L ${ex - Math.cos(perp) * 0.3} ${ey - Math.sin(perp) * 0.3} ` +
      `L ${sx - Math.cos(perp) * w} ${sy - Math.sin(perp) * w} Z`
    );
  }

  return paths;
};

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
          size: 18 + Math.random() * 25,
          rotation: Math.random() * 360,
          paths: generateVenomSplatter(20 + Math.random() * 15),
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
      setRipples((prev) => [
        ...prev.slice(-2),
        { id: Date.now(), x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 },
      ]);
    }, RIPPLE_INTERVAL);
    setRipples([{ id: Date.now(), x: 50, y: 50 }]);
    return () => { if (rippleTimer.current) clearInterval(rippleTimer.current); };
  }, [isIdle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {/* Venom ink splatters */}
      <AnimatePresence>
        {splatters.map((s) => (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.08 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              width={s.size * 4}
              height={s.size * 4}
              viewBox="-40 -40 80 80"
              style={{ transform: `rotate(${s.rotation}deg)` }}
            >
              <defs>
                <radialGradient id={`splat-${s.id}`} cx="35%" cy="35%">
                  <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="hsl(var(--foreground))" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              {s.paths.map((p, i) => (
                <path key={i} d={p} fill={i === 0 ? `url(#splat-${s.id})` : "hsl(var(--foreground) / 0.3)"} />
              ))}
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Organic ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="absolute"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ width: 0, height: 0, opacity: 0.12 }}
            animate={{ width: 500, height: 500, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                border: "1.5px solid hsl(var(--foreground) / 0.06)",
                boxShadow: "0 0 20px hsl(var(--foreground) / 0.03), inset 0 0 20px hsl(var(--foreground) / 0.02)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SymbioteIdleEffects;
