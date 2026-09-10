import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Image as ImageIcon,
  Video,
  Layers,
  ExternalLink,
  ShieldCheck,
  Zap,
  ChevronRight,
} from "lucide-react";
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
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #050B18 0%, #080F1F 50%, #050B18 100%)",
          borderRight: "1px solid rgba(59, 130, 246, 0.12)",
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)" }}
        />

        <div className="flex flex-col h-full p-5 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1 py-3 mb-6">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white text-lg shadow-lg relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)",
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
              }}
            >
              <span className="relative z-10" style={{ fontFamily: "'DM Serif Display', serif" }}>Z</span>
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 30%, white, transparent)" }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-white text-lg font-semibold tracking-widest"
                  style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "0.15em" }}
                >
                  ZEPHYR
                </span>
                <Zap className="h-3.5 w-3.5" style={{ color: "#60A5FA" }} />
              </div>
              <span
                className="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: "rgba(96, 165, 250, 0.7)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                Executive Studio
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            <div
              className="px-3 py-2 text-[10px] uppercase tracking-widest font-semibold mb-2"
              style={{ color: "rgba(148, 163, 184, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Navigation
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
                  className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 group relative overflow-hidden"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(59, 130, 246, 0.15) 100%)",
                          border: "1px solid rgba(59, 130, 246, 0.35)",
                          color: "#93C5FD",
                        }
                      : {
                          background: "transparent",
                          border: "1px solid transparent",
                          color: "rgba(148, 163, 184, 0.7)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.06)";
                      (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.12)";
                      (e.currentTarget as HTMLElement).style.color = "#E8F0FE";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.border = "1px solid transparent";
                      (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)";
                    }
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                      style={{ background: "linear-gradient(180deg, #60A5FA, #2563EB)" }}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon
                      className="h-4 w-4 shrink-0"
                      style={{ color: isActive ? "#60A5FA" : "rgba(100, 116, 139, 0.8)" }}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold"
                        style={
                          isActive
                            ? { background: "rgba(59, 130, 246, 0.25)", color: "#93C5FD" }
                            : { background: "rgba(30, 41, 59, 0.8)", color: "rgba(148, 163, 184, 0.6)", border: "1px solid rgba(51, 65, 85, 0.5)" }
                        }
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="h-3 w-3" style={{ color: "#60A5FA" }} />}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="space-y-3 pt-5 mt-5" style={{ borderTop: "1px solid rgba(59, 130, 246, 0.1)" }}>
            <div
              className="rounded-xl p-3.5 text-[11px]"
              style={{
                background: "rgba(37, 99, 235, 0.06)",
                border: "1px solid rgba(59, 130, 246, 0.15)",
                color: "rgba(148, 163, 184, 0.8)",
              }}
            >
              <div
                className="flex items-center gap-1.5 font-semibold mb-1.5"
                style={{ color: "#60A5FA" }}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Max 3 Videos FIFO Queue
              </div>
              <span style={{ color: "rgba(148, 163, 184, 0.7)", fontSize: "10px", lineHeight: "1.5" }}>
                Adding a 4th video automatically replaces the oldest showcase video.
              </span>
            </div>

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200"
              style={{
                background: "rgba(13, 22, 39, 0.6)",
                border: "1px solid rgba(51, 65, 85, 0.4)",
                color: "rgba(148, 163, 184, 0.7)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.3)";
                (e.currentTarget as HTMLElement).style.color = "#93C5FD";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(51, 65, 85, 0.4)";
                (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)";
              }}
            >
              <span>View Public Website</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
