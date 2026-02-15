import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * Scroll-driven day-to-night ambiance.
 * As user scrolls, CSS custom properties shift from warm/bright to cool/moody.
 */
export function useDayNightAmbiance() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(v);
  });

  useEffect(() => {
    const root = document.documentElement;

    // Interpolate between warm (0) and cool/moody (1)
    const warmBg = [0, 0, 0];         // pure black
    const coolBg = [220, 8, 2];       // deep blue-black hsl

    const warmAccent = [43, 74, 49];   // gold
    const coolAccent = [220, 60, 45];  // cool blue

    const warmMuted = [0, 0, 55];      // neutral gray
    const coolMuted = [220, 10, 40];   // blue-tinted gray

    const warmBorder = [0, 0, 14];
    const coolBorder = [220, 10, 10];

    const warmCard = [0, 0, 4];
    const coolCard = [220, 12, 3];

    const lerp = (a: number[], b: number[], t: number) =>
      a.map((v, i) => Math.round(v + (b[i] - v) * t));

    const bg = lerp(warmBg, coolBg, progress);
    const accent = lerp(warmAccent, coolAccent, progress);
    const muted = lerp(warmMuted, coolMuted, progress);
    const border = lerp(warmBorder, coolBorder, progress);
    const card = lerp(warmCard, coolCard, progress);

    root.style.setProperty("--background", `${bg[0]} ${bg[1]}% ${bg[2]}%`);
    root.style.setProperty("--ssg-gold", `${accent[0]} ${accent[1]}% ${accent[2]}%`);
    root.style.setProperty("--muted-foreground", `${muted[0]} ${muted[1]}% ${muted[2]}%`);
    root.style.setProperty("--border", `${border[0]} ${border[1]}% ${border[2]}%`);
    root.style.setProperty("--card", `${card[0]} ${card[1]}% ${card[2]}%`);

    return () => {
      // Reset on unmount
      root.style.removeProperty("--background");
      root.style.removeProperty("--ssg-gold");
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--border");
      root.style.removeProperty("--card");
    };
  }, [progress]);

  return progress;
}
