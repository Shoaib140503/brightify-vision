
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { processImage } from '../services/apiService';
import ImageComparison from './ImageComparison';

const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.includes('image')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Image size should be less than 10MB');
      return;
    }

    // Create a URL for the original image
    const originalImageUrl = URL.createObjectURL(file);
    setOriginalImage(originalImageUrl);
    setProcessedImage(null);

    try {
      setIsProcessing(true);
      // Process the image using our API service
      const result = await processImage(file);
      
      if (result.success) {
        setProcessedImage(result.processedImageUrl);
        toast.success('Image brightened successfully!');
      } else {
        toast.error(result.error || 'Failed to process image');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('An error occurred while processing the image');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  }, [handleImageUpload]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetImages = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="processor" className="py-20 md:py-32">
      <div className="layout-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-brightify-50 text-brightify-700 border border-brightify-200 mb-4">
              Try It Yourself
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transform Your Images</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload a low-light image and see the magic of our AI enhancement in seconds.
              No sign-up required.
            </p>
          </div>

          {!originalImage ? (
            <div 
              className={`glass-panel rounded-xl p-10 text-center cursor-pointer transition-all-300 ${
                isDragging ? 'border-brightify-400 shadow-lg drag-active' : 'border-gray-200 hover:border-brightify-300'
              }`}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileSelect} 
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-brightify-50 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-brightify-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Upload your image</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop or click to select
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, WEBP • Max size: 10MB
                  </p>
                </div>
                <Button className="mt-4 rounded-full px-6 bg-brightify-500 hover:bg-brightify-600">
                  Select Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Image Enhancement</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={resetImages}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative">
                {isProcessing ? (
                  <div className="min-h-[350px] flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-brightify-50 flex items-center justify-center animate-pulse-glow">
                        <Loader2 className="h-8 w-8 text-brightify-500 animate-spin" />
                      </div>
                    </div>
                    <p className="mt-6 text-muted-foreground">Enhancing your image...</p>
                  </div>
                ) : (
                  <ImageComparison 
                    originalImage={originalImage} 
                    processedImage={processedImage} 
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageProcessor;
