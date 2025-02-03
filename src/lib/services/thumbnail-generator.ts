import axiosInstance from "./config";

export interface ThumbnailStyle {
  MODERN: 'modern';
  MINIMAL: 'minimal';
  VIBRANT: 'vibrant';
  PROFESSIONAL: 'professional';
  CREATIVE: 'creative';
}

// Constants for style values
export const THUMBNAIL_STYLES = {
  MODERN: 'modern',
  MINIMAL: 'minimal',
  VIBRANT: 'vibrant',
  PROFESSIONAL: 'professional',
  CREATIVE: 'creative'
} as const;

export type ThumbnailStyleValue = typeof THUMBNAIL_STYLES[keyof typeof THUMBNAIL_STYLES];

export interface GenerateThumbnailRequest {
  prompt: string;
  style: ThumbnailStyleValue;
  youtube_url?: string;
  image_base64?: string;
}

export interface EditThumbnailRequest {
  prompt: string;
  style: ThumbnailStyleValue;
  image_base64: string;
  selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ThumbnailResponse {
  url: string | null;
  status: string;
  message?: string;
}

class ThumbnailGeneratorService {
  private readonly baseUrl = '/api/v1/thumbnail';

  async generateThumbnail(data: GenerateThumbnailRequest): Promise<ThumbnailResponse> {
    try {
      const response = await axiosInstance.post<ThumbnailResponse>(
        `${this.baseUrl}/generate`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async editThumbnailArea(data: EditThumbnailRequest): Promise<ThumbnailResponse> {
    try {
      const response = await axiosInstance.post<ThumbnailResponse>(
        `${this.baseUrl}/edit`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const thumbnailGeneratorService = new ThumbnailGeneratorService();
