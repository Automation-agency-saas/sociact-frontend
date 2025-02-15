import axiosInstance from './config';

export type PlatformType = 'youtube' | 'instagram' | 'twitter' | 'linkedin';

export interface SEOOptimizerRequest {
  platform: PlatformType;
  content_url?: string;
  content?: string;
}

export interface SEOOptimizerResponse {
  title?: string;
  description?: string;
  caption?: string;
  keywords: string[];
  hashtags: string[];
  suggestions: string[];
  seo_score: number;
  original_score: number;
}

export class SEOOptimizerService {
  static async optimizeContent(request: SEOOptimizerRequest): Promise<SEOOptimizerResponse> {
    try {
      const response = await axiosInstance.post<SEOOptimizerResponse>(
        '/api/v1/seo/optimize',
        request
      );

      const { seo_score, original_score } = response.data;
      

      // Create the optimized response with proper type casting
      const optimizedResponse: SEOOptimizerResponse = {
        title: response.data.title,
        description: response.data.description,
        caption: response.data.caption,
        keywords: response.data.keywords || [],
        hashtags: response.data.hashtags || [],
        suggestions: response.data.suggestions || [],
        seo_score: Number(seo_score),
        original_score: Number(original_score)
      };

      return optimizedResponse;
    } catch (error) {
      console.error('Error in SEO optimization:', error);
      throw error;
    }
  }
} 