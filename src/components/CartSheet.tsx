import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CartSheet = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
              <h2 className="font-display text-lg tracking-widest">YOUR CART</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-foreground" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                  <ShoppingBag className="w-12 h-12" />
                  <p className="font-display tracking-widest text-sm">YOUR CART IS EMPTY</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex gap-4 py-4 border-b border-border">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover bg-secondary"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-display text-sm tracking-wider">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="text-muted-foreground hover:text-foreground">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-body">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="text-muted-foreground hover:text-foreground">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-body">${item.product.price * item.quantity}</span>
                            <button onClick={() => removeItem(item.product.id, item.size)} className="text-muted-foreground hover:text-foreground">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display tracking-widest text-sm">TOTAL</span>
                  <span className="font-display text-lg">${totalPrice}</span>
                </div>
                <button className="w-full bg-foreground text-background font-display tracking-[0.2em] py-4 text-sm hover:bg-foreground/90 transition-colors">
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSheet;
