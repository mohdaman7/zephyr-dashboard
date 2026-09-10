import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Plus, Trash2, Edit3, Upload, Link as LinkIcon, Play, Pause, X, RefreshCw, ShieldAlert } from "lucide-react";
import type { VideoItem } from "../types";
import { createVideo, updateVideo, deleteVideo, uploadMediaFile } from "../services/api";
import { toast } from "sonner";

interface VideosViewProps {
  videos: VideoItem[];
  onRefresh: () => void;
  searchQuery: string;
}

export const VideosView: React.FC<VideosViewProps> = ({ videos, onRefresh, searchQuery }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  // Form State
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
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setSelectedFile(null);
    setInputMode("url");
    setEditingVideo(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (vid: VideoItem) => {
    setEditingVideo(vid);
    setTitle(vid.title);
    setDescription(vid.description || "");
    setVideoUrl(vid.src);
    setInputMode("url");
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalSrc = videoUrl.trim();

    if (inputMode === "file" && selectedFile) {
      setUploading(true);
      const uploadedUrl = await uploadMediaFile(selectedFile);
      setUploading(false);
      if (!uploadedUrl) {
        toast.error("Failed to upload video file.");
        return;
      }
      finalSrc = uploadedUrl;
    }

    if (!finalSrc) {
      toast.error("Please provide a video URL or select an MP4 video file.");
      return;
    }

    if (editingVideo) {
      const updated = await updateVideo(editingVideo.id, {
        title: title || "Untitled Video",
        description,
        src: finalSrc,
      });
      if (updated) {
        toast.success("Video entry updated!");
        onRefresh();
        setIsAddModalOpen(false);
        resetForm();
      } else {
        toast.error("Failed to update video.");
      }
    } else {
      // Create new video with MAX 3 FIFO logic
      const res = await createVideo({
        title: title || "Untitled Video",
        description,
        src: finalSrc,
      });

      if (res && res.success) {
        if (res.replacedVideo) {
          toast.warning(
            `Max 3 capacity reached! Added '${res.video.title}' and automatically removed oldest video '${res.replacedVideo.title}'.`
          );
        } else {
          toast.success("New video published to showcase!");
        }
        onRefresh();
        setIsAddModalOpen(false);
        resetForm();
      } else {
        toast.error("Failed to save video.");
      }
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Are you sure you want to delete "${titleStr}"?`)) return;
    const success = await deleteVideo(id);
    if (success) {
      toast.success("Video deleted.");
      onRefresh();
    } else {
      toast.error("Failed to delete video.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-3xl font-normal text-white">Video Showcase Manager</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                isAtCapacity
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}
            >
              {isAtCapacity ? "3 / 3 Slots Occupied (Max Capacity)" : `${videos.length} / 3 Active Slots`}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Curate cinematic showcase videos. Strictly limited to 3 items maximum for peak performance.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400 shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add / Replace Video
        </button>
      </div>

      {/* FIFO Capacity Alert Notice */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200 flex items-start gap-3 backdrop-blur-md">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">FIFO Queue Auto-Replacement Strategy:</span>{" "}
          Adding a new video when 3 slots are active will automatically drop the oldest video in the queue, ensuring the website gallery holds exactly 1 to 3 videos.
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
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-md transition hover:border-amber-500/40"
            >
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-full border border-black/50 bg-black/70 px-3 py-1 text-[10px] font-semibold text-amber-400 backdrop-blur-md">
                <span>Slot 0{index + 1}</span>
                {index === 0 && <span className="text-neutral-400">(Oldest)</span>}
              </div>

              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-90 transition group-hover:opacity-100">
                <button
                  onClick={() => handleOpenEdit(vid)}
                  className="rounded-lg border border-white/20 bg-neutral-900/80 p-2 text-white transition hover:border-amber-500 hover:bg-amber-500 hover:text-neutral-950"
                  title="Edit Video"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(vid.id, vid.title)}
                  className="rounded-lg border border-red-500/30 bg-neutral-900/80 p-2 text-red-400 transition hover:bg-red-500 hover:text-white"
                  title="Delete Video"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <video
                  src={vid.src}
                  controls={isPlaying}
                  className="h-full w-full object-cover"
                />
                {!isPlaying && (
                  <button
                    onClick={() => setPlayingId(vid.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 transition hover:bg-black/20"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/50 bg-amber-500/20 text-amber-300 backdrop-blur-md transition group-hover:scale-110">
                      <Play className="h-6 w-6 ml-0.5" />
                    </div>
                  </button>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-white font-medium truncate">{vid.title}</h3>
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {vid.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span className="truncate max-w-[180px]">{vid.src}</span>
                  <span>{vid.createdAt ? new Date(vid.createdAt).toLocaleDateString() : "Active"}</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {videos.length < 3 && (
          <div
            onClick={handleOpenAdd}
            className="cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-neutral-950/30 p-8 text-center transition hover:border-amber-500/40 hover:bg-amber-500/5 min-h-[260px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 mb-3">
              <Plus className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-medium text-white">Add Video Slot 0{videos.length + 1}</h4>
            <p className="mt-1 text-xs text-neutral-500 max-w-[180px]">
              Available slot ready for video publish.
            </p>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-amber-400" />
                  <h3 className="font-serif text-xl text-white">
                    {editingVideo ? "Edit Video Entry" : "Add Video to Showcase"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {isAtCapacity && !editingVideo && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                    ⚠️ <strong>Notice:</strong> 3/3 video slots filled. Submitting will auto-remove the oldest video.
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Video Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cinematic Architectural Tour"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Description / Subtitle</label>
                  <textarea
                    rows={2}
                    placeholder="Short architectural caption..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Input Mode Switch */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-2">Video Source Method</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setInputMode("url")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-medium transition ${
                        inputMode === "url"
                          ? "border-amber-500 bg-amber-500/10 text-amber-300"
                          : "border-white/10 bg-neutral-950 text-neutral-400"
                      }`}
                    >
                      <LinkIcon className="h-3.5 w-3.5" /> Video Stream URL (MP4)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode("file")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-medium transition ${
                        inputMode === "file"
                          ? "border-amber-500 bg-amber-500/10 text-amber-300"
                          : "border-white/10 bg-neutral-950 text-neutral-400"
                      }`}
                    >
                      <Upload className="h-3.5 w-3.5" /> Direct MP4 File Upload
                    </button>
                  </div>
                </div>

                {inputMode === "url" ? (
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">MP4 Video URL</label>
                    <input
                      type="url"
                      placeholder="https://assets.mixkit.co/videos/..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none font-mono text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Select MP4 File</label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-amber-300"
                    />
                  </div>
                )}

                {(videoUrl || selectedFile) && (
                  <div className="rounded-xl border border-white/10 bg-black p-2">
                    <p className="text-[10px] text-neutral-400 mb-1 text-center font-mono">Live Video Preview</p>
                    <video
                      src={selectedFile ? URL.createObjectURL(selectedFile) : videoUrl}
                      controls
                      className="max-h-36 w-full object-contain rounded-lg"
                    />
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-neutral-400 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Uploading Video...
                      </>
                    ) : editingVideo ? (
                      "Save Changes"
                    ) : (
                      "Publish Video"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
