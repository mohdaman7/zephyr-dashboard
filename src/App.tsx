import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { OverviewView } from "./components/OverviewView";
import { ProjectsView } from "./components/ProjectsView";
import { GalleryView } from "./components/GalleryView";
import { VideosView } from "./components/VideosView";
import { ServicesView } from "./components/ServicesView";
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
    loadAllData();
  }, []);

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

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-neutral-100 font-sans antialiased selection:bg-amber-500 selection:text-neutral-950">
      <Toaster position="top-right" theme="dark" richColors />

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
      />

      {/* Main Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
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
        </main>
      </div>
    </div>
  );
}

export default App;
