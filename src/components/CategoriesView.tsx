import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, Trash2, Edit3, Check, X, GripVertical, FolderOpen, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "zephyr_categories";
const DEFAULT_CATEGORIES = ["Residential", "Commercial", "Interior", "Landscape"];

// Colour palette for category tags
const TAG_COLORS = [
  { bg: "rgba(37, 99, 235, 0.15)", border: "rgba(59, 130, 246, 0.4)", text: "#93C5FD" },
  { bg: "rgba(124, 58, 237, 0.15)", border: "rgba(139, 92, 246, 0.4)", text: "#C4B5FD" },
  { bg: "rgba(5, 150, 105, 0.15)", border: "rgba(16, 185, 129, 0.4)", text: "#6EE7B7" },
  { bg: "rgba(217, 119, 6, 0.15)", border: "rgba(245, 158, 11, 0.4)", text: "#FCD34D" },
  { bg: "rgba(220, 38, 38, 0.15)", border: "rgba(239, 68, 68, 0.4)", text: "#FCA5A5" },
  { bg: "rgba(8, 145, 178, 0.15)", border: "rgba(6, 182, 212, 0.4)", text: "#67E8F9" },
  { bg: "rgba(190, 24, 93, 0.15)", border: "rgba(236, 72, 153, 0.4)", text: "#F9A8D4" },
  { bg: "rgba(101, 163, 13, 0.15)", border: "rgba(132, 204, 22, 0.4)", text: "#BEF264" },
];

export function getStoredCategories(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  return [...DEFAULT_CATEGORIES];
}

function saveCategories(cats: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
}

