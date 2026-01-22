import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, loading } = useSiteSettings();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "How it Works", path: "/#how" },
    { name: "FAQ", path: "/#faq" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-3xl px-5 py-2.5 flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-xl shadow-black/20">
        <Link to="/" className="flex items-center gap-3 h-8">
          {loading ? (
            <div className="h-8 w-[100px]" />
          ) : settings.navbar_logo_url ? (
            <img src={settings.navbar_logo_url} alt="Logo" className="h-7 max-w-[120px] object-contain" />
          ) : null}
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <a href="/products" className="hidden md:inline-flex px-4 py-1.5 text-sm font-medium rounded-full bg-white text-black hover:bg-white/90 transition-colors">
          Products
        </a>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground hover:bg-secondary/50 rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/30 overflow-hidden">
          <nav className="p-3 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a href="/products" className="mt-1 w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-white text-black hover:bg-white/90 transition-colors">
              Browse Products
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;