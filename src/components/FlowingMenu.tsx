import React, { useMemo } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface FlowingMenuItem {
  id: string;
  name: string;
  icon_url: string;
}

function FlowingMenu() {
  const { settings } = useSiteSettings();

  const items = useMemo(() => {
    if (!settings.flowing_menu_items || !settings.flowing_menu_items.trim()) {
      return [];
    }

    try {
      const parsed = JSON.parse(settings.flowing_menu_items) as FlowingMenuItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }, [settings.flowing_menu_items]);

  if (items.length === 0) {
    return null;
  }

  const marqueeContent = items.map((item, idx) => (
    <div
      key={item.id || idx}
      className="flex items-center justify-center shrink-0 mx-4 md:mx-6"
    >
      <div className="group relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
        <img
          src={item.icon_url}
          alt={item.name}
          className="w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  ));

  return (
    <div className="w-full overflow-hidden py-8 md:py-12 relative">
      <div className="flex items-center animate-marquee whitespace-nowrap">
        <div className="flex items-center shrink-0">
          {marqueeContent}
        </div>
        <div className="flex items-center shrink-0">
          {marqueeContent}
        </div>
        <div className="flex items-center shrink-0">
          {marqueeContent}
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;
