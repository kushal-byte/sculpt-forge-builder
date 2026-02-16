import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Symbiote-themed button wrapper.
 * - Tendrils extend on hover and form nodes near cursor
 * - Click triggers morphing symbiote splash effect
 */
interface SymbioteButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}

interface Tendril {
  id: number;
  angle: number;
  length: number;
  wobble: number;
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
  const [tendrils] = useState<Tendril[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      angle: (i / 10) * Math.PI * 2,
      length: 20 + Math.random() * 25,
      wobble: Math.random() * 10,
    }))
  );
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [clickRipple, setClickRipple] = useState(false);

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

    // Generate splash droplets
    const newDroplets: Droplet[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: mousePos.x * 100,
      y: mousePos.y * 100,
      vx: (Math.random() - 0.5) * 60,
      vy: (Math.random() - 0.5) * 60 - 20,
      size: 3 + Math.random() * 5,
    }));
    setDroplets(newDroplets);
    setClickRipple(true);

    setTimeout(() => setDroplets([]), 800);
    setTimeout(() => setClickRipple(false), 600);

    onClick?.(e);
  }, [disabled, mousePos, onClick]);

  // Clean droplets on unmount
  useEffect(() => {
    return () => setDroplets([]);
  }, []);

  return (
    <div ref={buttonRef} className="relative inline-block">
      {/* Tendril SVG layer */}
      <AnimatePresence>
        {isHovered && (
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -inset-8 pointer-events-none z-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {tendrils.map((t) => {
              // Tendrils orient toward cursor
              const cursorAngle = Math.atan2(mousePos.y - 0.5, mousePos.x - 0.5);
              const angleDiff = Math.abs(t.angle - cursorAngle);
              const proximity = 1 - Math.min(angleDiff, Math.PI * 2 - angleDiff) / Math.PI;
              const adjustedLength = t.length * (0.5 + proximity * 1.2);

              const sx = 50 + Math.cos(t.angle) * 25;
              const sy = 50 + Math.sin(t.angle) * 25;
              const ex = 50 + Math.cos(t.angle) * (25 + adjustedLength);
              const ey = 50 + Math.sin(t.angle) * (25 + adjustedLength);
              const cpx = (sx + ex) / 2 + Math.sin(t.wobble + Date.now() * 0.003) * 8;
              const cpy = (sy + ey) / 2 + Math.cos(t.wobble + Date.now() * 0.003) * 8;

              return (
                <motion.path
                  key={t.id}
                  d={`M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`}
                  stroke="hsl(var(--foreground) / 0.25)"
                  strokeWidth="0.8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 0.4, delay: t.id * 0.03, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}

            {/* Proximity nodes */}
            {tendrils.filter((_, i) => i % 3 === 0).map((t) => {
              const cursorAngle = Math.atan2(mousePos.y - 0.5, mousePos.x - 0.5);
              const angleDiff = Math.abs(t.angle - cursorAngle);
              const proximity = 1 - Math.min(angleDiff, Math.PI * 2 - angleDiff) / Math.PI;

              if (proximity < 0.5) return null;

              const nx = 50 + Math.cos(t.angle) * (25 + t.length * 0.6);
              const ny = 50 + Math.sin(t.angle) * (25 + t.length * 0.6);

              return (
                <motion.circle
                  key={`node-${t.id}`}
                  cx={nx}
                  cy={ny}
                  r={1.5 + proximity * 2}
                  fill="hsl(var(--ssg-gold) / 0.4)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              );
            })}
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Droplet splash effect */}
      <AnimatePresence>
        {droplets.map((d) => (
          <motion.div
            key={d.id}
            className="absolute rounded-full bg-foreground/30 pointer-events-none z-20"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
            }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{
              x: d.vx,
              y: d.vy + 40,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </AnimatePresence>

      {/* Click ripple */}
      {clickRipple && (
        <motion.div
          className="absolute inset-0 bg-foreground/10 pointer-events-none z-10"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: "50%",
            transformOrigin: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
          }}
        />
      )}

      {/* Actual button */}
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
