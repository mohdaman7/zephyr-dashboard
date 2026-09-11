import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Image as ImageIcon,
  Video,
  Activity,
  ArrowUpRight,
  Plus,
  ShieldAlert,
} from "lucide-react";
import type { ProjectItem, GalleryItem, VideoItem, ServiceItem } from "../types";

interface OverviewViewProps {
  projects: ProjectItem[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  services: ServiceItem[];
  isConnected: boolean;
  onNavigate: (tab: string) => void;
}

const cardStyle = {
  background: "rgba(8, 15, 31, 0.7)",
  border: "1px solid rgba(59, 130, 246, 0.1)",
  backdropFilter: "blur(12px)",
};

const hoverCardStyle = {
  background: "rgba(13, 22, 39, 0.8)",
  border: "1px solid rgba(59, 130, 246, 0.25)",
  backdropFilter: "blur(12px)",
};

export const OverviewView: React.FC<OverviewViewProps> = ({
  projects,
  gallery,
  videos,
  isConnected,
  onNavigate,
}) => {
  const isVideoMaxed = videos.length >= 3;

  const statCards = [
    {
      id: "projects",
      icon: Briefcase,
      label: "Showcased Projects",
      tag: "Portfolio",
      value: projects.length,
      iconColor: "#60A5FA",
      iconBg: "rgba(59, 130, 246, 0.1)",
      iconBorder: "rgba(59, 130, 246, 0.2)",
    },
    {
      id: "gallery",
      icon: ImageIcon,
      label: "Photos & Captions",
      tag: "Gallery",
      value: gallery.length,
      iconColor: "#818CF8",
      iconBg: "rgba(99, 102, 241, 0.1)",
      iconBorder: "rgba(99, 102, 241, 0.2)",
    },
    {
      id: "videos",
      icon: Video,
      label: "Showcase Videos",
      tag: isVideoMaxed ? "Max (3/3)" : `${videos.length}/3 Slots`,
      value: videos.length,
      valueExtra: "/ 3",
      iconColor: "#34D399",
      iconBg: "rgba(16, 185, 129, 0.1)",
      iconBorder: "rgba(16, 185, 129, 0.2)",
      tagColor: isVideoMaxed ? "#FCD34D" : "#34D399",
      tagBg: isVideoMaxed ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
      tagBorder: isVideoMaxed ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)",
    },
    {
      id: "status",
      icon: Activity,
      label: isConnected ? "Port 5000 connected" : "Changes in local state",
      tag: isConnected ? "API Live" : "Offline Cache",
      value: null,
      valueText: isConnected ? "Express Sync" : "Standalone Cache",
      iconColor: isConnected ? "#34D399" : "#F59E0B",
      iconBg: isConnected ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
      iconBorder: isConnected ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl p-8"
        style={{
          background: "linear-gradient(135deg, rgba(8, 15, 31, 0.9) 0%, rgba(13, 30, 60, 0.8) 50%, rgba(8, 15, 31, 0.9) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.18)",
        }}
      >
        {/* Decorative glows */}
        <div
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute left-1/3 -bottom-20 h-48 w-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }}
        />

        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-4"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                color: "#93C5FD",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "#3B82F6" }}
              />
              Zephyr Executive Studio
            </div>
            <h1
              className="text-3xl md:text-4xl font-normal text-white tracking-wide"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Architectural Control Hub
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed" style={{ color: "rgba(148, 163, 184, 0.8)" }}>
              Manage portfolio projects, photo gallery showcases, video showreels, and architecture services in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("projects")}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 25px rgba(59, 130, 246, 0.45)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(59, 130, 246, 0.3)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <Plus className="h-4 w-4" /> Add Project
            </button>
            <button
              onClick={() => onNavigate("gallery")}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200"
              style={{
                background: "rgba(8, 15, 31, 0.6)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                color: "#93C5FD",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.45)";
                (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.2)";
                (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.6)";
              }}
            >
              <ImageIcon className="h-4 w-4" /> Add Photo
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const isClickable = card.id !== "status";
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => isClickable && onNavigate(card.id)}
              className="rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
              style={{
                ...cardStyle,
                cursor: isClickable ? "pointer" : "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = hoverCardStyle.background;
                (e.currentTarget as HTMLElement).style.border = hoverCardStyle.border;
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(59, 130, 246, 0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = cardStyle.background;
                (e.currentTarget as HTMLElement).style.border = cardStyle.border;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)" }}
              />

              <div className="flex items-center justify-between">
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: card.iconBg,
                    border: `1px solid ${card.iconBorder}`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: card.iconColor }} />
                </div>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: card.tagBg || "rgba(30, 41, 59, 0.6)",
                    border: `1px solid ${card.tagBorder || "rgba(51, 65, 85, 0.5)"}`,
                    color: card.tagColor || "rgba(148, 163, 184, 0.8)",
                  }}
                >
                  {card.tag}
                </span>
              </div>

              <div className="mt-5">
                {card.value !== null && card.value !== undefined ? (
                  <div
                    className="text-4xl font-light text-white"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    {card.value}
                    {card.valueExtra && (
                      <span className="text-sm ml-1" style={{ color: "rgba(100, 116, 139, 0.7)", fontFamily: "Inter, sans-serif" }}>
                        {card.valueExtra}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-lg font-medium text-white">{card.valueText}</div>
                )}
                <div className="mt-1.5 flex items-center justify-between text-xs" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
                  <span>{card.label}</span>
                  {isClickable && <ArrowUpRight className="h-3.5 w-3.5" style={{ color: "#3B82F6" }} />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Video Queue & FIFO Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-xl text-white"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Active Video Showcase Queue
            </h3>
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                color: "#93C5FD",
              }}
            >
              Strict Max 3 FIFO Enforced
            </span>
          </div>

          <div className="space-y-3">
            {videos.length === 0 ? (
              <div
                className="text-center py-10 text-xs rounded-xl"
                style={{ color: "rgba(100, 116, 139, 0.7)", background: "rgba(8, 15, 31, 0.5)", border: "1px dashed rgba(59, 130, 246, 0.1)" }}
              >
                No videos currently added.
              </div>
            ) : (
              videos.map((vid, idx) => (
                <div
                  key={vid.id || idx}
                  className="flex items-center justify-between gap-4 rounded-xl p-4 transition-all duration-200"
                  style={{
                    background: "rgba(5, 11, 24, 0.7)",
                    border: "1px solid rgba(59, 130, 246, 0.08)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.22)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.08)";
                  }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-semibold"
                      style={{
                        background: "rgba(59, 130, 246, 0.12)",
                        border: "1px solid rgba(59, 130, 246, 0.25)",
                        color: "#60A5FA",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      0{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{vid.title}</h4>
                      <p className="text-xs truncate max-w-md" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
                        {vid.description || vid.src}
                      </p>
                    </div>
                  </div>
                  <span
                    className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: idx === 0 ? "rgba(245, 158, 11, 0.1)" : "rgba(59, 130, 246, 0.08)",
                      color: idx === 0 ? "#FCD34D" : "rgba(100, 116, 139, 0.7)",
                      border: idx === 0 ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid rgba(59, 130, 246, 0.1)",
                    }}
                  >
                    {idx === 0 ? "Oldest" : idx === 2 ? "Latest" : "Active"}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* FIFO Policy Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl p-6 flex flex-col justify-between"
          style={{
            background: "rgba(8, 15, 31, 0.7)",
            border: "1px solid rgba(245, 158, 11, 0.15)",
          }}
        >
          <div>
            <div
              className="flex items-center gap-2 font-semibold text-sm mb-3"
              style={{ color: "#FCD34D" }}
            >
              <ShieldAlert className="h-4 w-4" /> Video Queue Policy
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(148, 163, 184, 0.75)" }}>
              To preserve website speed and aesthetic curation, the video gallery strictly holds a{" "}
              <strong style={{ color: "#FCD34D" }}>maximum of 3 videos</strong>.
            </p>
            <ul className="text-xs space-y-2.5" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
              {[
                "When uploading a 4th video, the system automatically removes the oldest video (FIFO strategy).",
                "Supports direct MP4 video upload or streaming MP4 URL links.",
                "Changes instantly sync to the main website gallery.",
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "rgba(245, 158, 11, 0.5)" }} />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onNavigate("videos")}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition-all duration-200"
            style={{
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              color: "#FCD34D",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(245, 158, 11, 0.15)";
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(245, 158, 11, 0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(245, 158, 11, 0.08)";
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(245, 158, 11, 0.25)";
            }}
          >
            Manage Videos →
          </button>
        </motion.div>
      </div>
    </div>
  );
};
