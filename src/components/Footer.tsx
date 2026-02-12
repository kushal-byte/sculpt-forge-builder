import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display text-3xl tracking-widest mb-4">SSG</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-sm">
              Superior Sculpt Gear. Premium gym wear engineered to enhance definition, power, and presence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-4">SHOP</h4>
            <div className="flex flex-col gap-2">
              <Link to="/shop?category=oversized" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-body">Oversized</Link>
              <Link to="/shop?category=compression" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-body">Compression</Link>
              <Link to="/shop" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-body">New Drops</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-4">COMPANY</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-body">About</Link>
              <span className="text-sm text-foreground/70 font-body">Contact</span>
              <span className="text-sm text-foreground/70 font-body">Size Guide</span>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="font-display text-xs tracking-[0.3em] text-muted-foreground mb-2">JOIN THE ELITE</h4>
            <p className="text-sm text-muted-foreground font-body">Get early access to new drops and exclusive offers.</p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-secondary border border-border px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground w-full md:w-64 focus:outline-none focus:border-foreground transition-colors"
            />
            <button className="bg-foreground text-background font-display text-xs tracking-[0.2em] px-6 py-3 hover:bg-foreground/90 transition-colors whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-body">© 2026 SSG – Superior Sculpt Gear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
