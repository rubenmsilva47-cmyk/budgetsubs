import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  favicon_url: string;
  navbar_logo_url: string;
  footer_logo_url: string;
  hero_logo_url: string;
  flowing_menu_items: string;
  discord_url: string;
  telegram_url: string;
  badge_1_title: string;
  badge_1_subtitle: string;
  badge_2_title: string;
  badge_2_subtitle: string;
  badge_3_title: string;
  badge_3_subtitle: string;
  featured_product_1_id: string;
  featured_product_2_id: string;
  featured_product_3_id: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSetting: (key: keyof SiteSettings, value: string) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  meta_title: "Premium Subscriptions at Unbeatable Prices",
  meta_description: "Get premium subscription services at the best prices.",
  meta_keywords: "subscriptions, premium, streaming, software, discount",
  favicon_url: "/favicon.ico",
  navbar_logo_url: "",
  footer_logo_url: "",
  hero_logo_url: "",
  flowing_menu_items: "[]",
  discord_url: "",
  telegram_url: "",
  badge_1_title: "10,000+ Subscriptions Delivered",
  badge_1_subtitle: "And counting...",
  badge_2_title: "3+ Years In Business",
  badge_2_subtitle: "Trusted & Reliable",
  badge_3_title: "50,000+ Happy Customers",
  badge_3_subtitle: "Worldwide",
  featured_product_1_id: "",
  featured_product_2_id: "",
  featured_product_3_id: "",
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value");

    if (!error && data) {
      const newSettings = { ...defaultSettings };
      data.forEach((row) => {
        if (row.setting_key in newSettings) {
          (newSettings as Record<string, string>)[row.setting_key] = row.setting_value || "";
        }
      });
      setSettings(newSettings);
      updateDocumentMeta(newSettings);
    }
    setLoading(false);
  };

  const updateDocumentMeta = (s: SiteSettings) => {
    const title = s.meta_title || defaultSettings.meta_title;
    const description = s.meta_description || defaultSettings.meta_description;
    const siteUrl = window.location.origin;
    const ogImage = s.hero_logo_url || s.navbar_logo_url || "";

    document.title = title;
    
    const updateOrCreateMeta = (selector: string, attribute: string, value: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        const parts = selector.match(/(\w+)="([^"]+)"/);
        if (parts) {
          meta.setAttribute(parts[1], parts[2]);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute(attribute, value);
    };

    updateOrCreateMeta('meta[name="description"]', "content", description);
    updateOrCreateMeta('meta[name="keywords"]', "content", s.meta_keywords || defaultSettings.meta_keywords);
    
    updateOrCreateMeta('meta[property="og:title"]', "content", title);
    updateOrCreateMeta('meta[property="og:description"]', "content", description);
    updateOrCreateMeta('meta[property="og:url"]', "content", siteUrl);
    if (ogImage) {
      updateOrCreateMeta('meta[property="og:image"]', "content", ogImage);
    }
    
    updateOrCreateMeta('meta[name="twitter:title"]', "content", title);
    updateOrCreateMeta('meta[name="twitter:description"]', "content", description);
    if (ogImage) {
      updateOrCreateMeta('meta[name="twitter:image"]', "content", ogImage);
    }

    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      favicon.setAttribute("type", "image/x-icon");
      document.head.appendChild(favicon);
    }
    if (s.favicon_url) {
      const timestamp = new Date().getTime();
      const urlWithCache = `${s.favicon_url}${s.favicon_url.includes("?") ? "&" : "?"}t=${timestamp}`;
      favicon.href = urlWithCache;
      const newFavicon = favicon.cloneNode(true) as HTMLLinkElement;
      favicon.parentNode?.replaceChild(newFavicon, favicon);
    }
  };

  const updateSetting = async (key: keyof SiteSettings, value: string): Promise<boolean> => {
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { 
          setting_key: key, 
          setting_value: value, 
          updated_at: new Date().toISOString() 
        },
        { onConflict: "setting_key" }
      );

    if (!error) {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      updateDocumentMeta(newSettings);
      return true;
    }
    return false;
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, updateSetting, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
};