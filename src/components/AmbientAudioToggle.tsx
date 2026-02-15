import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AmbientAudioToggle = () => {
  const [playing, setPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);

  const startAmbient = () => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    // Create deep ambient drone with multiple oscillators
    const freqs = [55, 82.5, 110, 165];
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const oscGain = ctx.createGain();
      oscGain.gain.value = freq === 55 ? 0.08 : 0.03;

      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start();
      nodesRef.current.push(osc);
    });

    // Fade in
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
    setPlaying(true);
  };

  const stopAmbient = () => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1);
      setTimeout(() => {
        nodesRef.current.forEach((o) => o.stop());
        nodesRef.current = [];
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
      }, 1100);
    }
    setPlaying(false);
  };

  useEffect(() => {
    return () => {
      nodesRef.current.forEach((o) => { try { o.stop(); } catch {} });
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={playing ? stopAmbient : startAmbient}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
      >
        {playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </motion.button>
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-12 top-1/2 -translate-y-1/2 whitespace-nowrap bg-card border border-border text-foreground text-xs font-display tracking-wider px-3 py-1.5"
          >
            {playing ? "MUTE" : "AMBIENT SOUND"}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AmbientAudioToggle;
