import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
import { Textarea } from './textarea';
import { Wand2, Loader2, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { thumbnailGenService } from '../../lib/services/thumbnail-gen';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '../../lib/utils';

interface ThumbnailGenModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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

export function ThumbnailGenModal({ isOpen, onClose }: ThumbnailGenModalProps) {
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
            toast.error(error instanceof Error ? error.message : 'Failed to generate thumbnail');
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
        } catch (error) {
            toast.error('Failed to download thumbnail');
        }
    };

    const handleClose = () => {
        setBackgroundPrompt('');
        setTextPrompt('');
        setStyle('modern');
        setGeneratedUrl(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ThumbnailGen</DialogTitle>
                    <DialogDescription>
                        Create stunning YouTube thumbnails from your descriptions
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
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
                                <label className="text-sm font-medium">Generated Thumbnail</label>
                                <div className="relative w-full bg-black rounded-lg border overflow-hidden">
                                    <div className="aspect-[16/9] relative">
                                        <img
                                            src={generatedUrl}
                                            alt="Generated thumbnail"
                                            className={cn(
                                                "absolute inset-0 w-full h-full",
                                                "object-contain object-center"
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            {generatedUrl ? (
                                <Button onClick={handleDownload}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!backgroundPrompt || !textPrompt || isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="mr-2 h-4 w-4" />
                                            Generate
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 