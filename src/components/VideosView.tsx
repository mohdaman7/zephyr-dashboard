import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Plus, Trash2, Edit3, Upload, Link as LinkIcon, Play, X, RefreshCw, ShieldAlert,
} from "lucide-react";
import type { VideoItem } from "../types";
import { createVideo, updateVideo, deleteVideo, uploadMediaFile } from "../services/api";
import { toast } from "sonner";

interface VideosViewProps {
  videos: VideoItem[];
  onRefresh: () => void;
  searchQuery: string;
}

const inputStyle = {
  background: "rgba(5, 11, 24, 0.9)",
  border: "1px solid rgba(59, 130, 246, 0.15)",
  color: "#E8F0FE",
  borderRadius: "12px",
  padding: "10px 16px",
  fontSize: "13px",
  width: "100%",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  transition: "border-color 0.2s, box-shadow 0.2s",
};
const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "500" as const,
  color: "rgba(148, 163, 184, 0.9)",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

export const VideosView: React.FC<VideosViewProps> = ({ videos, onRefresh, searchQuery }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inputMode, setInputMode] = useState<"url" | "file">("url");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const isAtCapacity = videos.length >= 3;

  const filteredVideos = videos.filter((v) => {
    if (!searchQuery) return true;
    return (
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const resetForm = () => {
    setTitle(""); setDescription(""); setVideoUrl(""); setSelectedFile(null);
    setInputMode("url"); setEditingVideo(null);
  };

  const handleOpenAdd = () => { resetForm(); setIsAddModalOpen(true); };
  const handleOpenEdit = (vid: VideoItem) => {
    setEditingVideo(vid); setTitle(vid.title); setDescription(vid.description || "");
    setVideoUrl(vid.src); setInputMode("url"); setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalSrc = videoUrl.trim();
    if (inputMode === "file" && selectedFile) {
      setUploading(true);
      const uploadedUrl = await uploadMediaFile(selectedFile);
      setUploading(false);
      if (!uploadedUrl) { toast.error("Failed to upload video file."); return; }
      finalSrc = uploadedUrl;
    }
    if (!finalSrc) { toast.error("Please provide a video URL or select an MP4 video file."); return; }

    if (editingVideo) {
      const updated = await updateVideo(editingVideo.id, { title: title || "Untitled Video", description, src: finalSrc });
      if (updated) { toast.success("Video entry updated!"); onRefresh(); setIsAddModalOpen(false); resetForm(); }
      else toast.error("Failed to update video.");
    } else {
      const res = await createVideo({ title: title || "Untitled Video", description, src: finalSrc });
      if (res && res.success) {
        if (res.replacedVideo) {
          toast.warning(`Max 3 capacity reached! Added '${res.video.title}' and auto-removed '${res.replacedVideo.title}'.`);
        } else {
          toast.success("New video published to showcase!");
        }
        onRefresh(); setIsAddModalOpen(false); resetForm();
      } else toast.error("Failed to save video.");
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Are you sure you want to delete "${titleStr}"?`)) return;
    const success = await deleteVideo(id);
    if (success) { toast.success("Video deleted."); onRefresh(); }
    else toast.error("Failed to delete video.");
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.border = "1px solid rgba(59, 130, 246, 0.5)";
    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.border = "1px solid rgba(59, 130, 246, 0.15)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: "1px solid rgba(59, 130, 246, 0.1)" }}>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-normal text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Video Showcase Manager
            </h2>
            <span className="rounded-full px-3 py-1 text-xs font-semibold"
              style={isAtCapacity
                ? { background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)", color: "#FCD34D" }
                : { background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", color: "#34D399" }}>
              {isAtCapacity ? "3 / 3 Max Capacity" : `${videos.length} / 3 Active`}
            </span>
          </div>
          <p className="mt-1 text-xs" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
            Curate cinematic showcase videos. Strictly limited to 3 items maximum for peak performance.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 shrink-0"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 25px rgba(59, 130, 246, 0.45)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >
          <Plus className="h-4 w-4" /> Add / Replace Video
        </button>
      </div>

      {/* FIFO Alert */}
      <div className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.18)" }}>
        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
        <div className="text-xs" style={{ color: "rgba(253, 230, 138, 0.85)" }}>
          <span className="font-semibold" style={{ color: "#FCD34D" }}>FIFO Queue Auto-Replacement Strategy: </span>
          Adding a new video when 3 slots are active will automatically drop the oldest video, ensuring the website gallery holds exactly 1 to 3 videos.
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVideos.map((vid, index) => {
          const isPlaying = playingId === vid.id;
          return (
            <motion.div
              key={vid.id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300"
              style={{ background: "rgba(8, 15, 31, 0.75)", border: "1px solid rgba(59, 130, 246, 0.1)", backdropFilter: "blur(12px)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.3)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(59, 130, 246, 0.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              {/* Slot badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md"
                style={{ background: "rgba(2, 8, 23, 0.85)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                <span style={{ color: "#60A5FA", fontFamily: "'JetBrains Mono', monospace" }}>Slot 0{index + 1}</span>
                {index === 0 && <span style={{ color: "rgba(245, 158, 11, 0.8)" }}>(Oldest)</span>}
              </div>

              {/* Action buttons */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button onClick={() => handleOpenEdit(vid)} title="Edit Video"
                  className="rounded-lg p-2 text-white transition-all duration-200"
                  style={{ background: "rgba(8, 15, 31, 0.85)", border: "1px solid rgba(59, 130, 246, 0.2)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563EB"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.85)"; }}>
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(vid.id, vid.title)} title="Delete Video"
                  className="rounded-lg p-2 transition-all duration-200"
                  style={{ background: "rgba(8, 15, 31, 0.85)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#F87171" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#DC2626"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.85)"; (e.currentTarget as HTMLElement).style.color = "#F87171"; }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Video area */}
              <div className="relative aspect-video w-full overflow-hidden" style={{ background: "#020817" }}>
                <video src={vid.src} controls={isPlaying} className="h-full w-full object-cover" />
                {!isPlaying && (
                  <button
                    onClick={() => setPlayingId(vid.id)}
                    className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                    style={{ background: "rgba(2, 8, 23, 0.5)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(2, 8, 23, 0.35)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(2, 8, 23, 0.5)"; }}
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
                      style={{
                        background: "rgba(37, 99, 235, 0.3)",
                        border: "1px solid rgba(59, 130, 246, 0.5)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <Play className="h-6 w-6 ml-0.5" style={{ color: "#93C5FD" }} />
                    </div>
                  </button>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg text-white font-medium truncate" style={{ fontFamily: "'DM Serif Display', serif" }}>{vid.title}</h3>
                  <p className="mt-1 text-xs line-clamp-2 leading-relaxed" style={{ color: "rgba(100, 116, 139, 0.75)" }}>
                    {vid.description || "No description provided."}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] pt-3"
                  style={{ borderTop: "1px solid rgba(59, 130, 246, 0.08)", color: "rgba(100, 116, 139, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
                  <span className="truncate max-w-[180px]">{vid.src.slice(0, 35)}...</span>
                  <span>{vid.createdAt ? new Date(vid.createdAt).toLocaleDateString() : "Active"}</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Empty slots */}
        {videos.length < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleOpenAdd}
            className="cursor-pointer flex flex-col items-center justify-center rounded-2xl p-8 text-center transition-all duration-300 min-h-[260px]"
            style={{
              background: "rgba(5, 11, 24, 0.4)",
              border: "2px dashed rgba(59, 130, 246, 0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.border = "2px dashed rgba(59, 130, 246, 0.35)";
              (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border = "2px dashed rgba(59, 130, 246, 0.15)";
              (e.currentTarget as HTMLElement).style.background = "rgba(5, 11, 24, 0.4)";
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full mb-4"
              style={{ background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              <Plus className="h-6 w-6" style={{ color: "#60A5FA" }} />
            </div>
            <h4 className="text-sm font-medium text-white mb-1">Add Video Slot 0{videos.length + 1}</h4>
            <p className="text-xs max-w-[180px]" style={{ color: "rgba(100, 116, 139, 0.6)" }}>
              Available slot ready for video publish.
            </p>
          </motion.div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(2, 8, 23, 0.85)", backdropFilter: "blur(8px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
              style={{ background: "#050B18", border: "1px solid rgba(59, 130, 246, 0.2)" }}
            >
              <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" }} />
              <div className="p-6">
                <div className="flex items-center justify-between pb-4 mb-5" style={{ borderBottom: "1px solid rgba(59, 130, 246, 0.1)" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg p-2" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                      <Video className="h-4 w-4" style={{ color: "#60A5FA" }} />
                    </div>
                    <h3 className="text-xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {editingVideo ? "Edit Video Entry" : "Add Video to Showcase"}
                    </h3>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)}
                    className="rounded-lg p-1.5 transition-all duration-200"
                    style={{ color: "rgba(100, 116, 139, 0.7)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.08)"; (e.currentTarget as HTMLElement).style.color = "#E8F0FE"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(100, 116, 139, 0.7)"; }}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isAtCapacity && !editingVideo && (
                    <div className="rounded-xl p-3 text-xs"
                      style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", color: "#FCD34D" }}>
                      ⚠️ <strong>Notice:</strong> 3/3 video slots filled. Submitting will auto-remove the oldest video.
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Video Title</label>
                    <input type="text" required placeholder="e.g. Cinematic Architectural Tour"
                      value={title} onChange={(e) => setTitle(e.target.value)}
                      style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Description / Subtitle</label>
                    <textarea rows={2} placeholder="Short architectural caption..."
                      value={description} onChange={(e) => setDescription(e.target.value)}
                      style={{ ...inputStyle, resize: "vertical" }} onFocus={focusInput} onBlur={blurInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Video Source Method</label>
                    <div className="flex gap-2">
                      {(["url", "file"] as const).map((mode) => (
                        <button key={mode} type="button" onClick={() => setInputMode(mode)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-all duration-200"
                          style={inputMode === mode
                            ? { background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93C5FD" }
                            : { background: "rgba(5, 11, 24, 0.8)", border: "1px solid rgba(59, 130, 246, 0.1)", color: "rgba(100, 116, 139, 0.7)" }}>
                          {mode === "url" ? <><LinkIcon className="h-3.5 w-3.5" /> Stream URL (MP4)</> : <><Upload className="h-3.5 w-3.5" /> MP4 File Upload</>}
                        </button>
                      ))}
                    </div>
                  </div>
                  {inputMode === "url" ? (
                    <input type="url" placeholder="https://assets.mixkit.co/videos/..."
                      value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
                      style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}
                      onFocus={focusInput} onBlur={blurInput} />
                  ) : (
                    <input type="file" accept="video/mp4,video/webm"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      style={{ ...inputStyle, padding: "8px 12px", cursor: "pointer" }} />
                  )}
                  {(videoUrl || selectedFile) && (
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(59, 130, 246, 0.12)", background: "#020817" }}>
                      <p className="text-[10px] text-center py-1.5" style={{ color: "rgba(100, 116, 139, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>Live Video Preview</p>
                      <video src={selectedFile ? URL.createObjectURL(selectedFile) : videoUrl} controls className="max-h-36 w-full object-contain rounded-lg" />
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: "1px solid rgba(59, 130, 246, 0.1)" }}>
                    <button type="button" onClick={() => setIsAddModalOpen(false)}
                      className="rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200"
                      style={{ border: "1px solid rgba(59, 130, 246, 0.15)", color: "rgba(148, 163, 184, 0.7)", background: "transparent" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.06)"; (e.currentTarget as HTMLElement).style.color = "#E8F0FE"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)"; }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={uploading}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold text-white transition-all duration-200 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
                      onMouseEnter={(e) => { if (!uploading) (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.45)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)"; }}>
                      {uploading ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Uploading Video...</>) :
                        editingVideo ? "Save Changes" : "Publish Video"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
