import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [category, setCategory] = useState(initialCategory);
  const [fit, setFit] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (fit !== "all" && p.fit.toLowerCase() !== fit) return false;
      return true;
    });
  }, [category, fit]);

  const categories = [
    { value: "all", label: "All" },
    { value: "oversized", label: "Oversized" },
    { value: "compression", label: "Compression" },
  ];

  const fits = [
    { value: "all", label: "All Fits" },
    { value: "relaxed", label: "Relaxed" },
    { value: "oversized", label: "Oversized" },
    { value: "tight", label: "Tight" },
  ];

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="py-12 md:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl tracking-wider text-foreground"
          >
            SHOP
          </motion.h1>
          <p className="mt-3 text-muted-foreground font-body text-sm">{filtered.length} Products</p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
          <div className="hidden md:flex items-center gap-6">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`font-display text-xs tracking-[0.2em] uppercase transition-colors ${
                  category === c.value ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
            <span className="w-px h-4 bg-border" />
            {fits.map((f) => (
              <button
                key={f.value}
                onClick={() => setFit(f.value)}
                className={`font-display text-xs tracking-[0.2em] uppercase transition-colors ${
                  fit === f.value ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 font-display text-xs tracking-[0.2em] text-foreground"
          >
            <SlidersHorizontal className="w-4 h-4" />
            FILTERS
          </button>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-b border-border pb-6 mb-8 space-y-4"
          >
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-3">CATEGORY</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`px-4 py-2 text-xs font-display tracking-wider border transition-colors ${
                      category === c.value
                        ? "border-foreground text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-3">FIT</p>
              <div className="flex flex-wrap gap-2">
                {fits.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFit(f.value)}
                    className={`px-4 py-2 text-xs font-display tracking-wider border transition-colors ${
                      fit === f.value
                        ? "border-foreground text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Active filters */}
        {(category !== "all" || fit !== "all") && (
          <div className="flex items-center gap-2 mb-6">
            {category !== "all" && (
              <button
                onClick={() => setCategory("all")}
                className="flex items-center gap-1 px-3 py-1 border border-border text-xs font-display tracking-wider text-foreground"
              >
                {category} <X className="w-3 h-3" />
              </button>
            )}
            {fit !== "all" && (
              <button
                onClick={() => setFit("all")}
                className="flex items-center gap-1 px-3 py-1 border border-border text-xs font-display tracking-wider text-foreground"
              >
                {fit} <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-24">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Shop;
