import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Calendar, Users } from "lucide-react";
import DarkVeil from "./DarkVeil";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const Hero = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="relative min-h-screen flex items-center pt-16 sm:pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DarkVeil speed={0.3} hueShift={25} warpAmount={0.3} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-primary/10 rounded-full blur-[60px] sm:blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div
              className="space-y-2 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient">Stop Overpaying</span>
                <br />
                <span className="text-foreground">for Subscriptions</span>
              </h1>
            </div>

            <p
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              Save up to 80% on subscriptions like Spotify Premium, Apple Music or YouTube Premium.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <Button variant="hero" size="lg" asChild className="w-full sm:w-auto">
                <Link to="/products">Browse Subscriptions</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild className="w-full sm:w-auto">
                <a href="/#how">What is BudgetSubs?</a>
              </Button>
            </div>

            <div
              className="flex flex-col gap-3 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <div className="group inline-flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-secondary/60 to-secondary/40 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-sm sm:text-base font-semibold text-foreground">{settings.badge_1_title || "10,000+ Subscriptions Delivered"}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{settings.badge_1_subtitle || "And counting..."}</span>
                </div>
              </div>
              <div className="group inline-flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-secondary/60 to-secondary/40 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-sm sm:text-base font-semibold text-foreground">{settings.badge_2_title || "3+ Years In Business"}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{settings.badge_2_subtitle || "Trusted & Reliable"}</span>
                </div>
              </div>
              <div className="group inline-flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-secondary/60 to-secondary/40 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-sm sm:text-base font-semibold text-foreground">{settings.badge_3_title || "50,000+ Happy Customers"}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{settings.badge_3_subtitle || "Worldwide"}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative flex justify-center lg:justify-end opacity-0 animate-fade-in-up order-first lg:order-last"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl animate-pulse" />
              {settings.hero_logo_url ? (
                <img
                  src={settings.hero_logo_url}
                  alt="Hero"
                  className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg animate-float rounded-2xl shadow-2xl shadow-primary/20"
                />
              ) : (
                <img
                  alt="Premium subscriptions"
                  className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg animate-float rounded-2xl shadow-2xl shadow-primary/20"
                  src="/hero-image.png"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-fade-in-up hidden sm:block"
        style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
      />
    </section>
  );
};

export default Hero;