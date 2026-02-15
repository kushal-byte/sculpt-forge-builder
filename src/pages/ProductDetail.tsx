import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import ProductHotspots, { getProductHotspots } from "@/components/ProductHotspots";
import FabricFlowCanvas from "@/components/FabricFlowCanvas";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [showFlow, setShowFlow] = useState(false);

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-display tracking-widest">PRODUCT NOT FOUND</p>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const hotspots = getProductHotspots(product);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Breadcrumb */}
        <div className="py-6">
          <Link to="/shop" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-display text-xs tracking-[0.2em]">
            <ArrowLeft className="w-4 h-4" /> BACK TO SHOP
          </Link>
        </div>

        {/* Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-24">
          {/* Image with hotspots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-[3/4] overflow-hidden bg-secondary"
          >
            {/* Main product image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />

            {/* Interactive hotspots overlay */}
            <ProductHotspots hotspots={hotspots} />

            {/* Fabric flow toggle */}
            <button
              onClick={() => setShowFlow(!showFlow)}
              className="absolute top-3 right-3 z-20 bg-card/80 backdrop-blur-sm border border-border px-3 py-1.5 font-display text-[10px] tracking-[0.15em] text-foreground hover:bg-card transition-colors"
            >
              {showFlow ? "HIDE FLOW" : "FABRIC FLOW"}
            </button>

            {/* Fabric flow canvas overlay */}
            {showFlow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-10"
              >
                <FabricFlowCanvas
                  imageSrc={product.image}
                  className="w-full h-full"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {product.badge && (
              <span className="inline-block mb-4 text-[10px] font-display tracking-[0.2em] text-ssg-gold">{product.badge}</span>
            )}
            <h1 className="font-display text-3xl md:text-4xl tracking-wider text-foreground">{product.name}</h1>
            <p className="mt-3 font-display text-2xl text-foreground">₹{product.price}</p>

            <p className="mt-6 font-body text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Hotspot hint */}
            <p className="mt-2 text-[10px] font-display tracking-[0.15em] text-ssg-gold/70">
              ● TAP HOTSPOTS ON IMAGE TO EXPLORE FEATURES
            </p>

            {/* Size Selector */}
            <div className="mt-8">
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-3">SIZE</p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border font-display text-sm tracking-wider transition-colors ${
                      selectedSize === size
                        ? "border-foreground text-foreground bg-foreground/10"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mt-6">
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-3">COLORS</p>
              <p className="text-sm font-body text-foreground">{product.colors.join(", ")}</p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`mt-8 w-full font-display text-sm tracking-[0.25em] py-4 transition-all ${
                !selectedSize
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : added
                  ? "bg-green-900 text-foreground"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {added ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> ADDED TO CART
                </span>
              ) : !selectedSize ? (
                "SELECT A SIZE"
              ) : (
                "ADD TO CART"
              )}
            </button>

            {/* Features */}
            <div className="mt-10 border-t border-border pt-8">
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">FEATURES</p>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-body text-foreground/80">
                    <span className="mt-1.5 w-1 h-1 bg-foreground/40 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fabric */}
            <div className="mt-8 border-t border-border pt-8">
              <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">FABRIC TECHNOLOGY</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-body">Material</p>
                  <p className="text-sm font-body text-foreground mt-1">{product.fabric.material}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body">Breathability</p>
                  <p className="text-sm font-body text-foreground mt-1">{product.fabric.breathability}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body">Stretch</p>
                  <p className="text-sm font-body text-foreground mt-1">{product.fabric.stretch}</p>
                </div>
                {product.fabric.compression && (
                  <div>
                    <p className="text-xs text-muted-foreground font-body">Compression</p>
                    <p className="text-sm font-body text-foreground mt-1">{product.fabric.compression}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border py-24">
            <h2 className="font-display text-2xl tracking-wider text-foreground mb-12">PAIRS WELL WITH</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
