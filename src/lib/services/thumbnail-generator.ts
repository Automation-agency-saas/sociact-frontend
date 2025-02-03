import axiosInstance from "./config";

export type ThumbnailStyle = 'modern' | 'minimal' | 'vibrant' | 'professional' | 'creative';

export interface YouTubeThumbnailRequest {
  video_url: string;
}

export interface YouTubeThumbnailResponse {
  thumbnail_url: string;
  title: string;
  channel_name: string;
  status: string;
  message?: string;
  thumbnail_base64?: string;
}

export interface ImageEnhanceRequest {
  image_base64: string;
  prompt: string;
  style: ThumbnailStyle;
}

export interface ThumbnailResponse {
  url: string | null;
  status: string;
  message?: string;
}

class ThumbnailGeneratorService {
  private readonly baseUrl = '/api/v1/thumbnail';

  async getYouTubeThumbnail(videoUrl: string): Promise<YouTubeThumbnailResponse> {
    try {
      const response = await axiosInstance.post<YouTubeThumbnailResponse>(
        `${this.baseUrl}/youtube`,
        { video_url: videoUrl }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async enhanceImage(data: ImageEnhanceRequest): Promise<ThumbnailResponse> {
    try {
      const response = await axiosInstance.post<ThumbnailResponse>(
        `${this.baseUrl}/enhance`,
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
