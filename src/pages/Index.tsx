import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroModel from "@/assets/hero-model.png";
import ProductCard from "@/components/ProductCard";
import ParticleField from "@/components/ParticleField";
import SymbioteVeinDivider from "@/components/SymbioteVeinDivider";
import { products } from "@/data/products";
import { useDayNightAmbiance } from "@/hooks/useDayNightAmbiance";
import { useRef } from "react";

const cinematic = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  },
  item: {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
  letter: {
    hidden: { opacity: 0, y: 60 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] as const },
    }),
  },
};

const Index = () => {
  const featuredProducts = products.slice(0, 4);
  const heroRef = useRef(null);
  const collectionsRef = useRef(null);
  useDayNightAmbiance();

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroModelY = useTransform(heroProgress, [0, 1], [0, -60]);
  const heroModelScale = useTransform(heroProgress, [0, 0.5], [1, 1.05]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const { scrollYProgress: collectionsProgress } = useScroll({
    target: collectionsRef,
    offset: ["start end", "end start"],
  });
  const collectionsY = useTransform(collectionsProgress, [0, 1], [80, -40]);

  const collections = [
    { title: "Oversized Collection", link: "/shop?category=oversized" },
    { title: "Compression Line", link: "/shop?category=compression" },
    { title: "New Drops", link: "/shop" },
  ];

  const heroLine1 = "ENGINEERED TO SCULPT.";
  const heroLine2 = "BUILT TO DOMINATE.";

  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-background" />
        <ParticleField />

        {/* Depth layer — subtle moving gradient */}
        <motion.div
          style={{ y: useTransform(heroProgress, [0, 1], [0, -200]) }}
          className="absolute inset-0 opacity-20 pointer-events-none"
        >
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-ssg-gold/10 blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full bg-foreground/5 blur-[100px]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-[1400px] mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <motion.div
            style={{ y: heroTextY }}
            variants={cinematic.container}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-foreground overflow-hidden">
              <span className="block overflow-hidden">
                {heroLine1.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={cinematic.letter}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : undefined }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              <span className="block overflow-hidden text-muted-foreground">
                {heroLine2.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    custom={i + heroLine1.length}
                    variants={cinematic.letter}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : undefined }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </h1>
            <motion.p
              variants={cinematic.item}
              className="mt-6 text-foreground/70 font-body text-base md:text-lg max-w-lg leading-relaxed"
            >
              Premium gym wear designed to enhance definition, power, and presence.
            </motion.p>
            <motion.div variants={cinematic.item}>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-3 bg-foreground text-background font-display text-sm tracking-[0.25em] px-10 py-4 hover:bg-foreground/90 transition-all group"
              >
                SHOP NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: heroModelY, scale: heroModelScale }}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <img src={heroModel} alt="SSG Model" className="h-[500px] md:h-[700px] object-contain drop-shadow-2xl" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ opacity: useTransform(heroProgress, [0, 0.3], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent"
          />
        </motion.div>
      </section>

      <SymbioteVeinDivider seed={1} />

      {/* Featured Collections — cinematic stagger reveal */}
      <section ref={collectionsRef} className="max-w-[1400px] mx-auto px-6 py-24 relative">
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl tracking-wider text-center mb-16 text-foreground"
        >
          COLLECTIONS
        </motion.h2>
        <motion.div style={{ y: collectionsY }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 60, scale: 0.95, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: i * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Link to={col.link} className="group relative block overflow-hidden aspect-[3/4] bg-secondary border border-border">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-display text-2xl tracking-wider text-foreground">{col.title}</h3>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <span className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                    EXPLORE <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SymbioteVeinDivider seed={42} flip />

      {/* Brand Statement — depth parallax */}
      <section className="bg-card border-y border-border relative overflow-hidden">
        <ParticleField className="opacity-40" />
        <div className="max-w-[1400px] mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-6xl tracking-wider text-foreground mb-8">
              BUILT FOR THE ELITE
            </h2>
            <p className="font-body text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              SSG creates performance-engineered gym wear that sculpts, enhances, and elevates your physique.
              Every piece is designed for dominance inside and outside the gym.
            </p>
          </motion.div>
        </div>
      </section>

      <SymbioteVeinDivider seed={77} />

      {/* Featured Products — staggered cinematic reveal */}
      <section className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl tracking-wider text-foreground"
          >
            FEATURED
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <Link to="/shop" className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>
      <SymbioteVeinDivider seed={123} flip />

      {/* Social Proof */}
      <section className="bg-card border-y border-border py-24 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="max-w-[1400px] mx-auto px-6 text-center relative z-10"
        >
          <h2 className="font-display text-2xl md:text-3xl tracking-wider mb-6 text-foreground">#SUPERIORSCULPT</h2>
          <p className="font-body text-muted-foreground text-sm max-w-lg mx-auto">Follow us on Instagram for the latest drops, training content, and community highlights.</p>
        </motion.div>
      </section>
    </main>
  );
};

export default Index;
