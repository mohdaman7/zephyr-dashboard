import React from "react";
import { LayoutDashboard, Briefcase, Image as ImageIcon, Video, Layers, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import type { ProjectItem, GalleryItem, VideoItem, ServiceItem } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: ProjectItem[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  services: ServiceItem[];
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  projects,
  gallery,
  videos,
  services,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects Portfolio", icon: Briefcase, badge: `${projects.length}` },
    { id: "gallery", label: "Gallery Showcase", icon: ImageIcon, badge: `${gallery.length}` },
    { id: "videos", label: "Video Showcase", icon: Video, badge: `${videos.length}/3` },
    { id: "services", label: "Services Catalog", icon: Layers, badge: `${services.length}` },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#101012] border-r border-white/10 flex flex-col justify-between p-5 transition-transform duration-300 lg:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 font-serif text-xl font-bold text-neutral-950 shadow-lg shadow-amber-500/20">
            Z
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-normal tracking-wider text-white">ZEPHYR</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
              Executive Studio
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Navigation Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber-500 text-neutral-950 font-semibold shadow-lg shadow-amber-500/20"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-neutral-950" : "text-amber-400/70"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                      isActive
                        ? "bg-neutral-950/20 text-neutral-950"
                        : "bg-white/5 text-neutral-400 border border-white/10"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Notice & Launcher */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-neutral-300">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
            <ShieldCheck className="h-4 w-4" /> Max 3 Videos FIFO Queue
          </div>
          Adding a 4th video automatically replaces the oldest showcase video.
        </div>

        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full rounded-xl border border-white/10 bg-neutral-900 px-3.5 py-2.5 text-xs text-neutral-300 hover:text-amber-400 hover:border-amber-500/30 transition"
        >
          <span>View Public Website</span>
          <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
        </a>
      </div>
    </aside>
  );
};
