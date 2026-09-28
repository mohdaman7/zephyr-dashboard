import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, ChevronDown, Plus, Check, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createCategory } from "../services/api";

const TAG_PALETTES = [
  { bg: "rgba(37, 99, 235, 0.15)", border: "rgba(59, 130, 246, 0.4)", text: "#93C5FD", dot: "#60A5FA" },
  { bg: "rgba(124, 58, 237, 0.15)", border: "rgba(139, 92, 246, 0.4)", text: "#C4B5FD", dot: "#A78BFA" },
  { bg: "rgba(5, 150, 105, 0.15)", border: "rgba(16, 185, 129, 0.4)", text: "#6EE7B7", dot: "#34D399" },
  { bg: "rgba(217, 119, 6, 0.15)", border: "rgba(245, 158, 11, 0.4)", text: "#FCD34D", dot: "#FBBF24" },
  { bg: "rgba(220, 38, 38, 0.15)", border: "rgba(239, 68, 68, 0.4)", text: "#FCA5A5", dot: "#F87171" },
  { bg: "rgba(8, 145, 178, 0.15)", border: "rgba(6, 182, 212, 0.4)", text: "#67E8F9", dot: "#22D3EE" },
  { bg: "rgba(190, 24, 93, 0.15)", border: "rgba(236, 72, 153, 0.4)", text: "#F9A8D4", dot: "#F472B6" },
  { bg: "rgba(101, 163, 13, 0.15)", border: "rgba(132, 204, 22, 0.4)", text: "#BEF264", dot: "#A3E635" },
];

function getCategoryPalette(name: string, index?: number) {
  if (typeof index === "number") return TAG_PALETTES[index % TAG_PALETTES.length];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_PALETTES[Math.abs(hash) % TAG_PALETTES.length];
}

interface PremiumCategorySelectProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onAddNewCategory?: (newCategory: string) => void;
  label?: string;
  placeholder?: string;
}

export const PremiumCategorySelect: React.FC<PremiumCategorySelectProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddNewCategory,
  label = "Category",
  placeholder = "Select or create category...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [newCatInput, setNewCatInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setSearchFilter("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(searchFilter.trim().toLowerCase())
  );

  const activePalette = getCategoryPalette(selectedCategory);

  const handleCreateNew = async () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) {
      toast.error("Category name cannot be empty");
      return;
    }

    const existingMatch = categories.find((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (existingMatch) {
      onSelectCategory(existingMatch);
      setIsOpen(false);
      setIsCreating(false);
      setNewCatInput("");
      toast.info(`Selected existing category "${existingMatch}".`);
      return;
    }

    // Add and persist
    createCategory(trimmed);
    if (onAddNewCategory) {
      onAddNewCategory(trimmed);
    }
    onSelectCategory(trimmed);
    setIsOpen(false);
    setIsCreating(false);
    setNewCatInput("");
    toast.success(`Category "${trimmed}" created & selected!`);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label
          className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
          style={{ color: "rgba(148, 163, 184, 0.9)" }}
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-200"
        style={{
          background: "rgba(5, 11, 24, 0.9)",
          border: isOpen
            ? "1px solid rgba(59, 130, 246, 0.5)"
            : "1px solid rgba(59, 130, 246, 0.18)",
          boxShadow: isOpen ? "0 0 0 3px rgba(59, 130, 246, 0.15), 0 8px 24px rgba(0,0,0,0.4)" : "none",
          outline: "none",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
            style={{
              backgroundColor: activePalette.dot,
              boxShadow: `0 0 8px ${activePalette.dot}`,
            }}
          />
          {selectedCategory ? (
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full truncate"
              style={{
                background: activePalette.bg,
                border: `1px solid ${activePalette.border}`,
                color: activePalette.text,
              }}
            >
              {selectedCategory}
            </span>
          ) : (
            <span className="text-xs" style={{ color: "rgba(148, 163, 184, 0.6)" }}>
              {placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform duration-300"
          style={{
            color: isOpen ? "#60A5FA" : "rgba(148, 163, 184, 0.6)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "#050B18",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(59, 130, 246, 0.15)",
            }}
          >
            {/* Search / Filter bar */}
            <div
              className="p-2.5 border-b"
              style={{ borderColor: "rgba(59, 130, 246, 0.12)", background: "rgba(8, 15, 31, 0.7)" }}
            >
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5" style={{ color: "rgba(100, 116, 139, 0.8)" }} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Filter or search category..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg outline-none transition-all"
                  style={{
                    background: "rgba(5, 11, 24, 0.8)",
                    border: "1px solid rgba(59, 130, 246, 0.15)",
                    color: "#E8F0FE",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredCategories.length === 0 && searchFilter.trim()) {
                      e.preventDefault();
                      setNewCatInput(searchFilter.trim());
                      setIsCreating(true);
                    }
                  }}
                />
              </div>
            </div>

            {/* Categories List */}
            <div className="max-h-52 overflow-y-auto p-1.5 space-y-1">
              {filteredCategories.length === 0 ? (
                <div className="py-4 text-center px-3">
                  <p className="text-xs" style={{ color: "rgba(148, 163, 184, 0.7)" }}>
                    No matching category found for "{searchFilter}"
                  </p>
                  {!isCreating && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewCatInput(searchFilter);
                        setIsCreating(true);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all"
                      style={{
                        background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                        boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
                      }}
                    >
                      <Plus className="h-3 w-3" /> Create "{searchFilter}"
                    </button>
                  )}
                </div>
              ) : (
                filteredCategories.map((cat, idx) => {
                  const palette = getCategoryPalette(cat, idx);
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat);
                        setIsOpen(false);
                        setSearchFilter("");
                      }}
                      className="group flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs transition-all duration-150 text-left"
                      style={{
                        background: isSelected
                          ? "rgba(59, 130, 246, 0.18)"
                          : "transparent",
                        border: isSelected
                          ? "1px solid rgba(59, 130, 246, 0.35)"
                          : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.08)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: palette.dot }}
                        />
                        <span
                          className="font-medium truncate"
                          style={{ color: isSelected ? "#93C5FD" : "#E8F0FE" }}
                        >
                          {cat}
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#60A5FA" }} />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick Create Category Bottom Area */}
            <div
              className="p-2.5 border-t"
              style={{ borderColor: "rgba(59, 130, 246, 0.12)", background: "rgba(8, 15, 31, 0.9)" }}
            >
              {isCreating ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type category name..."
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateNew();
                        }
                        if (e.key === "Escape") {
                          setIsCreating(false);
                        }
                      }}
                      autoFocus
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg outline-none"
                      style={{
                        background: "rgba(5, 11, 24, 0.95)",
                        border: "1px solid rgba(59, 130, 246, 0.4)",
                        color: "#E8F0FE",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCreateNew}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200"
                      style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px]" style={{ color: "rgba(148, 163, 184, 0.6)" }}>
                    <span>Press Enter to save</span>
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="hover:underline text-red-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={{
                    background: "rgba(37, 99, 235, 0.12)",
                    border: "1px dashed rgba(59, 130, 246, 0.3)",
                    color: "#93C5FD",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(37, 99, 235, 0.22)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 130, 246, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(37, 99, 235, 0.12)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 130, 246, 0.3)";
                  }}
                >
                  <Plus className="h-3.5 w-3.5" /> Create New Category
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
