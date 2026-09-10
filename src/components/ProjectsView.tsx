import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, Trash2, Edit3, Upload, Link as LinkIcon, MapPin, X, RefreshCw, Calendar, Maximize2, User, Layers, Images } from "lucide-react";
import type { ProjectItem } from "../types";
import { createProject, updateProject, deleteProject, uploadMediaFile } from "../services/api";
import { toast } from "sonner";

interface ProjectsViewProps {
  projects: ProjectItem[];
  onRefresh: () => void;
  searchQuery: string;
}

const CATEGORIES = ["All", "Residential", "Commercial", "Interior", "Landscape"];

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onRefresh, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Residential");
  const [location, setLocation] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [area, setArea] = useState("");
  const [client, setClient] = useState("");
  const [materials, setMaterials] = useState("");
  const [extraImagesText, setExtraImagesText] = useState("");
  const [uploading, setUploading] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.materials && p.materials.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const resetForm = () => {
    setTitle("");
    setCategory("Residential");
    setLocation("");
    setImageUrl("");
    setSelectedFile(null);
    setDescription("");
    setYear(new Date().getFullYear().toString());
    setArea("");
    setClient("");
    setMaterials("");
    setExtraImagesText("");
    setImageMode("url");
    setEditingProject(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prj: ProjectItem) => {
    setEditingProject(prj);
    setTitle(prj.title);
    setCategory(prj.category);
    setLocation(prj.location);
    setImageUrl(prj.image);
    setDescription(prj.description || "");
    setYear(prj.year || "");
    setArea(prj.area || "");
    setClient(prj.client || "");
    setMaterials(prj.materials || "");
    setExtraImagesText(Array.isArray(prj.additionalImages) ? prj.additionalImages.join("\n") : "");
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
        toast.error("Failed to upload project image.");
        return;
      }
      finalImg = uploadedUrl;
    }

    if (!finalImg) {
      toast.error("Please specify a main hero image URL or upload an image file.");
      return;
    }

    const additionalImages = extraImagesText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: Partial<ProjectItem> = {
      title,
      category,
      location,
      image: finalImg,
      description,
      year,
      area,
      client,
      materials,
      additionalImages,
    };

    if (editingProject) {
      const res = await updateProject(editingProject.id, payload);
      if (res) {
        toast.success("Project updated with rich details!");
        onRefresh();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to update project.");
      }
    } else {
      const res = await createProject(payload);
      if (res) {
        toast.success("Project created with rich details!");
        onRefresh();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to create project.");
      }
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Delete project "${titleStr}"?`)) return;
    const res = await deleteProject(id);
    if (res) {
      toast.success("Project removed.");
      onRefresh();
    } else {
      toast.error("Failed to delete project.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-3xl font-normal text-white">Portfolio Projects</h2>
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
              {projects.length} Total Projects
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Manage architectural works with detailed specs, material palettes & gallery images.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400 shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add New Project
        </button>
      </div>

      {/* Category Filter Tabs */}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((prj, index) => (
          <motion.div
            key={prj.id || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-md transition hover:border-amber-500/40"
          >
            <div className="absolute top-3 left-3 z-10 rounded-full border border-black/50 bg-black/70 px-3 py-1 text-[10px] font-semibold text-amber-300 backdrop-blur-md">
              {prj.category}
            </div>

            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-90 transition group-hover:opacity-100">
              <button
                onClick={() => handleOpenEdit(prj)}
                className="rounded-lg border border-white/20 bg-neutral-900/80 p-2 text-white transition hover:border-amber-500 hover:bg-amber-500 hover:text-neutral-950"
                title="Edit Project Details"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(prj.id, prj.title)}
                className="rounded-lg border border-red-500/30 bg-neutral-900/80 p-2 text-red-400 transition hover:bg-red-500 hover:text-white"
                title="Delete Project"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
              <img
                src={prj.image}
                alt={prj.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif text-lg text-white font-medium">{prj.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-amber-400/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {prj.location}
                  </span>
                  {prj.year && (
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Calendar className="h-3 w-3" /> {prj.year}
                    </span>
                  )}
                  {prj.area && (
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Maximize2 className="h-3 w-3" /> {prj.area}
                    </span>
                  )}
                </div>
                {prj.description && (
                  <p className="mt-2 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {prj.description}
                  </p>
                )}
              </div>

              {prj.materials && (
                <div className="border-t border-white/5 pt-2 text-[11px] font-mono text-amber-400/90 truncate">
                  Materials: {prj.materials}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-amber-400" />
                  <h3 className="font-serif text-xl text-white">
                    {editingProject ? "Edit Architectural Project" : "Add Portfolio Project"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Obsidian Villa"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Interior">Interior</option>
                      <option value="Landscape">Landscape</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wayanad, Kerala"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Completion Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2025"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Built Area (sq.ft)</label>
                    <input
                      type="text"
                      placeholder="e.g. 7,400 sq.ft"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Client / Commission</label>
                    <input
                      type="text"
                      placeholder="e.g. Private Family Estate"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Material Palette</label>
                  <input
                    type="text"
                    placeholder="e.g. Obsidian Stone, Teak Timber, Bronze Metal Work"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Architectural Narrative / Description</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive description of spatial flow, light parameters, and materiality..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Hero Image Source */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-2">Main Hero Image Source</label>
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
                      <LinkIcon className="h-3.5 w-3.5" /> Image URL
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-amber-300"
                    />
                  </div>
                )}

                {/* Additional Detail Images */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Secondary Detail Gallery Photo URLs (One URL per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."
                    value={extraImagesText}
                    onChange={(e) => setExtraImagesText(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2 text-xs font-mono text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {(imageUrl || selectedFile) && (
                  <div className="rounded-xl border border-white/10 bg-black p-2">
                    <p className="text-[10px] text-neutral-400 mb-1 text-center font-mono">Hero Image Preview</p>
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
                    ) : editingProject ? (
                      "Save Project Specs"
                    ) : (
                      "Publish Project"
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
