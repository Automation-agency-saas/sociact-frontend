import axiosInstance from "./config";

interface GenerateThumbnailRequest {
  prompt: string;
  image?: File;
  youtube_url?: string;
}

interface EditThumbnailRequest {
  image: File;
  prompt: string;
  selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ThumbnailResponse {
  url: string;
  status: string;
  message?: string;
}

class ThumbnailGeneratorService {
  async generateThumbnail(
    request: GenerateThumbnailRequest
  ): Promise<ThumbnailResponse> {
    const formData = new FormData();
    formData.append("prompt", request.prompt);

    if (request.image) {
      formData.append("image", request.image);
    }

    if (request.youtube_url) {
      formData.append("youtube_url", request.youtube_url);
    }

    const response = await axiosInstance.post<ThumbnailResponse>(
      "/api/v1/thumbnails/generate",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  async editThumbnail(
    request: EditThumbnailRequest
  ): Promise<ThumbnailResponse> {
    const formData = new FormData();
    formData.append("image", request.image);
    formData.append("prompt", request.prompt);
    formData.append("selection", JSON.stringify(request.selection));

    const response = await axiosInstance.post<ThumbnailResponse>(
      "/api/v1/thumbnails/edit",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }
}

export const thumbnailGeneratorService = new ThumbnailGeneratorService();
