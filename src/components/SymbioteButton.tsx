import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Movie-accurate Venom button with thick muscular tendrils,
 * wet iridescent highlights, and viscous click splashes.
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

  const tendrilCount = 10;

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
    const newDroplets: Droplet[] = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 35 + Math.random() * 55;
      return {
        id: Date.now() + i,
        x: mousePos.x * 100,
        y: mousePos.y * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        size: 4 + Math.random() * 10,
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
            transition={{ duration: 0.3 }}
            className="absolute -inset-12 pointer-events-none z-0"
            viewBox="0 0 120 120"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="tendrilGlow">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feComposite in="SourceGraphic" in2="b" operator="over" />
              </filter>
            </defs>

            {Array.from({ length: tendrilCount }).map((_, i) => {
              const baseAngle = (i / tendrilCount) * Math.PI * 2;
              const cursorAngle = Math.atan2(mousePos.y - 0.5, mousePos.x - 0.5);
              const angleDiff = Math.abs(baseAngle - cursorAngle);
              const proximity = 1 - Math.min(angleDiff, Math.PI * 2 - angleDiff) / Math.PI;
              const reach = 20 + proximity * 28;
              const thickness = 3.5 + proximity * 4;

              const startR = 26;
              const sx = 60 + Math.cos(baseAngle) * startR;
              const sy = 60 + Math.sin(baseAngle) * startR;
              const perp = baseAngle + Math.PI / 2;

              // Build thick tapered tendril with organic curve
              const segments = 5;
              const leftPts: string[] = [];
              const rightPts: string[] = [];

              for (let s = 0; s <= segments; s++) {
                const frac = s / segments;
                const wobble = Math.sin(i * 2.3 + frac * Math.PI * 2 + mousePos.x * 3) * 3 * frac;
                const segAngle = baseAngle + wobble * 0.02;
                const r = startR + reach * frac;
                const taper = thickness * (1 - frac * frac * 0.9);
                const perpA = segAngle + Math.PI / 2;

                const px = 60 + Math.cos(segAngle) * r;
                const py = 60 + Math.sin(segAngle) * r;

                leftPts.push(`${px + Math.cos(perpA) * taper} ${py + Math.sin(perpA) * taper}`);
                rightPts.unshift(`${px - Math.cos(perpA) * taper} ${py - Math.sin(perpA) * taper}`);
              }

              const pathData = `M ${leftPts[0]} ` +
                leftPts.slice(1).map((p, idx) => {
                  const prev = leftPts[idx].split(" ").map(Number);
                  const curr = p.split(" ").map(Number);
                  return `Q ${(prev[0] + curr[0]) / 2} ${(prev[1] + curr[1]) / 2} ${curr[0]} ${curr[1]}`;
                }).join(" ") +
                ` L ${rightPts[0]} ` +
                rightPts.slice(1).map((p, idx) => {
                  const prev = rightPts[idx].split(" ").map(Number);
                  const curr = p.split(" ").map(Number);
                  return `Q ${(prev[0] + curr[0]) / 2} ${(prev[1] + curr[1]) / 2} ${curr[0]} ${curr[1]}`;
                }).join(" ") +
                " Z";

              return (
                <g key={i}>
                  {/* Glow under */}
                  <motion.path
                    d={pathData}
                    fill="rgba(10, 10, 20, 0.15)"
                    filter="url(#tendrilGlow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.02 }}
                    style={{ transformOrigin: `${sx}px ${sy}px` }}
                  />
                  {/* Main tendril body */}
                  <motion.path
                    d={pathData}
                    fill="rgba(5, 5, 14, 0.35)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: `${sx}px ${sy}px` }}
                  />
                  {/* Specular highlight */}
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke="rgba(80, 100, 180, 0.08)"
                    strokeWidth="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.015 }}
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
              height: d.size * 1.4,
              background: "radial-gradient(ellipse at 30% 25%, rgba(25, 25, 40, 0.6), rgba(5, 5, 14, 0.2))",
            }}
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ x: d.vx, y: d.vy + 50, scale: 0.15, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </AnimatePresence>

      {/* Ripple */}
      {clickRipple && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          initial={{ scale: 0.5, opacity: 0.3 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20, 20, 40, 0.2), transparent 70%)",
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
