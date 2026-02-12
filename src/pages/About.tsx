import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const About = () => {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="SSG About" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          <h1 className="font-display text-5xl md:text-7xl tracking-wider text-foreground">THE STANDARD OF SUPERIOR</h1>
        </motion.div>
      </section>

      {/* Story */}
      <section className="max-w-[800px] mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
            SSG was created for those who refuse average. Built for lifters, athletes, and disciplined individuals who demand gear that enhances physique and performance.
          </p>
          <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
            Every stitch, every fabric choice, every cut is engineered with one purpose: to sculpt your presence. We don't make clothes. We engineer armor for the elite.
          </p>
          <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
            From heavyweight oversized pieces that command attention to precision compression wear that enhances every contour — SSG bridges the gap between raw performance and uncompromising style.
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="bg-card border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-6">OUR MISSION</h2>
            <p className="font-display text-3xl md:text-5xl tracking-wider text-foreground leading-tight max-w-3xl mx-auto">
              EMPOWER ELITE PHYSIQUES THROUGH SUPERIOR ENGINEERED APPAREL
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "DISCIPLINE", desc: "Every piece is born from relentless discipline in design and engineering. No shortcuts." },
            { title: "PERFORMANCE", desc: "Fabrics and fits engineered to enhance your training and elevate your physique." },
            { title: "DOMINANCE", desc: "Gear that makes you stand out. Designed for those who refuse to blend in." },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="font-display text-xl tracking-wider text-foreground mb-4">{v.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-wider text-foreground mb-6">JOIN THE ELITE</h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-foreground text-background font-display text-sm tracking-[0.25em] px-10 py-4 hover:bg-foreground/90 transition-all group"
          >
            SHOP NOW
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
