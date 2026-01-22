import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const Contact = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.key]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Contact</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="text-foreground">Get in</span>{" "}
              <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Have questions or need support? Reach out through any of these channels.
            </p>
          </div>

          <div className="max-w-xl mx-auto space-y-4">
            <a
              href={settings.discord_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20"
            >
              <div className="w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center shadow-lg shadow-[#5865F2]/20">
                <DiscordIcon />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground">Discord Server</p>
                <p className="text-sm text-muted-foreground">Join our community</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            <a
              href={settings.telegram_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0088cc] flex items-center justify-center shadow-lg shadow-[#0088cc]/20">
                <TelegramIcon />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground">Telegram Channel</p>
                <p className="text-sm text-muted-foreground">Updates & announcements</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            <a
              href={settings.telegram_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0088cc] flex items-center justify-center shadow-lg shadow-[#0088cc]/20">
                <TelegramIcon />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground">Telegram Support</p>
                <p className="text-sm text-muted-foreground">Direct message for help</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>

          <div className="max-w-xl mx-auto mt-12 p-5 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/5 text-center">
            <p className="text-muted-foreground text-sm">
              We typically respond within a few hours. Join our Discord for the fastest support!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
