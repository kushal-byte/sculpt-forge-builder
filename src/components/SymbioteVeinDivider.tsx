import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * SVG-based organic vein/tendril section divider.
 * Generates randomized organic patterns that animate in as user scrolls.
 */
interface SymbioteVeinDividerProps {
  seed?: number;
  flip?: boolean;
  className?: string;
}

const generateVeinPath = (seed: number, width: number, flip: boolean): string => {
  const pseudoRandom = (n: number) => {
    const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const mainY = flip ? 10 : 90;
  const controlY = flip ? 70 : 30;
  const paths: string[] = [];

  // Main flowing vein
  const points: [number, number][] = [];
  const segments = 8 + Math.floor(pseudoRandom(0) * 4);
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const yOff = pseudoRandom(i + 10) * 40 - 20;
    points.push([x, mainY + yOff]);
  }

  let mainPath = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1][0] + points[i][0]) / 2;
    const cpy = controlY + pseudoRandom(i + 20) * 30 - 15;
    mainPath += ` Q ${cpx} ${cpy} ${points[i][0]} ${points[i][1]}`;
  }
  paths.push(mainPath);

  // Branch tendrils
  const branchCount = 4 + Math.floor(pseudoRandom(100) * 5);
  for (let b = 0; b < branchCount; b++) {
    const startIdx = Math.floor(pseudoRandom(b + 50) * (points.length - 1));
    const [sx, sy] = points[startIdx];
    const branchLen = 15 + pseudoRandom(b + 70) * 25;
    const angle = (flip ? 1 : -1) * (0.3 + pseudoRandom(b + 90) * 1.2);

    const ex = sx + Math.cos(angle) * branchLen * 8;
    const ey = sy + Math.sin(angle) * branchLen;
    const cpx2 = sx + (ex - sx) * 0.5 + pseudoRandom(b + 110) * 20 - 10;
    const cpy2 = sy + (ey - sy) * 0.3;

    paths.push(`M ${sx} ${sy} Q ${cpx2} ${cpy2} ${ex} ${ey}`);

    // Sub-branches
    if (pseudoRandom(b + 130) > 0.5) {
      const subAngle = angle + (pseudoRandom(b + 140) - 0.5) * 0.8;
      const subLen = branchLen * 0.5;
      const mx = (sx + ex) / 2;
      const my = (sy + ey) / 2;
      const sex = mx + Math.cos(subAngle) * subLen * 5;
      const sey = my + Math.sin(subAngle) * subLen;
      paths.push(`M ${mx} ${my} L ${sex} ${sey}`);
    }
  }

  return paths.join(" ");
};

const SymbioteVeinDivider = ({ seed = 1, flip = false, className = "" }: SymbioteVeinDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.7]);

  const veinPath = useMemo(() => generateVeinPath(seed, 1200, flip), [seed, flip]);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ height: "80px" }}>
      <motion.svg
        viewBox="0 0 1200 100"
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{ opacity }}
      >
        {/* Main vein with animated draw */}
        <motion.path
          d={veinPath}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength }}
        />
        {/* Glow layer */}
        <motion.path
          d={veinPath}
          fill="none"
          stroke="hsl(var(--ssg-gold) / 0.15)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#veinGlow)"
          style={{ pathLength }}
        />
        {/* Pulse nodes at intersections */}
        {Array.from({ length: 3 + Math.floor(Math.sin(seed * 7) * 2 + 2) }).map((_, i) => {
          const px = (i + 1) * (1200 / (5 + i)) + Math.sin(seed + i) * 100;
          const py = 50 + Math.sin(seed * 3 + i * 2) * 25;
          return (
            <motion.circle
              key={i}
              cx={px}
              cy={py}
              r="3"
              fill="hsl(var(--ssg-gold) / 0.3)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 0.8, 0.4] }}
              transition={{
                delay: 0.5 + i * 0.2,
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          );
        })}
        <defs>
          <filter id="veinGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </motion.svg>
    </div>
  );
};

export default SymbioteVeinDivider;
