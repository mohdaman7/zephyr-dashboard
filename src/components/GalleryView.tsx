import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon, Plus, Trash2, Edit3, Upload, Link as LinkIcon, Eye, X, RefreshCw,
} from "lucide-react";
import type { GalleryItem } from "../types";
import { createGalleryItem, updateGalleryItem, deleteGalleryItem, uploadMediaFile } from "../services/api";
import { toast } from "sonner";
import { getStoredCategories } from "./CategoriesView";

interface GalleryViewProps {
  gallery: GalleryItem[];
  onRefresh: () => void;
  searchQuery: string;
}


const cardBase = {
  background: "rgba(8, 15, 31, 0.75)",
  border: "1px solid rgba(59, 130, 246, 0.1)",
  backdropFilter: "blur(12px)",
};
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

export const GalleryView: React.FC<GalleryViewProps> = ({ gallery, onRefresh, searchQuery }) => {
  const dynamicCategories = getStoredCategories();
  const CATEGORIES = ["All", ...dynamicCategories];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Architecture");
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const filteredGallery = gallery.filter((item) => {
    const matchesCat = selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const resetForm = () => {
    setTitle(""); setCategory("Architecture"); setImageUrl("");
    setSelectedFile(null); setDescription(""); setImageMode("url"); setEditingItem(null);
  };

  const handleOpenAdd = () => { resetForm(); setIsModalOpen(true); };
  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item); setTitle(item.title); setCategory(item.category);
    setImageUrl(item.image); setDescription(item.description || ""); setImageMode("url"); setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImg = imageUrl.trim();
    if (imageMode === "file" && selectedFile) {
      setUploading(true);
      const uploadedUrl = await uploadMediaFile(selectedFile);
      setUploading(false);
      if (!uploadedUrl) { toast.error("Failed to upload photo file."); return; }
      finalImg = uploadedUrl;
    }
    if (!finalImg) { toast.error("Please specify a photo URL or upload an image file."); return; }

    if (editingItem) {
      const res = await updateGalleryItem(editingItem.id, { title, category, image: finalImg, description });
      if (res) { toast.success("Gallery photo updated!"); onRefresh(); setIsModalOpen(false); }
      else toast.error("Failed to update gallery photo.");
    } else {
      const res = await createGalleryItem({ title, category, image: finalImg, description });
      if (res) { toast.success("New photo added to showcase!"); onRefresh(); setIsModalOpen(false); }
      else toast.error("Failed to add photo.");
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Delete photo "${titleStr}"?`)) return;
    const res = await deleteGalleryItem(id);
    if (res) { toast.success("Photo removed from gallery."); onRefresh(); }
    else toast.error("Failed to delete photo.");
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.border = "1px solid rgba(59, 130, 246, 0.5)";
    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
              Gallery Showcase
            </h2>
            <span className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.25)", color: "#93C5FD" }}>
              {gallery.length} Photos
            </span>
          </div>
          <p className="mt-1 text-xs" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
            Curate high-resolution architectural silhouettes, interior detailing &amp; texture photos.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 shrink-0"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 25px rgba(59, 130, 246, 0.45)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >
          <Plus className="h-4 w-4" /> Add New Photo
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat} onClick={() => setSelectedCategory(cat)}
            className="rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200"
            style={selectedCategory === cat
              ? { background: "linear-gradient(135deg, #2563EB, #3B82F6)", color: "#fff", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }
              : { background: "rgba(8, 15, 31, 0.7)", border: "1px solid rgba(59, 130, 246, 0.1)", color: "rgba(148, 163, 184, 0.7)" }}
            onMouseEnter={(e) => { if (selectedCategory !== cat) { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.3)"; (e.currentTarget as HTMLElement).style.color = "#E8F0FE"; } }}
            onMouseLeave={(e) => { if (selectedCategory !== cat) { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)"; } }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300"
            style={cardBase}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.3)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(59, 130, 246, 0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <div className="absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md"
              style={{ background: "rgba(2, 8, 23, 0.8)", border: "1px solid rgba(59, 130, 246, 0.2)", color: "#93C5FD" }}>
              {item.category}
            </div>

            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
              {[
                { icon: Eye, title: "Preview", action: () => setLightboxImage(item) },
                { icon: Edit3, title: "Edit Photo", action: () => handleOpenEdit(item) },
              ].map(({ icon: Icon, title: t, action }) => (
                <button key={t} onClick={action} title={t}
                  className="rounded-lg p-2 text-white transition-all duration-200"
                  style={{ background: "rgba(8, 15, 31, 0.85)", border: "1px solid rgba(59, 130, 246, 0.2)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563EB"; (e.currentTarget as HTMLElement).style.border = "1px solid #3B82F6"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.85)"; (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.2)"; }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
              <button onClick={() => handleDelete(item.id, item.title)} title="Delete Photo"
                className="rounded-lg p-2 transition-all duration-200"
                style={{ background: "rgba(8, 15, 31, 0.85)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#F87171" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#DC2626"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.85)"; (e.currentTarget as HTMLElement).style.color = "#F87171"; }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div onClick={() => setLightboxImage(item)} className="relative aspect-square w-full cursor-pointer overflow-hidden" style={{ background: "#020817" }}>
              <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: "rgba(2, 8, 23, 0.4)" }}>
                <div className="rounded-full p-3" style={{ background: "rgba(59, 130, 246, 0.3)", backdropFilter: "blur(4px)" }}>
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-base text-white font-medium" style={{ fontFamily: "'DM Serif Display', serif" }}>{item.title}</h3>
              {item.description && (
                <p className="mt-1 text-xs line-clamp-2 leading-relaxed" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(2, 8, 23, 0.95)", backdropFilter: "blur(12px)" }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full overflow-hidden rounded-2xl shadow-2xl"
              style={{ background: "#050B18", border: "1px solid rgba(59, 130, 246, 0.2)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" }} />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-20 rounded-full p-2 transition-all duration-200"
                style={{ background: "rgba(8, 15, 31, 0.9)", border: "1px solid rgba(59, 130, 246, 0.2)", color: "#E8F0FE" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563EB"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.9)"; }}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="max-h-[70vh] overflow-hidden flex items-center justify-center" style={{ background: "#020817" }}>
                <img src={lightboxImage.image} alt={lightboxImage.title} className="max-h-[70vh] w-full object-contain" />
              </div>
              <div className="p-6">
                <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#60A5FA", fontFamily: "'JetBrains Mono', monospace" }}>
                  {lightboxImage.category}
                </span>
                <h3 className="text-2xl text-white mt-1" style={{ fontFamily: "'DM Serif Display', serif" }}>{lightboxImage.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "rgba(148, 163, 184, 0.8)" }}>{lightboxImage.description || "No description provided."}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(2, 8, 23, 0.85)", backdropFilter: "blur(8px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
              style={{ background: "#050B18", border: "1px solid rgba(59, 130, 246, 0.2)" }}
            >
              <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" }} />
              <div className="p-6">
                <div className="flex items-center justify-between pb-4 mb-5" style={{ borderBottom: "1px solid rgba(59, 130, 246, 0.1)" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg p-2" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                      <ImageIcon className="h-4 w-4" style={{ color: "#60A5FA" }} />
                    </div>
                    <h3 className="text-xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {editingItem ? "Edit Photo" : "Add Gallery Photo"}
                    </h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)}
                    className="rounded-lg p-1.5 transition-all duration-200"
                    style={{ color: "rgba(100, 116, 139, 0.7)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.08)"; (e.currentTarget as HTMLElement).style.color = "#E8F0FE"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(100, 116, 139, 0.7)"; }}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label style={labelStyle}>Photo Title</label>
                    <input type="text" required placeholder="e.g. Monolithic Cantilever Staircase"
                      value={title} onChange={(e) => setTitle(e.target.value)}
                      style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Category Tag</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusInput} onBlur={blurInput}>
                      {dynamicCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Caption / Description</label>
                    <textarea rows={2} placeholder="Short architectural note..."
                      value={description} onChange={(e) => setDescription(e.target.value)}
                      style={{ ...inputStyle, resize: "vertical" }} onFocus={focusInput} onBlur={blurInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Image Source</label>
                    <div className="flex gap-2">
                      {(["url", "file"] as const).map((mode) => (
                        <button key={mode} type="button" onClick={() => setImageMode(mode)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-all duration-200"
                          style={imageMode === mode
                            ? { background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93C5FD" }
                            : { background: "rgba(5, 11, 24, 0.8)", border: "1px solid rgba(59, 130, 246, 0.1)", color: "rgba(100, 116, 139, 0.7)" }}>
                          {mode === "url" ? <><LinkIcon className="h-3.5 w-3.5" /> Photo URL</> : <><Upload className="h-3.5 w-3.5" /> Upload File</>}
                        </button>
                      ))}
                    </div>
                  </div>
                  {imageMode === "url" ? (
                    <input type="url" placeholder="https://images.unsplash.com/..."
                      value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                      style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}
                      onFocus={focusInput} onBlur={blurInput} />
                  ) : (
                    <input type="file" accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      style={{ ...inputStyle, padding: "8px 12px", cursor: "pointer" }} />
                  )}
                  {(imageUrl || selectedFile) && (
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(59, 130, 246, 0.12)", background: "#020817" }}>
                      <p className="text-[10px] text-center py-1.5" style={{ color: "rgba(100, 116, 139, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>Image Preview</p>
                      <img src={selectedFile ? URL.createObjectURL(selectedFile) : imageUrl} alt="Preview" className="max-h-36 w-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: "1px solid rgba(59, 130, 246, 0.1)" }}>
                    <button type="button" onClick={() => setIsModalOpen(false)}
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
                      {uploading ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Uploading...</>) :
                        editingItem ? "Save Changes" : "Publish Photo"}
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
