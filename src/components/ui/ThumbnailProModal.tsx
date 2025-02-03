import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Upload, Image as ImageIcon, Wand2, Loader2, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { thumbnailGeneratorService, ThumbnailStyle } from '../../lib/services/thumbnail-generator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

interface ThumbnailProModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STYLE_OPTIONS: { value: ThumbnailStyle; label: string; description: string }[] = [
    {
        value: 'modern',
        label: 'Modern',
        description: 'Clean, sleek, and contemporary design'
    },
    {
        value: 'minimal',
        label: 'Minimal',
        description: 'Simple and uncluttered layout'
    },
    {
        value: 'vibrant',
        label: 'Vibrant',
        description: 'Bold colors and dynamic elements'
    },
    {
        value: 'professional',
        label: 'Professional',
        description: 'Polished and business-ready look'
    },
    {
        value: 'creative',
        label: 'Creative',
        description: 'Artistic and unique design'
    }
];

export function ThumbnailProModal({ isOpen, onClose }: ThumbnailProModalProps) {
    // Common states
    const [style, setStyle] = useState<ThumbnailStyle>('modern');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [videoDetails, setVideoDetails] = useState<{ title: string; channel: string } | null>(null);

    // YouTube specific states
    const [youtubeUrl, setYoutubeUrl] = useState('');

    // Image upload specific states
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const handleYoutubeUrl = async () => {
        if (!youtubeUrl) {
            toast.error('Please enter a YouTube URL');
            return;
        }

        setIsLoading(true);
        try {
            const result = await thumbnailGeneratorService.getYouTubeThumbnail(youtubeUrl);
            if (result.status === 'success') {
                // Use base64 thumbnail if available, fallback to URL
                const imageUrl = result.thumbnail_base64 
                    ? `data:image/jpeg;base64,${result.thumbnail_base64}`
                    : result.thumbnail_url;
                setPreviewUrl(imageUrl);
                setVideoDetails({
                    title: result.title,
                    channel: result.channel_name
                });
                toast.success('YouTube thumbnail fetched successfully!');
            } else {
                throw new Error(result.message || 'Failed to fetch YouTube thumbnail');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to fetch YouTube thumbnail');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnhance = async () => {
        if (!previewUrl || !prompt) {
            toast.error('Please provide both an image and enhancement prompt');
            return;
        }

        setIsLoading(true);
        try {
            let image_base64: string;
            if (file) {
                image_base64 = await thumbnailGeneratorService.fileToBase64(file);
            } else {
                // For YouTube thumbnails or data URLs, extract base64 content
                if (previewUrl.startsWith('data:image')) {
                    // Extract base64 from data URL
                    image_base64 = previewUrl.split(',')[1];
                } else {
                    toast.error('Invalid image data');
                    return;
                }
            }

            const result = await thumbnailGeneratorService.enhanceImage({
                image_base64,
                prompt,
                style
            });

            if (result.status === 'success' && result.url) {
                setGeneratedUrl(result.url);
                toast.success('Thumbnail enhanced successfully!');
            } else {
                throw new Error(result.message || 'Failed to enhance thumbnail');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to enhance thumbnail');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        const url = generatedUrl || previewUrl;
        if (!url) return;

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'thumbnail.png';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            toast.error('Failed to download thumbnail');
        }
    };

    const handleClose = () => {
        setYoutubeUrl('');
        setFile(null);
        setPreviewUrl('');
        setPrompt('');
        setStyle('modern');
        setGeneratedUrl(null);
        setVideoDetails(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ThumbnailPro</DialogTitle>
                    <DialogDescription>
                        Enhance your YouTube thumbnails with AI
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="youtube" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="youtube">YouTube URL</TabsTrigger>
                        <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    </TabsList>

                    <TabsContent value="youtube" className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">YouTube URL</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter YouTube video URL"
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                />
                                <Button
                                    onClick={handleYoutubeUrl}
                                    disabled={!youtubeUrl || isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ImageIcon className="h-4 w-4" />
                                    )}
                                    Fetch
                                </Button>
                            </div>
                        </div>

                        {videoDetails && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">{videoDetails.title}</p>
                                <p className="text-sm text-muted-foreground">{videoDetails.channel}</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-4">
                        <div className="relative space-y-2">
                            <label className="text-sm font-medium">Upload Image</label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    className={cn(
                                        "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50",
                                        file && "border-primary"
                                    )}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </TabsContent>

                    {previewUrl && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Preview</label>
                                <div className="relative w-full bg-black rounded-lg border overflow-hidden">
                                    <div className="aspect-[16/9] relative">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className={cn(
                                                "absolute inset-0 w-full h-full",
                                                "object-contain object-center"
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Enhancement Prompt</label>
                                <Textarea
                                    placeholder="Describe how you want to enhance the thumbnail..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Style</label>
                                <Select value={style} onValueChange={(value) => setStyle(value as ThumbnailStyle)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a style" />
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

                            {generatedUrl && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Enhanced Thumbnail</label>
                                    <div className="relative w-full bg-black rounded-lg border overflow-hidden">
                                        <div className="aspect-[16/9] relative">
                                            <img
                                                src={generatedUrl}
                                                alt="Enhanced thumbnail"
                                                className={cn(
                                                    "absolute inset-0 w-full h-full",
                                                    "object-contain object-center"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        {previewUrl && (
                            generatedUrl ? (
                                <Button onClick={handleDownload}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleEnhance}
                                    disabled={!prompt || isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enhancing...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="mr-2 h-4 w-4" />
                                            Enhance
                                        </>
                                    )}
                                </Button>
                            )
                        )}
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}