import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Venom-style thick organic vein/tendril section divider.
 * Multiple overlapping paths with gradients and glow for viscous, fleshy look.
 */
interface SymbioteVeinDividerProps {
  seed?: number;
  flip?: boolean;
  className?: string;
}

const pseudoRandom = (seed: number, n: number) => {
  const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const generateVeinPaths = (seed: number, width: number, flip: boolean) => {
  const baseY = flip ? 20 : 80;
  const veins: { path: string; thickness: number; offset: number }[] = [];

  // Main thick vein
  const mainPoints: [number, number][] = [];
  const segs = 12 + Math.floor(pseudoRandom(seed, 0) * 6);
  for (let i = 0; i <= segs; i++) {
    const x = (i / segs) * width;
    const wave = Math.sin((i / segs) * Math.PI * 2 + seed) * 18;
    const noise = (pseudoRandom(seed, i + 10) - 0.5) * 14;
    mainPoints.push([x, baseY + wave + noise]);
  }

  let mainPath = `M ${mainPoints[0][0]} ${mainPoints[0][1]}`;
  for (let i = 1; i < mainPoints.length; i++) {
    const prev = mainPoints[i - 1];
    const curr = mainPoints[i];
    const cpx = (prev[0] + curr[0]) / 2;
    const cpy = (prev[1] + curr[1]) / 2 + (pseudoRandom(seed, i + 30) - 0.5) * 12;
    mainPath += ` Q ${cpx} ${cpy} ${curr[0]} ${curr[1]}`;
  }
  veins.push({ path: mainPath, thickness: 6, offset: 0 });

  // Parallel thinner veins
  for (let v = 0; v < 3; v++) {
    const yShift = (v - 1) * (8 + pseudoRandom(seed, v + 200) * 6);
    let path = `M ${mainPoints[0][0]} ${mainPoints[0][1] + yShift}`;
    for (let i = 1; i < mainPoints.length; i++) {
      const prev = mainPoints[i - 1];
      const curr = mainPoints[i];
      const cpx = (prev[0] + curr[0]) / 2 + (pseudoRandom(seed, i + v * 50) - 0.5) * 15;
      const cpy = (prev[1] + curr[1]) / 2 + yShift + (pseudoRandom(seed, i + v * 70) - 0.5) * 10;
      path += ` Q ${cpx} ${cpy} ${curr[0]} ${curr[1] + yShift}`;
    }
    veins.push({ path, thickness: 2 + pseudoRandom(seed, v + 300) * 2, offset: yShift });
  }

  // Branching tendrils
  const branchCount = 6 + Math.floor(pseudoRandom(seed, 500) * 4);
  for (let b = 0; b < branchCount; b++) {
    const startIdx = Math.floor(pseudoRandom(seed, b + 600) * (mainPoints.length - 2)) + 1;
    const [sx, sy] = mainPoints[startIdx];
    const direction = flip ? 1 : -1;
    const length = 20 + pseudoRandom(seed, b + 700) * 35;
    const spread = (pseudoRandom(seed, b + 800) - 0.5) * 0.8;

    const segments = 4;
    let bPath = `M ${sx} ${sy}`;
    let px = sx, py = sy;
    for (let s = 1; s <= segments; s++) {
      const frac = s / segments;
      const nx = px + (pseudoRandom(seed, b * 10 + s) - 0.3) * length * 0.4 + spread * length;
      const ny = py + direction * length * 0.3 * frac;
      const cpx = (px + nx) / 2 + (pseudoRandom(seed, b * 20 + s) - 0.5) * 8;
      const cpy = (py + ny) / 2;
      bPath += ` Q ${cpx} ${cpy} ${nx} ${ny}`;
      px = nx;
      py = ny;
    }
    veins.push({ path: bPath, thickness: 1.5 + pseudoRandom(seed, b + 900) * 1.5, offset: 0 });
  }

  return veins;
};

const SymbioteVeinDivider = ({ seed = 1, flip = false, className = "" }: SymbioteVeinDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.8]);

  const veins = useMemo(() => generateVeinPaths(seed, 1200, flip), [seed, flip]);
  const filterId = `venomGlow-${seed}`;

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ height: "80px" }}>
      <motion.svg
        viewBox="0 0 1200 100"
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{ opacity }}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id={`veinGrad-${seed}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
            <stop offset="20%" stopColor="hsl(var(--foreground))" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(var(--foreground))" stopOpacity="0.8" />
            <stop offset="80%" stopColor="hsl(var(--foreground))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Glow underlayer */}
        {veins.slice(0, 4).map((v, i) => (
          <motion.path
            key={`glow-${i}`}
            d={v.path}
            fill="none"
            stroke="hsl(var(--foreground) / 0.08)"
            strokeWidth={v.thickness * 3}
            strokeLinecap="round"
            filter={`url(#${filterId})`}
            style={{ pathLength }}
          />
        ))}

        {/* Main vein paths */}
        {veins.map((v, i) => (
          <motion.path
            key={`vein-${i}`}
            d={v.path}
            fill="none"
            stroke={i === 0 ? `url(#veinGrad-${seed})` : "hsl(var(--foreground) / 0.3)"}
            strokeWidth={v.thickness}
            strokeLinecap="round"
            style={{ pathLength }}
          />
        ))}

        {/* Highlight sheen on main vein */}
        <motion.path
          d={veins[0].path}
          fill="none"
          stroke="hsl(var(--foreground) / 0.12)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 8"
          style={{ pathLength }}
        />

        {/* Pulsing nodes at branch points */}
        {Array.from({ length: 4 + Math.floor(pseudoRandom(seed, 1000) * 3) }).map((_, i) => {
          const px = 100 + pseudoRandom(seed, i + 1100) * 1000;
          const py = (flip ? 20 : 80) + Math.sin(seed * 3 + i * 2) * 15;
          return (
            <motion.circle
              key={i}
              cx={px}
              cy={py}
              r="4"
              fill="none"
              stroke="hsl(var(--foreground) / 0.2)"
              strokeWidth="1.5"
              initial={{ scale: 0 }}
              animate={{
                scale: [0.8, 1.4, 0.8],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                delay: 0.3 + i * 0.15,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.svg>
    </div>
  );
};

export default SymbioteVeinDivider;
