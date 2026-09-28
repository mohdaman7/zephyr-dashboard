import type { ProjectItem, GalleryItem, VideoItem, ServiceItem, VideoResponse } from "../types";

// In dev: Vite proxy forwards /api → localhost:5000
// In production: VITE_API_URL must be set to the deployed backend URL (e.g. https://zephyr-wl4j.onrender.com/api)
const API_BASE = import.meta.env.VITE_API_URL ?? "/api";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "db1rnuqtp";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "cloud-upload";

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

/**
 * Compresses an image client-side to an optimized permanent Data URI.
 * Storing this in MongoDB ensures it never gets wiped by server restarts.
 */
export async function compressImageToDataUrl(file: File, maxWidth = 1920, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const webpData = canvas.toDataURL("image/webp", quality);
          if (webpData && webpData.startsWith("data:image/webp")) {
            resolve(webpData);
            return;
          }
        } catch {}
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(event.target?.result as string);
    };
    reader.onerror = () => resolve("");
  });
}

/**
 * Uploads media with permanent storage guarantee:
 * 1. If Cloudinary config exists, uploads to Cloudinary CDN.
 * 2. If it is an image, compresses to permanent Data URI (saved permanently in MongoDB).
 * 3. Fallback to backend /upload.
 */
export async function uploadMediaFile(file: File): Promise<string | null> {
  // 1. Cloudinary direct upload if configured
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.secure_url || data.url;
      }
    } catch (err) {
      console.warn("Cloudinary upload failed, using permanent fallback:", err);
    }
  }

  // 2. For image files: convert to permanent web-optimized Data URI
  if (file.type.startsWith("image/")) {
    try {
      const permanentDataUrl = await compressImageToDataUrl(file);
      if (permanentDataUrl) return permanentDataUrl;
    } catch (err) {
      console.warn("Image compression failed, trying server upload:", err);
    }
  }

  // 3. Fallback to backend /upload endpoint
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

// CATEGORIES
export async function fetchCategories(): Promise<string[]> {
  const data = await fetchJson<{ name: string }[] | string[]>(`${API_BASE}/categories`);
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => (typeof item === "string" ? item : item.name));
  }
  return [];
}

export async function createCategory(name: string): Promise<boolean> {
  const res = await fetchJson<{ success: boolean; name: string }>(`${API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return !!res;
}

export async function deleteCategory(name: string): Promise<boolean> {
  const res = await fetchJson<{ success: boolean }>(`${API_BASE}/categories/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
  return !!res?.success;
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
