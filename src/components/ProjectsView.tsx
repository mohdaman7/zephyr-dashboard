import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Plus, Trash2, Edit3, Upload, Link as LinkIcon,
  MapPin, X, RefreshCw, Calendar, Maximize2, User,
} from "lucide-react";
import type { ProjectItem } from "../types";
import { createProject, updateProject, deleteProject, uploadMediaFile } from "../services/api";
import { toast } from "sonner";

interface ProjectsViewProps {
  projects: ProjectItem[];
  onRefresh: () => void;
  searchQuery: string;
}

const CATEGORIES = ["All", "Residential", "Commercial", "Interior", "Landscape"];

// Shared style tokens
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
  fontWeight: "500",
  color: "rgba(148, 163, 184, 0.9)",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onRefresh, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

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
    setTitle(""); setCategory("Residential"); setLocation(""); setImageUrl("");
    setSelectedFile(null); setDescription(""); setYear(new Date().getFullYear().toString());
    setArea(""); setClient(""); setMaterials(""); setExtraImagesText(""); setImageMode("url"); setEditingProject(null);
  };

  const handleOpenAdd = () => { resetForm(); setIsModalOpen(true); };
  const handleOpenEdit = (prj: ProjectItem) => {
    setEditingProject(prj); setTitle(prj.title); setCategory(prj.category); setLocation(prj.location);
    setImageUrl(prj.image); setDescription(prj.description || ""); setYear(prj.year || "");
    setArea(prj.area || ""); setClient(prj.client || ""); setMaterials(prj.materials || "");
    setExtraImagesText(Array.isArray(prj.additionalImages) ? prj.additionalImages.join("\n") : "");
    setImageMode("url"); setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImg = imageUrl.trim();
    if (imageMode === "file" && selectedFile) {
      setUploading(true);
      const uploadedUrl = await uploadMediaFile(selectedFile);
      setUploading(false);
      if (!uploadedUrl) { toast.error("Failed to upload project image."); return; }
      finalImg = uploadedUrl;
    }
    if (!finalImg) { toast.error("Please specify a main hero image URL or upload an image file."); return; }
    const additionalImages = extraImagesText.split("\n").map((s) => s.trim()).filter((s) => s.length > 0);
    const payload: Partial<ProjectItem> = { title, category, location, image: finalImg, description, year, area, client, materials, additionalImages };

    if (editingProject) {
      const res = await updateProject(editingProject.id, payload);
      if (res) { toast.success("Project updated!"); onRefresh(); setIsModalOpen(false); }
      else toast.error("Failed to update project.");
    } else {
      const res = await createProject(payload);
      if (res) { toast.success("Project created!"); onRefresh(); setIsModalOpen(false); }
      else toast.error("Failed to create project.");
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Delete project "${titleStr}"?`)) return;
    const res = await deleteProject(id);
    if (res) { toast.success("Project removed."); onRefresh(); }
    else toast.error("Failed to delete project.");
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
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6"
        style={{ borderBottom: "1px solid rgba(59, 130, 246, 0.1)" }}
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-normal text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Portfolio Projects
            </h2>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.25)", color: "#93C5FD" }}
            >
              {projects.length} Total
            </span>
          </div>
          <p className="mt-1 text-xs" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
            Manage architectural works with detailed specs, material palettes &amp; gallery images.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 shrink-0"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 25px rgba(59, 130, 246, 0.45)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
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
            className="rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200"
            style={
              selectedCategory === cat
                ? { background: "linear-gradient(135deg, #2563EB, #3B82F6)", color: "#fff", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }
                : { background: "rgba(8, 15, 31, 0.7)", border: "1px solid rgba(59, 130, 246, 0.1)", color: "rgba(148, 163, 184, 0.7)" }
            }
            onMouseEnter={(e) => {
              if (selectedCategory !== cat) {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.3)";
                (e.currentTarget as HTMLElement).style.color = "#E8F0FE";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== cat) {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.1)";
                (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)";
              }
            }}
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
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300"
            style={cardBase}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.3)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(59, 130, 246, 0.12)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div
              className="absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md"
              style={{ background: "rgba(2, 8, 23, 0.8)", border: "1px solid rgba(59, 130, 246, 0.2)", color: "#93C5FD" }}
            >
              {prj.category}
            </div>

            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={() => handleOpenEdit(prj)}
                className="rounded-lg p-2 text-white transition-all duration-200"
                style={{ background: "rgba(8, 15, 31, 0.85)", border: "1px solid rgba(59, 130, 246, 0.2)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563EB"; (e.currentTarget as HTMLElement).style.border = "1px solid #3B82F6"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.85)"; (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.2)"; }}
                title="Edit Project Details"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(prj.id, prj.title)}
                className="rounded-lg p-2 transition-all duration-200"
                style={{ background: "rgba(8, 15, 31, 0.85)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#F87171" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#DC2626"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.85)"; (e.currentTarget as HTMLElement).style.color = "#F87171"; }}
                title="Delete Project"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ background: "#020817" }}>
              <img
                src={prj.image}
                alt={prj.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(2, 8, 23, 0.4) 0%, transparent 60%)" }} />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-lg text-white font-medium" style={{ fontFamily: "'DM Serif Display', serif" }}>{prj.title}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" style={{ color: "#60A5FA" }} /> {prj.location}
                  </span>
                  {prj.year && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {prj.year}
                    </span>
                  )}
                  {prj.area && (
                    <span className="flex items-center gap-1">
                      <Maximize2 className="h-3 w-3" /> {prj.area}
                    </span>
                  )}
                </div>
                {prj.description && (
                  <p className="mt-2 text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(100, 116, 139, 0.75)" }}>
                    {prj.description}
                  </p>
                )}
              </div>

              {prj.materials && (
                <div
                  className="pt-2 text-[11px] truncate"
                  style={{
                    borderTop: "1px solid rgba(59, 130, 246, 0.08)",
                    color: "#93C5FD",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(2, 8, 23, 0.85)", backdropFilter: "blur(8px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl my-8"
              style={{ background: "#050B18", border: "1px solid rgba(59, 130, 246, 0.2)" }}
            >
              {/* Modal header gradient line */}
              <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" }} />

              <div className="p-6">
                <div className="flex items-center justify-between pb-4 mb-5" style={{ borderBottom: "1px solid rgba(59, 130, 246, 0.1)" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg p-2" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                      <Briefcase className="h-4 w-4" style={{ color: "#60A5FA" }} />
                    </div>
                    <h3 className="text-xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {editingProject ? "Edit Architectural Project" : "Add Portfolio Project"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg p-1.5 transition-all duration-200"
                    style={{ color: "rgba(100, 116, 139, 0.7)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.08)"; (e.currentTarget as HTMLElement).style.color = "#E8F0FE"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(100, 116, 139, 0.7)"; }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[72vh] overflow-y-auto pr-1">
                  <div>
                    <label style={labelStyle}>Project Name</label>
                    <input
                      type="text" required placeholder="e.g. The Obsidian Villa"
                      value={title} onChange={(e) => setTitle(e.target.value)}
                      style={inputStyle} onFocus={focusInput} onBlur={blurInput}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label style={labelStyle}>Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)}
                        style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusInput} onBlur={blurInput}>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Interior">Interior</option>
                        <option value="Landscape">Landscape</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Location</label>
                      <input type="text" required placeholder="e.g. Wayanad, Kerala"
                        value={location} onChange={(e) => setLocation(e.target.value)}
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                    </div>
                    <div>
                      <label style={labelStyle}>Completion Year</label>
                      <input type="text" placeholder="e.g. 2025"
                        value={year} onChange={(e) => setYear(e.target.value)}
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label style={labelStyle}>Built Area (sq.ft)</label>
                      <input type="text" placeholder="e.g. 7,400 sq.ft"
                        value={area} onChange={(e) => setArea(e.target.value)}
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                    </div>
                    <div>
                      <label style={labelStyle}>Client / Commission</label>
                      <input type="text" placeholder="e.g. Private Family Estate"
                        value={client} onChange={(e) => setClient(e.target.value)}
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Material Palette</label>
                    <input type="text" placeholder="e.g. Obsidian Stone, Teak Timber, Bronze Metal Work"
                      value={materials} onChange={(e) => setMaterials(e.target.value)}
                      style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                  </div>

                  <div>
                    <label style={labelStyle}>Architectural Narrative / Description</label>
                    <textarea rows={3} placeholder="Comprehensive description of spatial flow, light parameters, and materiality..."
                      value={description} onChange={(e) => setDescription(e.target.value)}
                      style={{ ...inputStyle, resize: "vertical" }} onFocus={focusInput} onBlur={blurInput} />
                  </div>

                  {/* Image Source Toggle */}
                  <div>
                    <label style={labelStyle}>Main Hero Image Source</label>
                    <div className="flex gap-2">
                      {(["url", "file"] as const).map((mode) => (
                        <button
                          key={mode} type="button" onClick={() => setImageMode(mode)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-all duration-200"
                          style={imageMode === mode
                            ? { background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93C5FD" }
                            : { background: "rgba(5, 11, 24, 0.8)", border: "1px solid rgba(59, 130, 246, 0.1)", color: "rgba(100, 116, 139, 0.7)" }}
                        >
                          {mode === "url" ? <><LinkIcon className="h-3.5 w-3.5" /> Image URL</> : <><Upload className="h-3.5 w-3.5" /> Upload File</>}
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

                  <div>
                    <label style={labelStyle}>Secondary Detail Gallery Photo URLs (One URL per line)</label>
                    <textarea rows={3} placeholder={"https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."}
                      value={extraImagesText} onChange={(e) => setExtraImagesText(e.target.value)}
                      style={{ ...inputStyle, resize: "vertical", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}
                      onFocus={focusInput} onBlur={blurInput} />
                  </div>

                  {(imageUrl || selectedFile) && (
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(59, 130, 246, 0.12)", background: "#020817" }}>
                      <p className="text-[10px] text-center py-1.5" style={{ color: "rgba(100, 116, 139, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>Hero Image Preview</p>
                      <img src={selectedFile ? URL.createObjectURL(selectedFile) : imageUrl} alt="Preview" className="max-h-36 w-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: "1px solid rgba(59, 130, 246, 0.1)" }}>
                    <button
                      type="button" onClick={() => setIsModalOpen(false)}
                      className="rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200"
                      style={{ border: "1px solid rgba(59, 130, 246, 0.15)", color: "rgba(148, 163, 184, 0.7)", background: "transparent" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.06)"; (e.currentTarget as HTMLElement).style.color = "#E8F0FE"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)"; }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" disabled={uploading}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold text-white transition-all duration-200 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
                      onMouseEnter={(e) => { if (!uploading) (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.45)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)"; }}
                    >
                      {uploading ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Uploading...</>) :
                        editingProject ? "Save Project Specs" : "Publish Project"}
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
