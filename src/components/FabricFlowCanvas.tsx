import { useRef, useEffect } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * Canvas-based fabric flow effect that distorts an image based on scroll.
 * Applies a subtle wave displacement to create a flowing fabric illusion.
 */
const FabricFlowCanvas = ({
  imageSrc,
  className = "",
}: {
  imageSrc: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const scrollRef = useRef(0);
  const animRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    imageRef.current = img;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const draw = () => {
      if (!imageRef.current?.complete || !ctx) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);

      const time = Date.now() * 0.001;
      const scrollInfluence = scrollRef.current;

      // Amplitude of the wave increases as user scrolls through the element
      const amplitude = Math.sin(scrollInfluence * Math.PI) * 6 * dpr;

      // Draw image in horizontal slices with wave displacement
      const sliceCount = 60;
      const sliceH = h / sliceCount;

      for (let i = 0; i < sliceCount; i++) {
        const y = i * sliceH;
        const progress = i / sliceCount;

        // Wave displacement
        const wave =
          Math.sin(progress * 4 + time * 1.5 + scrollInfluence * 8) * amplitude +
          Math.sin(progress * 7 + time * 0.8) * amplitude * 0.3;

        const srcY = (i / sliceCount) * imageRef.current.naturalHeight;
        const srcH = imageRef.current.naturalHeight / sliceCount;

        ctx.drawImage(
          imageRef.current,
          0,
          srcY,
          imageRef.current.naturalWidth,
          srcH + 1,
          wave,
          y,
          w,
          sliceH + 1
        );
      }

      animRef.current = requestAnimationFrame(draw);
    };

    img.onload = () => {
      resize();
      draw();
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [imageSrc]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default FabricFlowCanvas;
