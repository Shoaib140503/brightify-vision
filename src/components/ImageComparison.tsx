
import React, { useState, useRef, useEffect } from 'react';
import { Download, ArrowLeftRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';

interface ImageComparisonProps {
  originalImage: string | null;
  processedImage: string | null;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({ 
  originalImage, 
  processedImage 
}) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = containerRef.current.offsetWidth;
    
    let newPosition = (x / containerWidth) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setPosition(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const containerWidth = containerRef.current.offsetWidth;
    
    let newPosition = (x / containerWidth) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setPosition(newPosition);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'brightified-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded successfully!');
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);

  if (!originalImage) {
    return <div className="min-h-[300px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg aspect-[16/9] bg-gray-100"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Before image (original) */}
        <div 
          className="absolute inset-0 bg-center bg-cover transition-all-300"
          style={{ 
            backgroundImage: `url(${originalImage})`, 
            filter: "brightness(0.85)"
          }}
        />
        
        {/* After image (processed) - shown if available */}
        {processedImage && (
          <div 
            className="absolute inset-0 bg-center bg-cover transition-all-300"
            style={{ 
              backgroundImage: `url(${processedImage})`,
              width: `${position}%`,
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`
            }}
          />
        )}
        
        {/* Slider handle */}
        {processedImage && (
          <div 
            className="absolute top-0 bottom-0 w-[3px] bg-white shadow-md cursor-ew-resize z-10 transform -translate-x-1/2"
            style={{ left: `${position}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={() => setIsDragging(true)}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
              <ArrowLeftRight className="h-4 w-4 text-brightify-500" />
            </div>
          </div>
        )}
        
        {/* Labels */}
        <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded">
          Before
        </div>
        
        {processedImage && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-brightify-500 text-white text-xs font-medium rounded">
            After
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          {!processedImage && (
            <p className="text-sm text-muted-foreground italic">
              Upload your image to see the enhanced version
            </p>
          )}
        </div>
        
        {processedImage && (
          <Button 
            onClick={downloadImage}
            className="rounded-full px-5 gap-2 text-sm bg-brightify-500 hover:bg-brightify-600"
          >
            <Download className="h-4 w-4" />
            Download Enhanced Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageComparison;
