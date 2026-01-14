import { Link } from "react-router-dom";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const Footer = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="py-8 sm:py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link to="/" className="flex items-center gap-2">
            {settings.footer_logo_url ? (
              <img src={settings.footer_logo_url} alt="Logo" className="h-8 max-w-[140px] object-contain" />
            ) : (
              <span className="text-xl font-bold text-foreground">BudgetSubs</span>
            )}
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="/#products"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </a>
            <a
              href="/#how"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </a>
            <a
              href="/#faq"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </a>
          </nav>

          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} BudgetSubs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;