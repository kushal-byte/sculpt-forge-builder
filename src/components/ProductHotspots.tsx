import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  label: string;
  description: string;
  animation: "stretch" | "zipper" | "breathe" | "pattern";
}

interface ProductHotspotsProps {
  hotspots: Hotspot[];
}

const animationVariants: Record<string, { initial: Record<string, any>; animate: Record<string, any> }> = {
  stretch: {
    initial: { scaleX: 1 },
    animate: {
      scaleX: [1, 1.15, 0.95, 1.05, 1],
      transition: { duration: 0.8, ease: "easeInOut" as const },
    },
  },
  zipper: {
    initial: { clipPath: "inset(0 0 100% 0)" },
    animate: {
      clipPath: [
        "inset(0 0 100% 0)",
        "inset(0 0 50% 0)",
        "inset(0 0 0% 0)",
      ],
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  },
  breathe: {
    initial: { scale: 1, opacity: 0.7 },
    animate: {
      scale: [1, 1.08, 1, 1.05, 1],
      opacity: [0.7, 1, 0.8, 1, 0.7],
      transition: { duration: 2, repeat: 2, ease: "easeInOut" as const },
    },
  },
  pattern: {
    initial: { backgroundPosition: "0% 0%" },
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      transition: { duration: 1.5, ease: "linear" as const },
    },
  },
};

const ProductHotspots = ({ hotspots }: ProductHotspotsProps) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [playingAnim, setPlayingAnim] = useState<string | null>(null);

  const handleClick = (hotspot: Hotspot) => {
    setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id);
    setPlayingAnim(hotspot.id);
    setTimeout(() => setPlayingAnim(null), 2500);
  };

  return (
    <>
      {hotspots.map((hotspot) => (
        <div key={hotspot.id}>
          {/* Pulse dot */}
          <motion.button
            onClick={() => handleClick(hotspot)}
            className="absolute z-20 w-6 h-6 -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="absolute inset-0 rounded-full bg-foreground/80 animate-ping opacity-30" />
            <span className="relative block w-full h-full rounded-full bg-foreground border-2 border-background shadow-lg" />
            <motion.span
              className="absolute -inset-2 rounded-full border border-foreground/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          {/* Tooltip */}
          <AnimatePresence>
            {activeHotspot === hotspot.id && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="absolute z-30 w-56 bg-card border border-border p-4"
                style={{
                  left: `${Math.min(hotspot.x, 65)}%`,
                  top: `${hotspot.y + 5}%`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-xs tracking-[0.15em] text-foreground">
                    {hotspot.label}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(null);
                    }}
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
                <p className="mt-2 text-xs font-body text-muted-foreground leading-relaxed">
                  {hotspot.description}
                </p>

                {/* Mini animation preview */}
                <motion.div
                  className="mt-3 h-8 bg-secondary/50 border border-border overflow-hidden"
                  {...(playingAnim === hotspot.id
                    ? animationVariants[hotspot.animation]
                    : {})}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[9px] font-display tracking-[0.2em] text-muted-foreground">
                      {hotspot.animation === "stretch" && "↔ STRETCH"}
                      {hotspot.animation === "zipper" && "↕ ZIPPER"}
                      {hotspot.animation === "breathe" && "◉ BREATHE"}
                      {hotspot.animation === "pattern" && "◫ PATTERN"}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
};

export default ProductHotspots;

// Default hotspot presets per product type
export const getProductHotspots = (product: { type: string; category: string }): Hotspot[] => {
  if (product.type === "T-Shirt" && product.category === "oversized") {
    return [
      { id: "collar", x: 50, y: 12, label: "THICK RIBBED COLLAR", description: "Double-stitched ribbed collar built to hold its structure wash after wash.", animation: "stretch" },
      { id: "shoulder", x: 28, y: 22, label: "DROP SHOULDER", description: "Exaggerated drop shoulder for that dominant oversized silhouette.", animation: "breathe" },
      { id: "fabric", x: 50, y: 55, label: "280GSM COTTON", description: "Premium heavyweight cotton that drapes beautifully with structured weight.", animation: "pattern" },
    ];
  }
  if (product.category === "compression") {
    return [
      { id: "contour", x: 45, y: 35, label: "CONTOUR STITCHING", description: "Precision stitching follows muscle lines to enhance definition.", animation: "stretch" },
      { id: "mesh", x: 60, y: 20, label: "MESH PANELS", description: "Strategic breathable mesh panels for maximum airflow during intense sessions.", animation: "breathe" },
      { id: "fabric", x: 40, y: 65, label: "PERFORMANCE FABRIC", description: "4-way stretch nylon-spandex blend for unrestricted movement.", animation: "pattern" },
    ];
  }
  // Default for hoodies
  return [
    { id: "hood", x: 50, y: 10, label: "DOUBLE-LINED HOOD", description: "Structured double-lined hood that holds shape and adds presence.", animation: "breathe" },
    { id: "pocket", x: 50, y: 55, label: "KANGAROO POCKET", description: "Deep kangaroo pocket with reinforced seams for daily use.", animation: "zipper" },
    { id: "cuff", x: 20, y: 80, label: "RIBBED CUFFS", description: "Thick ribbed cuffs with elastane for snug, lasting fit.", animation: "stretch" },
  ];
};
