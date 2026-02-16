import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Venom-style button with thick organic tendrils,
 * viscous click splashes, and glossy highlights.
 */
interface SymbioteButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}

interface Droplet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const SymbioteButton = ({ children, onClick, className = "", disabled }: SymbioteButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [clickRipple, setClickRipple] = useState(false);

  const tendrilCount = 8;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    const newDroplets: Droplet[] = Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 30 + Math.random() * 50;
      return {
        id: Date.now() + i,
        x: mousePos.x * 100,
        y: mousePos.y * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 15,
        size: 4 + Math.random() * 8,
      };
    });
    setDroplets(newDroplets);
    setClickRipple(true);
    setTimeout(() => setDroplets([]), 900);
    setTimeout(() => setClickRipple(false), 700);
    onClick?.(e);
  }, [disabled, mousePos, onClick]);

  useEffect(() => {
    return () => setDroplets([]);
  }, []);

  return (
    <div ref={buttonRef} className="relative inline-block">
      {/* Venom tendril SVG layer */}
      <AnimatePresence>
        {isHovered && (
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute -inset-10 pointer-events-none z-0"
            viewBox="0 0 120 120"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="tendrilGlow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feComposite in="SourceGraphic" in2="b" operator="over" />
              </filter>
              <radialGradient id="tendrilFill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
              </radialGradient>
            </defs>

            {Array.from({ length: tendrilCount }).map((_, i) => {
              const baseAngle = (i / tendrilCount) * Math.PI * 2;
              const cursorAngle = Math.atan2(mousePos.y - 0.5, mousePos.x - 0.5);
              const angleDiff = Math.abs(baseAngle - cursorAngle);
              const proximity = 1 - Math.min(angleDiff, Math.PI * 2 - angleDiff) / Math.PI;
              const reach = 18 + proximity * 22;
              const thickness = 2.5 + proximity * 3;

              // Thick tapered tendril via filled path
              const startR = 28;
              const sx = 60 + Math.cos(baseAngle) * startR;
              const sy = 60 + Math.sin(baseAngle) * startR;
              const ex = 60 + Math.cos(baseAngle) * (startR + reach);
              const ey = 60 + Math.sin(baseAngle) * (startR + reach);
              const perp = baseAngle + Math.PI / 2;

              // Control points with organic wobble
              const cpOff = Math.sin(i * 2.3 + mousePos.x * 4) * 5;
              const cpx = (sx + ex) / 2 + Math.cos(perp) * cpOff;
              const cpy = (sy + ey) / 2 + Math.sin(perp) * cpOff;

              // Build thick path (two sides)
              const halfT = thickness / 2;
              const tipT = 0.5;
              const p = [
                `M ${sx + Math.cos(perp) * halfT} ${sy + Math.sin(perp) * halfT}`,
                `Q ${cpx + Math.cos(perp) * halfT * 0.6} ${cpy + Math.sin(perp) * halfT * 0.6} ${ex + Math.cos(perp) * tipT} ${ey + Math.sin(perp) * tipT}`,
                `L ${ex - Math.cos(perp) * tipT} ${ey - Math.sin(perp) * tipT}`,
                `Q ${cpx - Math.cos(perp) * halfT * 0.6} ${cpy - Math.sin(perp) * halfT * 0.6} ${sx - Math.cos(perp) * halfT} ${sy - Math.sin(perp) * halfT}`,
                "Z"
              ].join(" ");

              return (
                <g key={i}>
                  {/* Glow under */}
                  <motion.path
                    d={p}
                    fill="hsl(var(--foreground) / 0.06)"
                    filter="url(#tendrilGlow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.025 }}
                    style={{ transformOrigin: `${sx}px ${sy}px` }}
                  />
                  {/* Main tendril */}
                  <motion.path
                    d={p}
                    fill="hsl(var(--foreground) / 0.2)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.025, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: `${sx}px ${sy}px` }}
                  />
                  {/* Highlight line */}
                  <motion.line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke="hsl(var(--foreground) / 0.08)"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.02 }}
                  />
                </g>
              );
            })}
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Viscous droplet splash */}
      <AnimatePresence>
        {droplets.map((d) => (
          <motion.div
            key={d.id}
            className="absolute rounded-full pointer-events-none z-20"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size * 1.3,
              background: "radial-gradient(ellipse at 30% 30%, hsl(var(--foreground) / 0.5), hsl(var(--foreground) / 0.15))",
            }}
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{
              x: d.vx,
              y: d.vy + 50,
              scale: 0.2,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </AnimatePresence>

      {/* Ripple */}
      {clickRipple && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          initial={{ scale: 0.5, opacity: 0.4 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(var(--foreground) / 0.15), transparent 70%)",
            transformOrigin: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
          }}
        />
      )}

      {/* Button content */}
      <motion.div
        className={`relative z-10 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SymbioteButton;
