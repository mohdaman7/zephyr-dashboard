import React from "react";
import { Search, RefreshCw, Download, Menu, X, Wifi, WifiOff } from "lucide-react";

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
    <header
      className="sticky top-0 z-40"
      style={{
        background: "rgba(2, 8, 23, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
      }}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden rounded-xl p-2 transition-all duration-200"
            style={{
              background: "rgba(13, 22, 39, 0.6)",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              color: "rgba(148, 163, 184, 0.8)",
            }}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Search Box */}
          <div className="relative hidden sm:block w-64 md:w-80">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "rgba(100, 116, 139, 0.7)" }}
            />
            <input
              type="text"
              placeholder="Search projects, gallery, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2 text-xs transition-all duration-200 focus:outline-none"
              style={{
                background: "rgba(8, 15, 31, 0.8)",
                border: "1px solid rgba(59, 130, 246, 0.12)",
                color: "#E8F0FE",
                fontFamily: "Inter, sans-serif",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(59, 130, 246, 0.35)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.08)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(59, 130, 246, 0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Connection Status */}
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{
              background: isConnected
                ? "rgba(16, 185, 129, 0.08)"
                : "rgba(245, 158, 11, 0.08)",
              border: isConnected
                ? "1px solid rgba(16, 185, 129, 0.2)"
                : "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            {isConnected ? (
              <Wifi className="h-3.5 w-3.5" style={{ color: "#10B981" }} />
            ) : (
              <WifiOff className="h-3.5 w-3.5" style={{ color: "#F59E0B" }} />
            )}
            <span
              className="hidden sm:inline"
              style={{ color: isConnected ? "#34D399" : "#FCD34D" }}
            >
              {isConnected ? "API Live" : "Standalone"}
            </span>
            {isConnected && (
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "#10B981" }}
              />
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh Data"
            className="rounded-xl p-2 transition-all duration-200 disabled:opacity-50"
            style={{
              background: "rgba(8, 15, 31, 0.8)",
              border: "1px solid rgba(59, 130, 246, 0.12)",
              color: "rgba(148, 163, 184, 0.8)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.3)";
                (e.currentTarget as HTMLElement).style.color = "#60A5FA";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(59, 130, 246, 0.12)";
              (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.8)";
            }}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              style={{ color: loading ? "#60A5FA" : "inherit" }}
            />
          </button>

          {/* Backup Export Button */}
          <button
            onClick={onExportBackup}
            title="Export Backup JSON"
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#93C5FD",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)";
              (e.currentTarget as HTMLElement).style.color = "#ffffff";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)";
              (e.currentTarget as HTMLElement).style.color = "#93C5FD";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Backup Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
