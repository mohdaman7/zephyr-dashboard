export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  description?: string;
  year?: string;
  area?: string;
  client?: string;
  materials?: string;
  additionalImages?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  createdAt?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  src: string;
  createdAt?: string;
}

export interface ServiceItem {
  id: string;
  n: string;
  title: string;
  body: string;
  active?: boolean;
}

export interface VideoResponse {
  success: boolean;
  video: VideoItem;
  replacedVideo?: VideoItem | null;
  totalCount: number;
  maxLimit: number;
}

export const TYPES_VERSION = "1.0.0";
