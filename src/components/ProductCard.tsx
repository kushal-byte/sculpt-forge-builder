import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const cardReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.95, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, "M");
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={cardReveal}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
          <motion.img
            src={isHovered ? product.hoverImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Cinematic overlay on hover */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none"
          />

          {product.badge && (
            <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] font-display tracking-[0.15em] px-3 py-1">
              {product.badge}
            </span>
          )}

          {/* Quick Add */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleQuickAdd}
            className="absolute bottom-0 left-0 right-0 bg-foreground text-background font-display text-xs tracking-[0.2em] py-3 hover:bg-foreground/90 transition-colors"
          >
            QUICK ADD
          </motion.button>
        </div>

        <motion.div
          className="mt-3 space-y-1"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.3, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-sm tracking-wider text-foreground">{product.name}</h3>
          <p className="font-body text-sm text-muted-foreground">₹{product.price}</p>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
