import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
          <img
            src={isHovered ? product.hoverImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
            transition={{ duration: 0.2 }}
            onClick={handleQuickAdd}
            className="absolute bottom-0 left-0 right-0 bg-foreground text-background font-display text-xs tracking-[0.2em] py-3 hover:bg-foreground/90 transition-colors"
          >
            QUICK ADD
          </motion.button>
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="font-display text-sm tracking-wider text-foreground">{product.name}</h3>
          <p className="font-body text-sm text-muted-foreground">₹{product.price}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
