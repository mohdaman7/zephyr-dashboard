import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { OverviewView } from "./components/OverviewView";
import { ProjectsView } from "./components/ProjectsView";
import { GalleryView } from "./components/GalleryView";
import { VideosView } from "./components/VideosView";
import { ServicesView } from "./components/ServicesView";
import { CategoriesView } from "./components/CategoriesView";
import { LoginPage } from "./components/LoginPage";
import type { ProjectItem, GalleryItem, VideoItem, ServiceItem } from "./types";
import {
  fetchProjects,
  fetchGallery,
  fetchVideos,
  fetchServices,
  checkBackendHealth,
} from "./services/api";
import { Toaster, toast } from "sonner";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("zephyr_auth") === "true";
  });

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAllData = async () => {
    setLoading(true);
    const health = await checkBackendHealth();
    setIsConnected(health);

    const [pList, gList, vList, sList] = await Promise.all([
      fetchProjects(),
      fetchGallery(),
      fetchVideos(),
      fetchServices(),
    ]);

    setProjects(pList);
    setGallery(gList);
    setVideos(vList);
    setServices(sList);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      projects,
      gallery,
      videos,
      services,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zephyr_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("System backup JSON exported!");
  };

  const handleLogout = () => {
    localStorage.removeItem("zephyr_auth");
    setIsAuthenticated(false);
    setActiveTab("overview");
    toast.success("Logged out successfully.");
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: "#080F1F",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "#E8F0FE",
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
      </>
    );
  }

  return (
    <div
      className="min-h-screen font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200"
      style={{ backgroundColor: "#020817", color: "#E8F0FE" }}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 right-0 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
        />
      </div>

      <Toaster
        position="top-right"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            background: "#080F1F",
            border: "1px solid rgba(59,130,246,0.2)",
            color: "#E8F0FE",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        gallery={gallery}
        videos={videos}
        services={services}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={handleLogout}
      />

      {/* Main Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        <Header
          isConnected={isConnected}
          onRefresh={loadAllData}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExportBackup={handleExportBackup}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <OverviewView
              projects={projects}
              gallery={gallery}
              videos={videos}
              services={services}
              isConnected={isConnected}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsView
              projects={projects}
              onRefresh={loadAllData}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "gallery" && (
            <GalleryView
              gallery={gallery}
              onRefresh={loadAllData}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "videos" && (
            <VideosView
              videos={videos}
              onRefresh={loadAllData}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "services" && (
            <ServicesView
              services={services}
              onRefresh={loadAllData}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "categories" && (
            <CategoriesView />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
