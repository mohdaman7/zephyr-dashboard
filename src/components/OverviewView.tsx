import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Image as ImageIcon, Video, Layers, Activity, AlertTriangle, ArrowUpRight, Plus, ShieldAlert } from "lucide-react";
import type { ProjectItem, GalleryItem, VideoItem, ServiceItem } from "../types";

interface OverviewViewProps {
  projects: ProjectItem[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  services: ServiceItem[];
  isConnected: boolean;
  onNavigate: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  projects,
  gallery,
  videos,
  services,
  isConnected,
  onNavigate,
}) => {
  const isVideoMaxed = videos.length >= 3;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/20 p-8 backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Zephyr Executive Studio
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-white tracking-wide">
              Architectural Control Hub
            </h1>
            <p className="mt-2 text-neutral-400 max-w-xl text-xs sm:text-sm leading-relaxed">
              Manage portfolio projects, photo gallery showcases, video showreels, and architecture services in real-time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("projects")}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400 shadow-lg shadow-amber-500/20"
            >
              <Plus className="h-4 w-4" /> Add Project
            </button>
            <button
              onClick={() => onNavigate("gallery")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-amber-500/40"
            >
              <ImageIcon className="h-4 w-4 text-amber-400" /> Add Photo
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Projects Card */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate("projects")}
          className="cursor-pointer rounded-2xl border border-white/10 bg-neutral-900/70 p-6 backdrop-blur-md transition hover:border-amber-500/40"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
              Portfolio
            </span>
          </div>
          <div className="mt-5">
            <div className="text-3xl font-serif font-light text-white">{projects.length}</div>
            <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
              <span>Showcased Projects</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
            </div>
          </div>
        </motion.div>

        {/* Gallery Card */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate("gallery")}
          className="cursor-pointer rounded-2xl border border-white/10 bg-neutral-900/70 p-6 backdrop-blur-md transition hover:border-amber-500/40"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
              <ImageIcon className="h-6 w-6" />
            </div>
            <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
              Gallery
            </span>
          </div>
          <div className="mt-5">
            <div className="text-3xl font-serif font-light text-white">{gallery.length}</div>
            <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
              <span>Photos & Captions</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
            </div>
          </div>
        </motion.div>

        {/* Videos Card */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate("videos")}
          className="cursor-pointer rounded-2xl border border-white/10 bg-neutral-900/70 p-6 backdrop-blur-md transition hover:border-amber-500/40"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
              <Video className="h-6 w-6" />
            </div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isVideoMaxed ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              {isVideoMaxed ? "Max (3/3)" : `${videos.length}/3 Slots`}
            </span>
          </div>
          <div className="mt-5">
            <div className="text-3xl font-serif font-light text-white">{videos.length} <span className="text-sm font-sans text-neutral-500">/ 3</span></div>
            <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
              <span>Showcase Videos</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
            </div>
          </div>
        </motion.div>

        {/* System Status Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
              <Activity className="h-6 w-6" />
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isConnected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              {isConnected ? "API Live" : "Offline Cache"}
            </span>
          </div>
          <div className="mt-5">
            <div className="text-lg font-medium text-white">{isConnected ? "Express Backend Sync" : "Standalone Cache"}</div>
            <div className="mt-1 text-xs text-neutral-400">
              {isConnected ? "Port 5000 connected" : "Changes saved in local state"}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Queue Status & FIFO Rule Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-neutral-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl text-white">Active Video Showcase Queue</h3>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Strict Max 3 FIFO Enforced
            </span>
          </div>

          <div className="space-y-3">
            {videos.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs">No videos currently added.</div>
            ) : (
              videos.map((vid, idx) => (
                <div
                  key={vid.id || idx}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-neutral-950/60 p-4 transition hover:border-amber-500/30"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 font-serif text-sm font-semibold text-amber-400">
                      0{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{vid.title}</h4>
                      <p className="text-xs text-neutral-400 truncate max-w-md">{vid.description || vid.src}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[11px] font-mono text-neutral-500">
                    {idx === 0 ? "(Oldest Queue)" : idx === 2 ? "(Latest Added)" : "Active Slot"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FIFO Notice Box */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-3">
              <ShieldAlert className="h-4 w-4" /> Video Queue Policy
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              To preserve website speed and aesthetic curation, the video gallery strictly holds a <strong className="text-amber-300">maximum of 3 videos</strong>.
            </p>
            <ul className="text-xs text-neutral-400 space-y-2 list-disc list-inside">
              <li>When uploading a 4th video, the system automatically removes the oldest video (FIFO strategy).</li>
              <li>Supports direct MP4 video upload or streaming MP4 URL links.</li>
              <li>Changes instantly sync to the main website gallery.</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate("videos")}
            className="mt-6 w-full rounded-xl border border-amber-500/40 bg-amber-500/10 py-2.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500 hover:text-neutral-950"
          >
            Manage Videos &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
