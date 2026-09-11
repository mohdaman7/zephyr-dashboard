import type { ProjectItem, GalleryItem, VideoItem, ServiceItem, VideoResponse } from "../types";

// In dev: Vite proxy forwards /api → localhost:5000
// In production: VITE_API_URL must be set to the deployed backend URL (e.g. https://zephyr-wl4j.onrender.com/api)
const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API request failed for ${url}:`, err);
    return null;
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  const data = await fetchJson<{ status: string }>(`${API_BASE}/health`);
  return data?.status === "ok";
}

export async function uploadMediaFile(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  } catch (err) {
    console.error("Error uploading file:", err);
    return null;
  }
}

// PROJECTS
export async function fetchProjects(): Promise<ProjectItem[]> {
  return (await fetchJson<ProjectItem[]>(`${API_BASE}/projects`)) || [];
}

export async function createProject(project: Partial<ProjectItem>): Promise<ProjectItem | null> {
  return await fetchJson<ProjectItem>(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
}

export async function updateProject(id: string, project: Partial<ProjectItem>): Promise<ProjectItem | null> {
  return await fetchJson<ProjectItem>(`${API_BASE}/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
}

export async function deleteProject(id: string): Promise<boolean> {
  const res = await fetchJson<{ success: boolean }>(`${API_BASE}/projects/${id}`, {
    method: "DELETE",
  });
  return !!res?.success;
}

// GALLERY
export async function fetchGallery(): Promise<GalleryItem[]> {
  return (await fetchJson<GalleryItem[]>(`${API_BASE}/gallery`)) || [];
}

export async function createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem | null> {
  return await fetchJson<GalleryItem>(`${API_BASE}/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

export async function updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem | null> {
  return await fetchJson<GalleryItem>(`${API_BASE}/gallery/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const res = await fetchJson<{ success: boolean }>(`${API_BASE}/gallery/${id}`, {
    method: "DELETE",
  });
  return !!res?.success;
}

// VIDEOS (MAX 3 FIFO)
export async function fetchVideos(): Promise<VideoItem[]> {
  return (await fetchJson<VideoItem[]>(`${API_BASE}/videos`)) || [];
}

export async function createVideo(video: Partial<VideoItem>): Promise<VideoResponse | null> {
  return await fetchJson<VideoResponse>(`${API_BASE}/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(video),
  });
}

export async function updateVideo(id: string, video: Partial<VideoItem>): Promise<VideoItem | null> {
  return await fetchJson<VideoItem>(`${API_BASE}/videos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(video),
  });
}

export async function deleteVideo(id: string): Promise<boolean> {
  const res = await fetchJson<{ success: boolean }>(`${API_BASE}/videos/${id}`, {
    method: "DELETE",
  });
  return !!res?.success;
}

// SERVICES
export async function fetchServices(): Promise<ServiceItem[]> {
  return (await fetchJson<ServiceItem[]>(`${API_BASE}/services`)) || [];
}

export async function createService(service: Partial<ServiceItem>): Promise<ServiceItem | null> {
  return await fetchJson<ServiceItem>(`${API_BASE}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
}

export async function updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem | null> {
  return await fetchJson<ServiceItem>(`${API_BASE}/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
}

export async function deleteService(id: string): Promise<boolean> {
  const res = await fetchJson<{ success: boolean }>(`${API_BASE}/services/${id}`, {
    method: "DELETE",
  });
  return !!res?.success;
}