const inputStyle: React.CSSProperties = {
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

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(getStoredCategories);
  const [newCat, setNewCat] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [newInputFocused, setNewInputFocused] = useState(false);

  const persist = (updated: string[]) => {
    setCategories(updated);
    saveCategories(updated);
  };

  const handleAdd = () => {
    const trimmed = newCat.trim();
    if (!trimmed) { toast.error("Category name cannot be empty."); return; }
    if (categories.map((c) => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      toast.error(`"${trimmed}" already exists.`); return;
    }
    const updated = [...categories, trimmed];
    persist(updated);
    setNewCat("");
    toast.success(`Category "${trimmed}" added!`);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(categories[index]);
    setDeleteConfirmIndex(null);
  };

  const handleSaveEdit = (index: number) => {
    const trimmed = editValue.trim();
    if (!trimmed) { toast.error("Category name cannot be empty."); return; }
    if (
      categories
        .filter((_, i) => i !== index)
        .map((c) => c.toLowerCase())
        .includes(trimmed.toLowerCase())
    ) {
      toast.error(`"${trimmed}" already exists.`); return;
    }
    const updated = [...categories];
    updated[index] = trimmed;
    persist(updated);
    setEditingIndex(null);
    toast.success(`Category renamed to "${trimmed}".`);
  };

  const handleDelete = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    persist(updated);
    setDeleteConfirmIndex(null);
    toast.success(`Category "${categories[index]}" deleted.`);
  };

  const handleReset = () => {
    if (!confirm("Reset all categories to default? This cannot be undone.")) return;
    persist([...DEFAULT_CATEGORIES]);
    toast.success("Categories reset to defaults.");
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") action();
    if (e.key === "Escape") { setEditingIndex(null); setNewCat(""); }
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
              Category Manager
            </h2>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.25)", color: "#93C5FD" }}
            >
              {categories.length} Categories
            </span>
          </div>
          <p className="mt-1 text-xs" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
            Manage project &amp; gallery categories. Changes reflect instantly across all filters and dropdowns.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all duration-200"
          style={{
            background: "rgba(8, 15, 31, 0.8)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            color: "rgba(148, 163, 184, 0.7)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.border = "1px solid rgba(239, 68, 68, 0.3)";
            (e.currentTarget as HTMLElement).style.color = "#F87171";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.15)";
            (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)";
          }}
        >
          <X className="h-3.5 w-3.5" /> Reset to Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Category Panel */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "rgba(8, 15, 31, 0.75)",
            border: "1px solid rgba(59, 130, 246, 0.1)",
            backdropFilter: "blur(12px)",
            height: "fit-content",
          }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="rounded-lg p-2"
              style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}
            >
              <Plus className="h-4 w-4" style={{ color: "#60A5FA" }} />
            </div>
            <h3 className="text-sm font-semibold text-white">Add New Category</h3>
          </div>

          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(148, 163, 184, 0.8)" }}
            >
              Category Name
            </label>
            <input
              id="new-category-input"
              type="text"
              placeholder="e.g. Hospitality"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleAdd)}
              onFocus={() => setNewInputFocused(true)}
              onBlur={() => setNewInputFocused(false)}
              style={{
                ...inputStyle,
                border: newInputFocused
                  ? "1px solid rgba(59, 130, 246, 0.5)"
                  : "1px solid rgba(59, 130, 246, 0.15)",
                boxShadow: newInputFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
              }}
            />
            <p className="mt-1.5 text-[10px]" style={{ color: "rgba(100, 116, 139, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
              Press Enter or click Add
            </p>
          </div>

          <button
            id="add-category-btn"
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
              boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 25px rgba(59, 130, 246, 0.45)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>

          {/* Info box */}
          <div
            className="rounded-xl p-3.5 mt-2"
            style={{
              background: "rgba(37, 99, 235, 0.06)",
              border: "1px solid rgba(59, 130, 246, 0.12)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5" style={{ color: "#60A5FA" }}>
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="text-[11px] font-semibold">Live Sync</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: "rgba(148, 163, 184, 0.7)" }}>
              Categories sync instantly to Projects &amp; Gallery filter tabs and category dropdowns in add/edit forms.
            </p>
          </div>
        </div>

        {/* Category List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-white">All Categories</h3>
            <span className="text-[11px]" style={{ color: "rgba(100, 116, 139, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
              {categories.length} total
            </span>
          </div>

          <AnimatePresence>
            {categories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 rounded-2xl"
                style={{ background: "rgba(8, 15, 31, 0.5)", border: "1px solid rgba(59, 130, 246, 0.08)" }}
              >
                <Tag className="h-10 w-10 mb-3" style={{ color: "rgba(59, 130, 246, 0.3)" }} />
                <p className="text-sm" style={{ color: "rgba(100, 116, 139, 0.6)" }}>No categories yet</p>
                <p className="text-xs mt-1" style={{ color: "rgba(100, 116, 139, 0.4)" }}>Add your first category on the left</p>
              </motion.div>
            ) : (
              categories.map((cat, index) => {
                const colorScheme = TAG_COLORS[index % TAG_COLORS.length];
                const isEditing = editingIndex === index;
                const isDeleteConfirm = deleteConfirmIndex === index;

                return (
                  <motion.div
                    key={cat + index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200"
                    style={{
                      background: "rgba(8, 15, 31, 0.75)",
                      border: isEditing
                        ? "1px solid rgba(59, 130, 246, 0.4)"
                        : isDeleteConfirm
                        ? "1px solid rgba(239, 68, 68, 0.3)"
                        : "1px solid rgba(59, 130, 246, 0.1)",
                      backdropFilter: "blur(12px)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isEditing && !isDeleteConfirm)
                        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isEditing && !isDeleteConfirm)
                        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.1)";
                    }}
                  >
                    {/* Grip */}
                    <GripVertical className="h-4 w-4 shrink-0 opacity-30" style={{ color: "rgba(100, 116, 139, 0.5)" }} />

                    {/* Number */}
                    <span
                      className="text-[10px] font-mono shrink-0 w-5 text-center"
                      style={{ color: "rgba(100, 116, 139, 0.5)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(index);
                            if (e.key === "Escape") setEditingIndex(null);
                          }}
                          style={{
                            ...inputStyle,
                            padding: "6px 12px",
                            fontSize: "13px",
                            border: "1px solid rgba(59, 130, 246, 0.5)",
                            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                          }}
                        />
                      ) : isDeleteConfirm ? (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: "#F87171" }} />
                          <span className="text-xs" style={{ color: "#FCA5A5" }}>
                            Delete <strong>"{cat}"</strong>? Projects using it won't be affected.
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              background: colorScheme.bg,
                              border: `1px solid ${colorScheme.border}`,
                              color: colorScheme.text,
                            }}
                          >
                            {cat}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(index)}
                            className="rounded-lg p-2 transition-all duration-200"
                            style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6EE7B7" }}
                            title="Save"
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(16, 185, 129, 0.2)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(16, 185, 129, 0.1)"; }}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="rounded-lg p-2 transition-all duration-200"
                            style={{ background: "rgba(8, 15, 31, 0.85)", border: "1px solid rgba(59, 130, 246, 0.15)", color: "rgba(148, 163, 184, 0.7)" }}
                            title="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : isDeleteConfirm ? (
                        <>
                          <button
                            onClick={() => handleDelete(index)}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                            style={{ background: "#DC2626", color: "#fff", border: "none" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#B91C1C"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#DC2626"; }}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmIndex(null)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
                            style={{
                              background: "rgba(8, 15, 31, 0.85)",
                              border: "1px solid rgba(59, 130, 246, 0.15)",
                              color: "rgba(148, 163, 184, 0.7)",
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(index)}
                            className="rounded-lg p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            style={{ background: "rgba(8, 15, 31, 0.85)", border: "1px solid rgba(59, 130, 246, 0.2)", color: "rgba(148, 163, 184, 0.7)" }}
                            title="Rename"
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563EB"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.85)"; (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)"; }}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => { setDeleteConfirmIndex(index); setEditingIndex(null); }}
                            className="rounded-lg p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            style={{ background: "rgba(8, 15, 31, 0.85)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#F87171" }}
                            title="Delete"
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#DC2626"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(8, 15, 31, 0.85)"; (e.currentTarget as HTMLElement).style.color = "#F87171"; }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CategoriesView;
