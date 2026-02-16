import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Idle symbiote effects:
 * - Random ink splatters after inactivity
 * - Subtle background ripple waves
 */
interface Splatter {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  path: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const generateSplatterPath = (size: number): string => {
  const points = 8 + Math.floor(Math.random() * 6);
  let path = "";
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = size * (0.5 + Math.random() * 0.5);
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) path += `M ${x} ${y}`;
    else {
      const cpAngle = ((i - 0.5) / points) * Math.PI * 2;
      const cpr = size * (0.3 + Math.random() * 0.7);
      path += ` Q ${Math.cos(cpAngle) * cpr} ${Math.sin(cpAngle) * cpr} ${x} ${y}`;
    }
  }
  return path + " Z";
};

const IDLE_TIMEOUT = 5000; // 5 seconds
const SPLATTER_INTERVAL = 3000;
const RIPPLE_INTERVAL = 8000;

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

  // Spawn splatters when idle
  useEffect(() => {
    if (!isIdle) {
      if (splatterTimer.current) clearInterval(splatterTimer.current);
      // Fade splatters when user returns
      const fadeTimeout = setTimeout(() => setSplatters([]), 1000);
      return () => clearTimeout(fadeTimeout);
    }

    splatterTimer.current = setInterval(() => {
      const newSplatter: Splatter = {
        id: Date.now(),
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 15 + Math.random() * 30,
        rotation: Math.random() * 360,
        path: generateSplatterPath(20 + Math.random() * 20),
      };
      setSplatters((prev) => [...prev.slice(-4), newSplatter]);
    }, SPLATTER_INTERVAL);

    return () => {
      if (splatterTimer.current) clearInterval(splatterTimer.current);
    };
  }, [isIdle]);

  // Background ripple
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

    // Initial ripple
    setRipples([{ id: Date.now(), x: 50, y: 50 }]);

    return () => {
      if (rippleTimer.current) clearInterval(rippleTimer.current);
    };
  }, [isIdle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {/* Ink Splatters */}
      <AnimatePresence>
        {splatters.map((s) => (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.06 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <svg
              width={s.size * 3}
              height={s.size * 3}
              viewBox="-30 -30 60 60"
              style={{ transform: `rotate(${s.rotation}deg)` }}
            >
              <path d={s.path} fill="hsl(var(--foreground))" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Background Ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="absolute rounded-full border border-foreground/5"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ width: 0, height: 0, opacity: 0.1 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 4,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SymbioteIdleEffects;
