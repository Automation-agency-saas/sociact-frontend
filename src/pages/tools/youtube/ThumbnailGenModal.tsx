import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Wand2, Loader2, Download, Image as ImageIcon, Palette, RefreshCw } from 'lucide-react';
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

type Step = 'input' | 'generating' | 'results';

const loadingMessages = [
    "Analyzing your thumbnail requirements...",
    "Crafting the background scene...",
    "Designing text layout and style...",
    "Optimizing visual elements...",
    "Adding finishing touches...",
    "Finalizing your thumbnail..."
];

export function ThumbnailGenPage() {
    const [backgroundPrompt, setBackgroundPrompt] = useState('');
    const [textPrompt, setTextPrompt] = useState('');
    const [style, setStyle] = useState<ThumbnailStyle>('modern');
    const [currentStep, setCurrentStep] = useState<Step>('input');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!backgroundPrompt || !textPrompt) {
            toast.error('Please provide both background and text descriptions');
            return;
        }

        setCurrentStep('generating');
        setLoadingProgress(0);
        setLoadingMessageIndex(0);
        setError(null);

        const intervals = {
            initial: { target: 85, speed: 50, increment: 1 },
            slow: { target: 98, speed: 500, increment: 2 },
        };

        let loadingInterval: NodeJS.Timeout | null = null;
        const startLoading = () => {
            loadingInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= intervals.slow.target) {
                        if (loadingInterval) clearInterval(loadingInterval);
                        return prev;
                    }
                    if (prev >= intervals.initial.target) {
                        if (loadingInterval) clearInterval(loadingInterval);
                        startSlowProgress();
                        return prev;
                    }
                    return prev + intervals.initial.increment;
                });
                setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
            }, intervals.initial.speed);
        };

        const startSlowProgress = () => {
            loadingInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= intervals.slow.target) {
                        if (loadingInterval) clearInterval(loadingInterval);
                        return prev;
                    }
                    return prev + intervals.slow.increment;
                });
                setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
            }, intervals.slow.speed);
        };

        startLoading();

        try {
            const result = await thumbnailGenService.generateThumbnail({
                backgroundPrompt,
                textPrompt,
                style
            });

            if (result.status === 'success' && result.url) {
                setLoadingProgress(100);
                await new Promise(resolve => setTimeout(resolve, 500));
                setGeneratedUrl(result.url);
                setCurrentStep('results');
                toast.success('Thumbnail generated successfully!');
            } else {
                throw new Error(result.message || 'Failed to generate thumbnail');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate thumbnail';
            setError(errorMessage);
            toast.error(errorMessage);
            setCurrentStep('input');
        } finally {
            if (loadingInterval) clearInterval(loadingInterval);
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
        setCurrentStep('input');
        setGeneratedUrl(null);
        setError(null);
    };

    return (
        <ToolLayout>
            <div className="container mx-auto py-6 space-y-8">
                <ToolTitle 
                    title="YouTube Thumbnail Generator" 
                    description="Create stunning YouTube thumbnails from your descriptions"
                />

                <div className="grid gap-6 pb-20">
                    {currentStep === 'input' && (
                        <Card className="mx-auto max-w-6xl pb-6 w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 mb-3">
                                    <ImageIcon className="h-6 w-6 text-primary" />
                                    Thumbnail Content
                                </CardTitle>
                                <CardDescription>
                                    Describe your desired thumbnail elements
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
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

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Visual Style</label>
                                    <Select value={style} onValueChange={(value: ThumbnailStyle) => setStyle(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STYLE_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex flex-row items-center">
                                                        <span className="font-medium">{option.label}</span>
                                                        <span className='mx-2 md:mx-5'></span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {option.description}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    onClick={handleGenerate}
                                    disabled={!backgroundPrompt || !textPrompt}
                                    className="w-full bg-primary hover:bg-primary/90"
                                >
                                    <Wand2 className="mr-2  h-4 w-4" />
                                    Generate Thumbnail
                                </Button>

                                {error && (
                                    <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                                        {error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {currentStep === 'generating' && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-6">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ImageIcon className="w-12 h-12 text-primary animate-pulse" />
                                </div>
                                <div className="absolute inset-0">
                                    <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                                        <circle
                                            className="text-primary/20"
                                            strokeWidth="8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="42"
                                            cx="50"
                                            cy="50"
                                        />
                                        <circle
                                            className="text-primary"
                                            strokeWidth="8"
                                            strokeDasharray={264}
                                            strokeDashoffset={264 - (loadingProgress / 100) * 264}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="42"
                                            cx="50"
                                            cy="50"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-medium text-primary">
                                    {loadingMessages[loadingMessageIndex]}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {loadingProgress}% complete
                                </p>
                            </div>
                        </div>
                    )}

                    {currentStep === 'results' && generatedUrl && (
                        <Card className="mx-auto max-w-6xl w-full">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Generated Thumbnail</h3>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleDownload}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                        <Button
                                            onClick={handleReset}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Generate New
                                        </Button>
                                    </div>
                                </div>
                                <div className="aspect-video overflow-hidden rounded-lg">
                                    <img
                                        src={generatedUrl}
                                        alt="Generated thumbnail"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
}