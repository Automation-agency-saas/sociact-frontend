import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Upload, Image as ImageIcon, Wand2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../../lib/utils';

interface ThumbnailProModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SelectionArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function ThumbnailProModal({ isOpen, onClose }: ThumbnailProModalProps) {
    const [step, setStep] = useState<'input' | 'editing'>('input');
    const [prompt, setPrompt] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [selection, setSelection] = useState<SelectionArea | null>(null);
    const [editPrompt, setEditPrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const isDrawing = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });

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
        if (!youtubeUrl) return;

        setIsLoading(true);
        try {
            // Here you would call your backend API to fetch the thumbnail
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockThumbnailUrl = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113';
            setPreviewUrl(mockThumbnailUrl);
            setStep('editing');
        } catch (error) {
            toast.error('Failed to fetch YouTube thumbnail');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!file && !youtubeUrl) {
            toast.error('Please upload an image or provide a YouTube URL');
            return;
        }

        setIsLoading(true);
        try {
            // Here you would call your backend API to generate the thumbnail
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStep('editing');
        } catch (error) {
            toast.error('Failed to generate thumbnail');
        } finally {
            setIsLoading(false);
        }
    };

    const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        isDrawing.current = true;
        const rect = canvas.getBoundingClientRect();
        startPos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }, []);

    const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!isDrawing.current || !canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the image
        if (imageRef.current) {
            ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
        }

        // Draw selection rectangle
        const width = currentX - startPos.current.x;
        const height = currentY - startPos.current.y;

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(startPos.current.x, startPos.current.y, width, height);

        // Save selection area
        setSelection({
            x: startPos.current.x,
            y: startPos.current.y,
            width,
            height
        });
    }, []);

    const stopDrawing = useCallback(() => {
        isDrawing.current = false;
    }, []);

    const handleEditArea = async () => {
        if (!selection || !editPrompt) {
            toast.error('Please select an area and provide a prompt');
            return;
        }

        setIsEditing(true);
        try {
            // Here you would call your backend API to edit the selected area
            // The API should use the selection coordinates and editPrompt
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Area edited successfully');
            // Update the canvas with the new image
        } catch (error) {
            toast.error('Failed to edit area');
        } finally {
            setIsEditing(false);
        }
    };

    const handleClose = () => {
        setStep('input');
        setPrompt('');
        setYoutubeUrl('');
        setFile(null);
        setPreviewUrl('');
        setSelection(null);
        setEditPrompt('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ThumbnailPro</DialogTitle>
                    <DialogDescription>
                        Generate and edit AI-powered thumbnails for your videos
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {step === 'input' && (
                        <div className="space-y-4">
                            <div className="grid gap-4">
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

                                <div className="relative space-y-2">
                                    <label className="text-sm font-medium">Or Upload Image</label>
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

                                {(file || previewUrl) && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Preview</label>
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Generation Prompt</label>
                                    <Textarea
                                        placeholder="Describe how you want your thumbnail to look..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleGenerate}
                                    disabled={(!file && !youtubeUrl) || !prompt || isLoading}
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
                            </div>
                        </div>
                    )}

                    {step === 'editing' && (
                        <div className="space-y-4">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                <canvas
                                    ref={canvasRef}
                                    className="absolute inset-0 w-full h-full"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                                <img
                                    ref={imageRef}
                                    src={previewUrl}
                                    alt="Editable thumbnail"
                                    className="hidden"
                                    onLoad={() => {
                                        const canvas = canvasRef.current;
                                        const ctx = canvas?.getContext('2d');
                                        if (canvas && ctx && imageRef.current) {
                                            canvas.width = canvas.offsetWidth;
                                            canvas.height = canvas.offsetHeight;
                                            ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
                                        }
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Edit Prompt</label>
                                <div className="flex gap-2">
                                    <Textarea
                                        placeholder="Describe the changes for the selected area..."
                                        value={editPrompt}
                                        onChange={(e) => setEditPrompt(e.target.value)}
                                        disabled={!selection || isEditing}
                                    />
                                    <Button
                                        onClick={handleEditArea}
                                        disabled={!selection || !editPrompt || isEditing}
                                        className="flex-shrink-0"
                                    >
                                        {isEditing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Editing...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="mr-2 h-4 w-4" />
                                                Edit Area
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setStep('input')}>
                                    Back
                                </Button>
                                <Button onClick={handleClose}>
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}