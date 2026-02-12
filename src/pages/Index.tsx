import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroModel from "@/assets/hero-model.png";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const Index = () => {
  const featuredProducts = products.slice(0, 4);

  const collections = [
    { title: "Oversized Collection", link: "/shop?category=oversized" },
    { title: "Compression Line", link: "/shop?category=compression" },
    { title: "New Drops", link: "/shop" },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-foreground">
              ENGINEERED TO SCULPT.<br />
              <span className="text-muted-foreground">BUILT TO DOMINATE.</span>
            </h1>
            <p className="mt-6 text-foreground/70 font-body text-base md:text-lg max-w-lg leading-relaxed">
              Premium gym wear designed to enhance definition, power, and presence.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-3 bg-foreground text-background font-display text-sm tracking-[0.25em] px-10 py-4 hover:bg-foreground/90 transition-all group"
            >
              SHOP NOW
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex-shrink-0"
          >
            <img src={heroModel} alt="SSG Model" className="h-[500px] md:h-[700px] object-contain" />
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="max-w-[1400px] mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl tracking-wider text-center mb-16 text-foreground"
        >
          COLLECTIONS
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <Link to={col.link} className="group relative block overflow-hidden aspect-[3/4] bg-secondary border border-border">
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
        </div>
      </section>

      {/* Brand Statement */}
      <section className="bg-card border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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

      {/* Featured Products */}
      <section className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-2xl md:text-3xl tracking-wider text-foreground">FEATURED</h2>
          <Link to="/shop" className="font-display text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            VIEW ALL <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-card border-y border-border py-24">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl tracking-wider mb-6 text-foreground">#SUPERIORSCULPT</h2>
          <p className="font-body text-muted-foreground text-sm max-w-lg mx-auto">Follow us on Instagram for the latest drops, training content, and community highlights.</p>
        </div>
      </section>
    </main>
  );
};

export default Index;
