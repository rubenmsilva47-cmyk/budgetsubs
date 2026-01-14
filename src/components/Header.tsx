import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSiteSettings();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "How it Works", path: "/#how" },
    { name: "FAQ", path: "/#faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {settings.navbar_logo_url ? (
            <img src={settings.navbar_logo_url} alt="Logo" className="h-8 max-w-[140px] object-contain" />
          ) : (
            <span className="text-xl font-bold text-foreground">Example</span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <Button variant="hero" size="sm" asChild className="hidden md:inline-flex">
          <Link to="/products">Products</Link>
        </Button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/30">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors font-medium py-2 text-lg"
              >
                {link.name}
              </a>
            ))}
            <Button variant="hero" size="lg" asChild className="mt-4 w-full">
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                Browse Products
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;