import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Plus, Trash2, Edit3, X, CheckCircle2, EyeOff } from "lucide-react";
import type { ServiceItem } from "../types";
import { createService, updateService, deleteService } from "../services/api";
import { toast } from "sonner";

interface ServicesViewProps {
  services: ServiceItem[];
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

export const ServicesView: React.FC<ServicesViewProps> = ({ services, onRefresh, searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [n, setN] = useState("01");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [active, setActive] = useState(true);

  const filteredServices = services.filter((s) => {
    if (!searchQuery) return true;
    return (
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const resetForm = () => {
    setN(`0${services.length + 1}`); setTitle(""); setBody(""); setActive(true); setEditingService(null);
  };

  const handleOpenAdd = () => { resetForm(); setIsModalOpen(true); };
  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService(srv); setN(srv.n); setTitle(srv.title); setBody(srv.body);
    setActive(srv.active !== false); setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Service title is required."); return; }
    if (editingService) {
      const res = await updateService(editingService.id, { n, title, body, active });
      if (res) { toast.success("Service entry updated!"); onRefresh(); setIsModalOpen(false); }
      else toast.error("Failed to update service.");
    } else {
      const res = await createService({ n, title, body, active });
      if (res) { toast.success("Service created!"); onRefresh(); setIsModalOpen(false); }
      else toast.error("Failed to create service.");
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Delete service "${titleStr}"?`)) return;
    const res = await deleteService(id);
    if (res) { toast.success("Service deleted."); onRefresh(); }
    else toast.error("Failed to delete service.");
  };

  const handleToggleActive = async (srv: ServiceItem) => {
    const res = await updateService(srv.id, { active: !srv.active });
    if (res) { toast.success(`Service ${!srv.active ? "enabled" : "disabled"}.`); onRefresh(); }
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
              Architectural Services
            </h2>
            <span className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.25)", color: "#93C5FD" }}>
              {services.length} Services
            </span>
          </div>
          <p className="mt-1 text-xs" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
            Manage practice specializations, masterplanning, interiors, landscaping &amp; construction.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 shrink-0"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 25px rgba(59, 130, 246, 0.45)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >
          <Plus className="h-4 w-4" /> Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv, index) => {
          const isActive = srv.active !== false;
          return (
            <motion.div
              key={srv.id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative flex flex-col rounded-2xl p-6 transition-all duration-300"
              style={{
                background: isActive ? "rgba(8, 15, 31, 0.75)" : "rgba(5, 11, 24, 0.5)",
                border: isActive ? "1px solid rgba(59, 130, 246, 0.1)" : "1px solid rgba(51, 65, 85, 0.3)",
                backdropFilter: "blur(12px)",
                opacity: isActive ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                if (isActive) {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.3)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(59, 130, 246, 0.12)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = isActive ? "1px solid rgba(59, 130, 246, 0.1)" : "1px solid rgba(51, 65, 85, 0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <span
                  className="text-3xl font-light"
                  style={{ color: "rgba(59, 130, 246, 0.5)", fontFamily: "'DM Serif Display', serif" }}
                >
                  {srv.n}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(srv)}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all duration-200"
                    style={isActive
                      ? { background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", color: "#34D399" }
                      : { background: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(51, 65, 85, 0.4)", color: "rgba(100, 116, 139, 0.7)" }}
                  >
                    {isActive
                      ? <><CheckCircle2 className="h-3 w-3" /> Active</>
                      : <><EyeOff className="h-3 w-3" /> Hidden</>}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(srv)} title="Edit"
                    className="rounded-lg p-1.5 transition-all duration-200"
                    style={{ background: "rgba(8, 15, 31, 0.6)", border: "1px solid rgba(59, 130, 246, 0.12)", color: "rgba(148, 163, 184, 0.7)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.35)"; (e.currentTarget as HTMLElement).style.color = "#60A5FA"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.12)"; (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)"; }}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.title)} title="Delete"
                    className="rounded-lg p-1.5 transition-all duration-200"
                    style={{ background: "rgba(8, 15, 31, 0.6)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#F87171" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#DC2626"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.6)"; (e.currentTarget as HTMLElement).style.color = "#F87171"; }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Blue accent line */}
              <div className="mb-4 h-px" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.3), transparent)" }} />

              <h3 className="text-xl text-white font-medium mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>{srv.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(100, 116, 139, 0.75)" }}>{srv.body}</p>
            </motion.div>
          );
        })}
      </div>

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
                      <Layers className="h-4 w-4" style={{ color: "#60A5FA" }} />
                    </div>
                    <h3 className="text-xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {editingService ? "Edit Service" : "Add Service"}
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
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label style={labelStyle}>Index</label>
                      <input type="text" required placeholder="01"
                        value={n} onChange={(e) => setN(e.target.value)}
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                    </div>
                    <div className="col-span-2">
                      <label style={labelStyle}>Service Title</label>
                      <input type="text" required placeholder="e.g. Interior Design"
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Service Scope / Body</label>
                    <textarea rows={3} required placeholder="Curated interiors where material, texture and light..."
                      value={body} onChange={(e) => setBody(e.target.value)}
                      style={{ ...inputStyle, resize: "vertical" }} onFocus={focusInput} onBlur={blurInput} />
                  </div>

                  {/* Active toggle */}
                  <div
                    className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all duration-200"
                    style={{ background: "rgba(5, 11, 24, 0.8)", border: "1px solid rgba(59, 130, 246, 0.1)" }}
                    onClick={() => setActive(!active)}
                  >
                    <label className="text-xs font-medium cursor-pointer" style={{ color: "rgba(148, 163, 184, 0.9)" }}>
                      Visible on public website
                    </label>
                    <div
                      className="relative w-10 h-5 rounded-full transition-all duration-200"
                      style={{
                        background: active ? "linear-gradient(135deg, #2563EB, #3B82F6)" : "rgba(30, 41, 59, 0.8)",
                        border: active ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(51, 65, 85, 0.5)",
                      }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 bg-white shadow-sm"
                        style={{ left: active ? "calc(100% - 18px)" : "2px" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: "1px solid rgba(59, 130, 246, 0.1)" }}>
                    <button type="button" onClick={() => setIsModalOpen(false)}
                      className="rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200"
                      style={{ border: "1px solid rgba(59, 130, 246, 0.15)", color: "rgba(148, 163, 184, 0.7)", background: "transparent" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.06)"; (e.currentTarget as HTMLElement).style.color = "#E8F0FE"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)"; }}>
                      Cancel
                    </button>
                    <button type="submit"
                      className="rounded-xl px-5 py-2 text-xs font-semibold text-white transition-all duration-200"
                      style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.45)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)"; }}>
                      {editingService ? "Save Changes" : "Create Service"}
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
