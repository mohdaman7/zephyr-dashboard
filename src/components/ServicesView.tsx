import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Plus, Trash2, Edit3, X } from "lucide-react";
import type { ServiceItem } from "../types";
import { createService, updateService, deleteService } from "../services/api";
import { toast } from "sonner";

interface ServicesViewProps {
  services: ServiceItem[];
  onRefresh: () => void;
  searchQuery: string;
}

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
    setN(`0${services.length + 1}`);
    setTitle("");
    setBody("");
    setActive(true);
    setEditingService(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService(srv);
    setN(srv.n);
    setTitle(srv.title);
    setBody(srv.body);
    setActive(srv.active !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Service title is required.");
      return;
    }

    if (editingService) {
      const res = await updateService(editingService.id, { n, title, body, active });
      if (res) {
        toast.success("Service entry updated!");
        onRefresh();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to update service.");
      }
    } else {
      const res = await createService({ n, title, body, active });
      if (res) {
        toast.success("Service created!");
        onRefresh();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to create service.");
      }
    }
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Delete service "${titleStr}"?`)) return;
    const res = await deleteService(id);
    if (res) {
      toast.success("Service deleted.");
      onRefresh();
    } else {
      toast.error("Failed to delete service.");
    }
  };

  const handleToggleActive = async (srv: ServiceItem) => {
    const res = await updateService(srv.id, { active: !srv.active });
    if (res) {
      toast.success(`Service ${!srv.active ? "enabled" : "disabled"}.`);
      onRefresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-3xl font-normal text-white">Architectural Services</h2>
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
              {services.length} Defined Services
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Manage practice specializations, masterplanning, interiors, landscaping & construction.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400 shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv, index) => (
          <motion.div
            key={srv.id || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-md transition ${
              srv.active !== false
                ? "border-white/10 bg-neutral-900/80 hover:border-amber-500/40"
                : "border-white/5 bg-neutral-950/40 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-2xl font-light text-amber-400/80">{srv.n}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(srv)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition ${
                      srv.active !== false
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                    }`}
                  >
                    {srv.active !== false ? "Active" : "Hidden"}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="rounded-lg border border-white/10 bg-neutral-950 p-1.5 text-neutral-300 hover:border-amber-500 hover:text-amber-400"
                    title="Edit"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="rounded-lg border border-red-500/20 bg-neutral-950 p-1.5 text-red-400 hover:bg-red-500 hover:text-white"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif text-xl text-white font-medium">{srv.title}</h3>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{srv.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

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
                  <Layers className="h-5 w-5 text-amber-400" />
                  <h3 className="font-serif text-xl text-white">
                    {editingService ? "Edit Service" : "Add Service"}
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
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Index Number</label>
                    <input
                      type="text"
                      required
                      placeholder="01"
                      value={n}
                      onChange={(e) => setN(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Service Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Interior Design"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Service Scope / Body</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Curated interiors where material, texture and light..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="srvActive"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-neutral-950 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="srvActive" className="text-xs text-neutral-300 cursor-pointer">
                    Visible on public website
                  </label>
                </div>

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
                    className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition"
                  >
                    {editingService ? "Save Changes" : "Create Service"}
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
