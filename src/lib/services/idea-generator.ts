import apiClient from './config';

export type PlatformType = 'youtube' | 'instagram' | 'twitter' | 'linkedin';
export type DifficultyType = 'Easy' | 'Medium' | 'Hard';

export interface GeneratedIdea {
    title: string;
    description: string;
    engagement: string;
    difficulty: DifficultyType;
}

export interface IdeaGeneratorRequest {
    platform: PlatformType;
    genres: string[];
}

export interface IdeaGeneratorResponse {
    ideas: GeneratedIdea[];
}

export const ideaGeneratorService = {
    generateIdeas: async (request: IdeaGeneratorRequest): Promise<IdeaGeneratorResponse> => {
        try {
            const response = await apiClient.post<IdeaGeneratorResponse>(
                '/api/v1/idea-generator/generate',
                request
            );
            
            // Validate response data
            if (!response.data || !response.data.ideas || !Array.isArray(response.data.ideas)) {
                throw new Error('Invalid response format from server');
            }
            
            return response.data;
        } catch (error: any) {
            // Extract error message from the API response if available
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message ||
                               error.message ||
                               'Failed to generate ideas';
            console.error('Idea generation error:', error);
            throw new Error(errorMessage);
        }
    }
}; 