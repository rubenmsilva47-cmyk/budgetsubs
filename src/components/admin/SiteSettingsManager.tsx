import { useState, useRef, useEffect } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useProducts } from "@/context/ProductContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Image, FileText, Globe, Loader2, MessageCircle, Send, Package, Plus, Trash2, Edit2 } from "lucide-react";

interface FlowingMenuItem {
  id: string;
  name: string;
  icon_url: string;
}

interface FlowingMenuManagerProps {
  localSettings: any;
  setLocalSettings: (settings: any) => void;
  updateSetting: (key: string, value: string) => Promise<boolean>;
  uploading: string | null;
  setUploading: (type: string | null) => void;
  validateFile: (file: File, type: string) => { valid: boolean; error?: string };
  sanitizeFileName: (fileName: string) => string;
}

const FlowingMenuManager = ({
  localSettings,
  setLocalSettings,
  updateSetting,
  uploading,
  setUploading,
  validateFile,
  sanitizeFileName,
}: FlowingMenuManagerProps) => {
  const parseMenuItems = (): FlowingMenuItem[] => {
    try {
      const items = JSON.parse(localSettings.flowing_menu_items || "[]");
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  };

  const [menuItems, setMenuItems] = useState<FlowingMenuItem[]>(() => parseMenuItems());
  const [newItemName, setNewItemName] = useState("");
  const [newItemIcon, setNewItemIcon] = useState<string | null>(null);
  const newIconInputRef = useRef<HTMLInputElement>(null);
  const itemIconInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const newItemIconRef = useRef<string | null>(null);
  const newItemNameRef = useRef<string>("");

  useEffect(() => {
    newItemIconRef.current = newItemIcon;
    newItemNameRef.current = newItemName;
  }, [newItemIcon, newItemName]);

  useEffect(() => {
    setMenuItems(parseMenuItems());
  }, [localSettings.flowing_menu_items]);

  const handleIconUpload = async (itemId: string | null, file: File) => {
    const uploadKey = itemId ? `menu-icon-${itemId}` : "menu-icon-new";
    setUploading(uploadKey);

    try {
      const validation = validateFile(file, "navbar_logo");
      if (!validation.valid) {
        toast.error(validation.error || "Invalid file");
        setUploading(null);
        return;
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase() || "bin";
      const sanitizedBase = sanitizeFileName(`${uploadKey}-${Date.now()}`);
      const fileName = `${sanitizedBase}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message || "Unknown error"}`);
        setUploading(null);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      if (itemId) {
        const updated = menuItems.map(item =>
          item.id === itemId ? { ...item, icon_url: publicUrl } : item
        );
        setMenuItems(updated);
        const success = await updateSetting("flowing_menu_items", JSON.stringify(updated));
        if (success) {
          setLocalSettings({ ...localSettings, flowing_menu_items: JSON.stringify(updated) });
          toast.success("Icon updated");
        }
      } else {
        setNewItemIcon(publicUrl);
        newItemIconRef.current = publicUrl;
        toast.success("Icon uploaded! Enter a name and click Add.");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleAddItem = async () => {
    const icon = newItemIconRef.current || newItemIcon;
    const name = newItemNameRef.current || newItemName;

    if (!icon) {
      toast.error("Please upload an icon first");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    const newItem: FlowingMenuItem = {
      id: Date.now().toString(),
      name: name.trim(),
      icon_url: icon,
    };

    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    const success = await updateSetting("flowing_menu_items", JSON.stringify(updated));
    if (success) {
      setLocalSettings({ ...localSettings, flowing_menu_items: JSON.stringify(updated) });
      toast.success("Item added");
      setNewItemName("");
      setNewItemIcon(null);
      newItemIconRef.current = null;
      newItemNameRef.current = "";
      if (newIconInputRef.current) {
        newIconInputRef.current.value = "";
      }
    } else {
      toast.error("Failed to add item");
    }
  };

  const handleUpdateItem = async (itemId: string) => {
    const success = await updateSetting("flowing_menu_items", JSON.stringify(menuItems));
    if (success) {
      setLocalSettings({ ...localSettings, flowing_menu_items: JSON.stringify(menuItems) });
      toast.success("Item updated");
    }
  };

  const handleDeleteItem = async (id: string) => {
    const updated = menuItems.filter(item => item.id !== id);
    setMenuItems(updated);
    const success = await updateSetting("flowing_menu_items", JSON.stringify(updated));
    if (success) {
      setLocalSettings({ ...localSettings, flowing_menu_items: JSON.stringify(updated) });
      toast.success("Item deleted");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-card border border-border/50 flex items-center justify-center shrink-0">
                <img src={item.icon_url} alt={item.name} className="w-12 h-12 object-contain" />
              </div>
              <div className="flex-1">
                <Input
                  value={item.name}
                  onChange={(e) => {
                    const updated = menuItems.map(i =>
                      i.id === item.id ? { ...i, name: e.target.value } : i
                    );
                    setMenuItems(updated);
                  }}
                  onBlur={() => handleUpdateItem(item.id)}
                  placeholder="Item name"
                />
              </div>
              <div className="flex gap-2">
                <input
                  ref={(el) => { itemIconInputRefs.current[item.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleIconUpload(item.id, file);
                      e.target.value = "";
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => itemIconInputRefs.current[item.id]?.click()}
                  disabled={uploading === `menu-icon-${item.id}`}
                >
                  {uploading === `menu-icon-${item.id}` ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-card border border-border/50 flex items-center justify-center shrink-0">
            {(newItemIconRef.current || newItemIcon) ? (
              <img src={newItemIconRef.current || newItemIcon || ""} alt="Icon" className="w-12 h-12 object-contain" />
            ) : (
              <Image className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              value={newItemNameRef.current || newItemName}
              onChange={(e) => {
                const value = e.target.value;
                setNewItemName(value);
                newItemNameRef.current = value;
              }}
              placeholder="Item name (e.g., Netflix)"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={newIconInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleIconUpload(null, file);
                  e.target.value = "";
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => newIconInputRef.current?.click()}
              disabled={uploading === "menu-icon-new"}
              className="w-full"
            >
              {uploading === "menu-icon-new" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Icon
                </>
              )}
            </Button>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddItem}
            disabled={!(newItemIconRef.current || newItemIcon) || !(newItemNameRef.current || newItemName).trim()}
            className="w-32"
            title={!(newItemIconRef.current || newItemIcon) ? "Upload an icon first" : !(newItemNameRef.current || newItemName).trim() ? "Enter a name" : "Click to add"}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          </div>
        </div>
    </div>
  );
};

const SiteSettingsManager = () => {
  const { settings, updateSetting, refreshSettings } = useSiteSettings();
  const { products } = useProducts();
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const fileInputRefs = {
    favicon: useRef<HTMLInputElement>(null),
    navbar_logo: useRef<HTMLInputElement>(null),
    footer_logo: useRef<HTMLInputElement>(null),
    hero_logo: useRef<HTMLInputElement>(null),
  };

  const validateFile = (file: File, type: string): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: "File size must be less than 5MB" };
    }

    const allowedTypes: Record<string, string[]> = {
      favicon: ["image/x-icon", "image/png", "image/svg+xml", "image/jpeg"],
      navbar_logo: ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"],
      footer_logo: ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"],
      hero_logo: ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"],
    };

    const allowed = allowedTypes[type] || allowedTypes.navbar_logo;
    if (!allowed.includes(file.type)) {
      return { valid: false, error: "Invalid file type" };
    }

    return { valid: true };
  };

  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_")
      .toLowerCase()
      .substring(0, 100);
  };

  const handleUpload = async (type: string, file: File) => {
    setUploading(type);

    const validation = validateFile(file, type);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid file");
      setUploading(null);
      return;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "bin";
    const sanitizedBase = sanitizeFileName(`${type}-${Date.now()}`);
    const fileName = `${sanitizedBase}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed");
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("site-assets")
      .getPublicUrl(fileName);

    const settingKey = `${type}_url` as keyof typeof settings;
    const success = await updateSetting(settingKey, publicUrl);
    
    if (success) {
      setLocalSettings((prev) => ({ ...prev, [settingKey]: publicUrl }));
      toast.success("Uploaded successfully");
    } else {
      toast.error("Failed to save");
    }
    setUploading(null);
  };

  const handleSave = async (key: keyof typeof settings) => {
    setSaving(key);
    const success = await updateSetting(key, localSettings[key]);
    if (success) {
      toast.success("Saved");
    } else {
      toast.error("Failed to save");
    }
    setSaving(null);
  };


  const UploadButton = ({ type, label, accept }: { type: string; label: string; accept: string }) => (
    <div className="space-y-3">
      <Label className="text-foreground">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-12 rounded-xl bg-secondary/30 border border-border/50 flex items-center px-4">
          {settings[`${type}_url` as keyof typeof settings] ? (
            <img
              src={settings[`${type}_url` as keyof typeof settings]}
              alt={label}
              className="h-8 max-w-[120px] object-contain"
            />
          ) : (
            <span className="text-muted-foreground text-sm">No image set</span>
          )}
        </div>
        <input
          ref={fileInputRefs[type as keyof typeof fileInputRefs]}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(type, file);
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRefs[type as keyof typeof fileInputRefs].current?.click()}
          disabled={uploading === type}
        >
          {uploading === type ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">SEO Settings</h3>
            <p className="text-sm text-muted-foreground">Meta tags and search optimization</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Meta Title</Label>
            <div className="flex gap-2">
              <Input
                value={localSettings.meta_title}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[<>]/g, "");
                  setLocalSettings({ ...localSettings, meta_title: sanitized });
                }}
                placeholder="Page title for search engines"
                maxLength={200}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("meta_title")}
                disabled={saving === "meta_title"}
              >
                {saving === "meta_title" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Meta Description</Label>
            <div className="flex gap-2">
              <Textarea
                value={localSettings.meta_description}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[<>]/g, "");
                  setLocalSettings({ ...localSettings, meta_description: sanitized });
                }}
                placeholder="Brief description for search results"
                rows={2}
                className="resize-none"
                maxLength={500}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("meta_description")}
                disabled={saving === "meta_description"}
              >
                {saving === "meta_description" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Meta Keywords</Label>
            <div className="flex gap-2">
              <Input
                value={localSettings.meta_keywords}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[<>]/g, "");
                  setLocalSettings({ ...localSettings, meta_keywords: sanitized });
                }}
                placeholder="keyword1, keyword2, keyword3"
                maxLength={300}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("meta_keywords")}
                disabled={saving === "meta_keywords"}
              >
                {saving === "meta_keywords" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Image className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Branding</h3>
            <p className="text-sm text-muted-foreground">Logos and visual identity</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <UploadButton type="favicon" label="Favicon" accept=".ico,.png,.svg" />
          <UploadButton type="navbar_logo" label="Navbar Logo" accept="image/*" />
          <UploadButton type="footer_logo" label="Footer Logo" accept="image/*" />
          <UploadButton type="hero_logo" label="Hero Logo" accept="image/*" />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Flowing Menu</h3>
            <p className="text-sm text-muted-foreground">Manage icons that rotate in the flowing menu</p>
          </div>
        </div>

        <FlowingMenuManager
          key="flowing-menu-manager"
          localSettings={localSettings}
          setLocalSettings={setLocalSettings}
          updateSetting={updateSetting}
          uploading={uploading}
          setUploading={setUploading}
          validateFile={validateFile}
          sanitizeFileName={sanitizeFileName}
        />
      </div>

      <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Social Links</h3>
            <p className="text-sm text-muted-foreground">Discord and Telegram links for floating buttons</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Discord URL</Label>
            <div className="flex gap-2">
              <Input
                value={localSettings.discord_url}
                onChange={(e) => {
                  setLocalSettings({ ...localSettings, discord_url: e.target.value });
                }}
                placeholder="https://discord.gg/..."
                maxLength={500}
                type="url"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("discord_url")}
                disabled={saving === "discord_url"}
              >
                {saving === "discord_url" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Telegram URL</Label>
            <div className="flex gap-2">
              <Input
                value={localSettings.telegram_url}
                onChange={(e) => {
                  setLocalSettings({ ...localSettings, telegram_url: e.target.value });
                }}
                placeholder="https://t.me/..."
                maxLength={500}
                type="url"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("telegram_url")}
                disabled={saving === "telegram_url"}
              >
                {saving === "telegram_url" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Hero Badges</h3>
            <p className="text-sm text-muted-foreground">Edit the three trust badges displayed on the hero section</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Badge 1</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <div className="flex gap-2">
                  <Input
                    value={localSettings.badge_1_title}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, badge_1_title: e.target.value });
                    }}
                    placeholder="10,000+ Subscriptions Delivered"
                    maxLength={100}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave("badge_1_title")}
                    disabled={saving === "badge_1_title"}
                  >
                    {saving === "badge_1_title" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <div className="flex gap-2">
                  <Input
                    value={localSettings.badge_1_subtitle}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, badge_1_subtitle: e.target.value });
                    }}
                    placeholder="And counting..."
                    maxLength={100}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave("badge_1_subtitle")}
                    disabled={saving === "badge_1_subtitle"}
                  >
                    {saving === "badge_1_subtitle" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Badge 2</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <div className="flex gap-2">
                  <Input
                    value={localSettings.badge_2_title}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, badge_2_title: e.target.value });
                    }}
                    placeholder="3+ Years In Business"
                    maxLength={100}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave("badge_2_title")}
                    disabled={saving === "badge_2_title"}
                  >
                    {saving === "badge_2_title" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <div className="flex gap-2">
                  <Input
                    value={localSettings.badge_2_subtitle}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, badge_2_subtitle: e.target.value });
                    }}
                    placeholder="Trusted & Reliable"
                    maxLength={100}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave("badge_2_subtitle")}
                    disabled={saving === "badge_2_subtitle"}
                  >
                    {saving === "badge_2_subtitle" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Badge 3</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <div className="flex gap-2">
                  <Input
                    value={localSettings.badge_3_title}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, badge_3_title: e.target.value });
                    }}
                    placeholder="50,000+ Happy Customers"
                    maxLength={100}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave("badge_3_title")}
                    disabled={saving === "badge_3_title"}
                  >
                    {saving === "badge_3_title" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <div className="flex gap-2">
                  <Input
                    value={localSettings.badge_3_subtitle}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, badge_3_subtitle: e.target.value });
                    }}
                    placeholder="Worldwide"
                    maxLength={100}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave("badge_3_subtitle")}
                    disabled={saving === "badge_3_subtitle"}
                  >
                    {saving === "badge_3_subtitle" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Featured Products</h3>
            <p className="text-sm text-muted-foreground">Select the 3 products to display on the main page</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Featured Product 1</Label>
            <div className="flex gap-2">
              <Select
                value={localSettings.featured_product_1_id || "none"}
                onValueChange={(value) => {
                  setLocalSettings({ ...localSettings, featured_product_1_id: value === "none" ? "" : value });
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Random)</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("featured_product_1_id")}
                disabled={saving === "featured_product_1_id"}
              >
                {saving === "featured_product_1_id" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Featured Product 2</Label>
            <div className="flex gap-2">
              <Select
                value={localSettings.featured_product_2_id || "none"}
                onValueChange={(value) => {
                  setLocalSettings({ ...localSettings, featured_product_2_id: value === "none" ? "" : value });
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Random)</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("featured_product_2_id")}
                disabled={saving === "featured_product_2_id"}
              >
                {saving === "featured_product_2_id" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Featured Product 3</Label>
            <div className="flex gap-2">
              <Select
                value={localSettings.featured_product_3_id || "none"}
                onValueChange={(value) => {
                  setLocalSettings({ ...localSettings, featured_product_3_id: value === "none" ? "" : value });
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Random)</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("featured_product_3_id")}
                disabled={saving === "featured_product_3_id"}
              >
                {saving === "featured_product_3_id" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;