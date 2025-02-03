import axiosInstance from "./config";

export type ThumbnailStyle = 'modern' | 'classic' | 'vibrant' | 'minimal' | 'dramatic';

export interface ThumbnailGenRequest {
  backgroundPrompt: string;
  textPrompt: string;
  style: ThumbnailStyle;
}

export interface ThumbnailGenResponse {
  url: string | null;
  status: string;
  message?: string;
}

class ThumbnailGenService {
  private readonly baseUrl = '/api/v1/thumbnail-gen';

  async generateThumbnail(data: ThumbnailGenRequest): Promise<ThumbnailGenResponse> {
    try {
      const response = await axiosInstance.post<ThumbnailGenResponse>(
        `${this.baseUrl}/generate`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const thumbnailGenService = new ThumbnailGenService(); 