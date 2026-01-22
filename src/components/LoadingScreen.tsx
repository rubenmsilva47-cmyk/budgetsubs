import { useEffect, useState } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!settingsLoading && progress >= 100 && (imageLoaded || !settings.navbar_logo_url)) {
      setFadeOut(true);
      const timeout = setTimeout(() => {
        onLoadComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [settingsLoading, progress, imageLoaded, settings.navbar_logo_url, onLoadComplete]);

  useEffect(() => {
    if (settings.navbar_logo_url) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true);
      img.src = settings.navbar_logo_url;
    }
  }, [settings.navbar_logo_url]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        {settings.navbar_logo_url ? (
          <img
            src={settings.navbar_logo_url}
            alt="Logo"
            className="h-12 max-w-[180px] object-contain animate-pulse"
          />
        ) : (
          <div className="h-12 w-[180px]" />
        )}

        <div className="w-48 h-1 bg-secondary/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
