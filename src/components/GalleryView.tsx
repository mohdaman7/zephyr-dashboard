import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Plus, Trash2, Edit3, Upload, Link as LinkIcon, Eye, X, RefreshCw } from "lucide-react";
import type { GalleryItem } from "../types";
import { createGalleryItem, updateGalleryItem, deleteGalleryItem, uploadMediaFile } from "../services/api";
import { toast } from "sonner";

interface GalleryViewProps {
  gallery: GalleryItem[];
  onRefresh: () => void;
  searchQuery: string;
}

const CATEGORIES = ["All", "Architecture", "Interiors", "Landscape", "Furniture & Detail"];

export const GalleryView: React.FC<GalleryViewProps> = ({ gallery, onRefresh, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // Form states
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
    setTitle("");
    setCategory("Architecture");
    setImageUrl("");
    setSelectedFile(null);
    setDescription("");
    setImageMode("url");
    setEditingItem(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setImageUrl(item.image);
    setDescription(item.description || "");
    setImageMode("url");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImg = imageUrl.trim();

    if (imageMode === "file" && selectedFile) {
      setUploading(true);
      const uploadedUrl = await uploadMediaFile(selectedFile);
      setUploading(false);
      if (!uploadedUrl) {
        toast.error("Failed to upload photo file.");
        return;
      }
      finalImg = uploadedUrl;
    }

    if (!finalImg) {
      toast.error("Please specify a photo URL or upload an image file.");
      return;
    }

    if (editingItem) {
      const res = await updateGalleryItem(editingItem.id, {
        title,
        category,
        image: finalImg,
        description,
      });
      if (res) {
        toast.success("Gallery photo updated!");
        onRefresh();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to update gallery photo.");
      }
    } else {
      const res = await createGalleryItem({
        title,
        category,
        image: finalImg,
        description,
      });
      if (res) {
        toast.success("New photo added to showcase!");
        onRefresh();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to add photo.");
      }
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Delete photo "${titleStr}"?`)) return;
    const res = await deleteGalleryItem(id);
    if (res) {
      toast.success("Photo removed from gallery.");
      onRefresh();
    } else {
      toast.error("Failed to delete photo.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-3xl font-normal text-white">Gallery Showcase</h2>
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
              {gallery.length} Curated Photos
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Curate high-resolution architectural silhouettes, interior detailing & texture photos.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400 shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add New Photo
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
              selectedCategory === cat
                ? "bg-amber-500 text-neutral-950 font-semibold shadow-md"
                : "border border-white/10 bg-neutral-900/60 text-neutral-400 hover:border-amber-500/30 hover:text-white"
            }`}
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
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-md transition hover:border-amber-500/40"
          >
            <div className="absolute top-3 left-3 z-10 rounded-full border border-black/50 bg-black/70 px-3 py-1 text-[10px] font-semibold text-amber-300 backdrop-blur-md">
              {item.category}
            </div>

            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-90 transition group-hover:opacity-100">
              <button
                onClick={() => setLightboxImage(item)}
                className="rounded-lg border border-white/20 bg-neutral-900/80 p-2 text-white transition hover:border-amber-500 hover:bg-amber-500 hover:text-neutral-950"
                title="Preview Lightbox"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleOpenEdit(item)}
                className="rounded-lg border border-white/20 bg-neutral-900/80 p-2 text-white transition hover:border-amber-500 hover:bg-amber-500 hover:text-neutral-950"
                title="Edit Photo"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="rounded-lg border border-red-500/30 bg-neutral-900/80 p-2 text-red-400 transition hover:bg-red-500 hover:text-white"
                title="Delete Photo"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div
              onClick={() => setLightboxImage(item)}
              className="relative aspect-square w-full cursor-pointer overflow-hidden bg-neutral-950"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base text-white font-medium">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX PREVIEW MODAL */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <div className="relative max-w-4xl w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-20 rounded-full border border-white/20 bg-black/60 p-2 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={lightboxImage.image}
                  alt={lightboxImage.title}
                  className="max-h-[75vh] w-full object-contain"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">{lightboxImage.category}</span>
                <h3 className="font-serif text-2xl text-white mt-1">{lightboxImage.title}</h3>
                <p className="mt-2 text-sm text-neutral-300">{lightboxImage.description || "No description provided."}</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-amber-400" />
                  <h3 className="font-serif text-xl text-white">
                    {editingItem ? "Edit Photo" : "Add Gallery Photo"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Photo Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monolithic Cantilever Staircase"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Category Tag</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Interiors">Interiors</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Furniture & Detail">Furniture & Detail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Caption / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short architectural note..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Source switch */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-2">Image Source</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-medium transition ${
                        imageMode === "url"
                          ? "border-amber-500 bg-amber-500/10 text-amber-300"
                          : "border-white/10 bg-neutral-950 text-neutral-400"
                      }`}
                    >
                      <LinkIcon className="h-3.5 w-3.5" /> Photo URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("file")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-medium transition ${
                        imageMode === "file"
                          ? "border-amber-500 bg-amber-500/10 text-amber-300"
                          : "border-white/10 bg-neutral-950 text-neutral-400"
                      }`}
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload File
                    </button>
                  </div>
                </div>

                {imageMode === "url" ? (
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Image Web Link</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none font-mono text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Upload Photo File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-amber-300"
                    />
                  </div>
                )}

                {(imageUrl || selectedFile) && (
                  <div className="rounded-xl border border-white/10 bg-black p-2">
                    <p className="text-[10px] text-neutral-400 mb-1 text-center font-mono">Image Preview</p>
                    <img
                      src={selectedFile ? URL.createObjectURL(selectedFile) : imageUrl}
                      alt="Preview"
                      className="max-h-36 w-full object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Uploading...
                      </>
                    ) : editingItem ? (
                      "Save Changes"
                    ) : (
                      "Publish Photo"
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
