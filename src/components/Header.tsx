import React from "react";
import { Search, RefreshCw, Download, Activity, Menu, X, Sparkles } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
  onRefresh: () => void;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExportBackup: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  onRefresh,
  loading,
  searchQuery,
  setSearchQuery,
  onExportBackup,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0e]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="rounded-xl border border-white/10 p-2 text-neutral-400 lg:hidden hover:text-white"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Search Box */}
          <div className="relative hidden sm:block w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search projects, gallery, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-900/70 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Health Status Indicator */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs">
            <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span className="text-neutral-300 font-medium hidden sm:inline">
              {isConnected ? "Express API Live (5000)" : "Standalone Mode"}
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-neutral-900 p-2 text-neutral-300 transition hover:border-amber-500/40 hover:text-amber-400"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
          </button>

          <button
            onClick={onExportBackup}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500 hover:text-neutral-950"
            title="Export Backup JSON"
          >
            <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Backup Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
