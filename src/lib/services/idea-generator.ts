import apiClient from './config';

export type PlatformType = 'youtube' | 'instagram' | 'twitter' | 'linkedin';
export type GenerationType = 'preferences' | 'custom' | 'surprise';

// Platform-specific preference types
export interface InstagramPreferences {
    content_type: string;
    niche: string;
    target_audience: string;
    engagement_style: string;
}

export interface YouTubePreferences {
    genre: string;
    target_audience: string;
    video_type: string;
    focus_area: string;
}

export interface TwitterPreferences {
    thread_type: string;
    topic: string;
    tone_of_voice: string;
}

export interface LinkedInPreferences {
    post_type: string;
    target_audience: string;
    content_focus: string;
    engagement_goal: string;
}

// Request types
export interface PreferencesRequest {
    platform: PlatformType;
    preferences: InstagramPreferences | YouTubePreferences | TwitterPreferences | LinkedInPreferences;
}

export interface CustomRequest {
    platform: PlatformType;
    prompt: string;
}

export interface SurpriseRequest {
    platform: PlatformType;
}

// Response types
export interface IdeaGeneration {
    id: string;
    platform: PlatformType;
    generation_type: GenerationType;
    preferences: Record<string, any>;
    ideas: Record<string, any>[];
    created_at: string;
    genre?: string;
    target_audience?: string;
    video_type?: string;
    focus_area?: string;
}

export interface IdeaHistoryResponse {
    items: IdeaGeneration[];
}

export const ideaGeneratorService = {
    generateFromPreferences: async (platform: PlatformType, preferences: any): Promise<IdeaGeneration> => {
        try {
            const response = await apiClient.post<IdeaGeneration>(
                `/api/v1/ideas/${platform}/preferences`,
                { platform, preferences }
            );
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message ||
                               error.message ||
                               'Failed to generate ideas';
            throw new Error(errorMessage);
        }
    },

    generateCustom: async (platform: PlatformType, prompt: string): Promise<IdeaGeneration> => {
        try {
            const response = await apiClient.post<IdeaGeneration>(
                `/api/v1/ideas/${platform}/custom`,
                { platform, prompt }
            );
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message ||
                               error.message ||
                               'Failed to generate ideas';
            throw new Error(errorMessage);
        }
    },

    generateSurprise: async (platform: PlatformType): Promise<IdeaGeneration> => {
        try {
            const response = await apiClient.post<IdeaGeneration>(
                `/api/v1/ideas/${platform}/surprise`,
                { platform }
            );
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message ||
                               error.message ||
                               'Failed to generate ideas';
            throw new Error(errorMessage);
        }
    },

    getHistory: async (platform: PlatformType): Promise<IdeaHistoryResponse> => {
        try {
            const response = await apiClient.get<IdeaHistoryResponse>(
                `/api/v1/ideas/${platform}/history`
            );
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message ||
                               error.message ||
                               'Failed to fetch idea history';
            throw new Error(errorMessage);
        }
    },

    deleteIdea: async (platform: PlatformType, ideaId: string): Promise<void> => {
        try {
            await apiClient.delete(`/api/v1/ideas/${platform}/${ideaId}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message ||
                               error.message ||
                               'Failed to delete idea';
            throw new Error(errorMessage);
        }
    }
}; 