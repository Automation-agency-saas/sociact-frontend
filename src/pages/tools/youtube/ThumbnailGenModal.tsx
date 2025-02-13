import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Wand2, Loader2, Download, Image as ImageIcon, Palette } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { thumbnailGenService } from '../../../lib/services/thumbnail-gen';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { cn } from '../../../lib/utils';
import { ToolLayout } from "../../../components/tool-page/ToolLayout";
import { ToolTitle } from "@/components/ui/tool-title";

type ThumbnailStyle = 'modern' | 'classic' | 'vibrant' | 'minimal' | 'dramatic';

const STYLE_OPTIONS: { value: ThumbnailStyle; label: string; description: string }[] = [
    {
        value: 'modern',
        label: 'Modern',
        description: 'Clean, sleek, and contemporary design'
    },
    {
        value: 'classic',
        label: 'Classic',
        description: 'Timeless and elegant appearance'
    },
    {
        value: 'vibrant',
        label: 'Vibrant',
        description: 'Bold colors and dynamic elements'
    },
    {
        value: 'minimal',
        label: 'Minimal',
        description: 'Simple and uncluttered layout'
    },
    {
        value: 'dramatic',
        label: 'Dramatic',
        description: 'High contrast and cinematic feel'
    }
];

export function ThumbnailGenPage() {
    const [backgroundPrompt, setBackgroundPrompt] = useState('');
    const [textPrompt, setTextPrompt] = useState('');
    const [style, setStyle] = useState<ThumbnailStyle>('modern');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!backgroundPrompt || !textPrompt) {
            toast.error('Please provide both background and text descriptions');
            return;
        }

        setIsLoading(true);

        try {
            const result = await thumbnailGenService.generateThumbnail({
                backgroundPrompt,
                textPrompt,
                style
            });

            if (result.status === 'success' && result.url) {
                setGeneratedUrl(result.url);
                toast.success('Thumbnail generated successfully!');
            } else {
                throw new Error(result.message || 'Failed to generate thumbnail');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate thumbnail';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!generatedUrl) return;

        try {
            const response = await fetch(generatedUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'thumbnail.png';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Thumbnail downloaded successfully!');
        } catch (error) {
            toast.error('Failed to download thumbnail');
        }
    };

    const handleReset = () => {
        setBackgroundPrompt('');
        setTextPrompt('');
        setStyle('modern');
        setGeneratedUrl(null);
    };

    return (
        <ToolLayout>
            <div className="container mx-auto py-6 space-y-8">
                <ToolTitle 
                    title="YouTube Thumbnail Generator" 
                    description="Create stunning YouTube thumbnails from your descriptions"
                />

                <div className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Content Input Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                    Thumbnail Content
                                </CardTitle>
                                <CardDescription>
                                    Describe your desired thumbnail elements
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Background Description</label>
                                    <Textarea
                                        placeholder="Describe the background scene or image (e.g., 'A serene mountain landscape at sunset with dramatic clouds')"
                                        value={backgroundPrompt}
                                        onChange={(e) => setBackgroundPrompt(e.target.value)}
                                        rows={3}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Text Content</label>
                                    <Textarea
                                        placeholder="What text should appear on the thumbnail? (e.g., 'TOP 10 SECRETS')"
                                        value={textPrompt}
                                        onChange={(e) => setTextPrompt(e.target.value)}
                                        rows={2}
                                        className="resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Style Settings Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-5 w-5 text-primary" />
                                    Style Settings
                                </CardTitle>
                                <CardDescription>
                                    Choose the visual style for your thumbnail
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Visual Style</label>
                                    <Select value={style} onValueChange={(value: ThumbnailStyle) => setStyle(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STYLE_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{option.label}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {option.description}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={isLoading || !backgroundPrompt || !textPrompt}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="mr-2 h-4 w-4" />
                                                Generate Thumbnail
                                            </>
                                        )}
                                    </Button>

                                    {generatedUrl && (
                                        <Button
                                            onClick={handleDownload}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Thumbnail
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Generated Thumbnail Preview */}
                    {generatedUrl && (
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold">Generated Thumbnail</h3>
                                <div className="mt-4 aspect-video overflow-hidden rounded-lg">
                                    <img
                                        src={generatedUrl}
                                        alt="Generated thumbnail"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
}