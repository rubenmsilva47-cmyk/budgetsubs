import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Calendar, Users } from "lucide-react";
import DarkVeil from "./DarkVeil";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const Hero = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="relative min-h-screen flex items-center pt-24 sm:pt-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DarkVeil speed={0.2} hueShift={15} warpAmount={0.2} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div
              className="space-y-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-foreground">Stop Overpaying</span>
                <br />
                <span className="text-primary">for Subscriptions</span>
              </h1>
            </div>

            <p
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 opacity-0 animate-fade-in-up leading-relaxed"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              Save up to 80% on premium subscriptions. Spotify, Apple Music, YouTube Premium and more.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <a href="/products" className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 text-sm font-medium rounded-full bg-white text-black hover:bg-white/90 transition-colors shadow-lg shadow-white/10">
                Browse Subscriptions
              </a>
              <a href="/#how" className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 text-sm font-medium rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors">
                How it Works
              </a>
            </div>

            <div
              className="flex flex-wrap gap-6 justify-center lg:justify-start opacity-0 animate-fade-in-up pt-4"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center">
                  <Package className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{settings.badge_1_title || "10,000+"}</p>
                  <p className="text-xs text-muted-foreground">{settings.badge_1_subtitle || "Delivered"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{settings.badge_2_title || "3+ Years"}</p>
                  <p className="text-xs text-muted-foreground">{settings.badge_2_subtitle || "In Business"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{settings.badge_3_title || "50,000+"}</p>
                  <p className="text-xs text-muted-foreground">{settings.badge_3_subtitle || "Customers"}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative flex justify-center lg:justify-end opacity-0 animate-fade-in-up order-first lg:order-last"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            <div className="relative">
              {settings.hero_logo_url ? (
                <img
                  src={settings.hero_logo_url}
                  alt="Hero"
                  className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl shadow-2xl shadow-black/30"
                />
              ) : (
                <img
                  alt="Premium subscriptions"
                  className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl shadow-2xl shadow-black/30"
                  src="/hero-image.png"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;