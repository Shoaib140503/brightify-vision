
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MultipleImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxImages?: number;
}

const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({ 
  onImagesSelected, 
  accept = "image/jpeg,image/png,image/jpg", 
  maxSize = 10, // 10MB default
  maxImages = 50
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    validateAndSetFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      validateAndSetFiles(files);
    }
  };

  const validateAndSetFiles = (files: File[]) => {
    // Filter for only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload image files only."
      });
      return;
    }

    // Check if adding these files would exceed the maximum
    if (selectedFiles.length + imageFiles.length > maxImages) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: `You can upload a maximum of ${maxImages} images.`
      });
      return;
    }

    // Check each file's size
    const validFiles = imageFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds the ${maxSize}MB size limit.`
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newSelectedFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newSelectedFiles);
      onImagesSelected(newSelectedFiles);
      toast({
        title: "Images selected",
        description: `${validFiles.length} images are ready for processing.`
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onImagesSelected(newFiles);
  };

  const clickFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-brightify-500 bg-brightify-50' 
            : selectedFiles.length > 0 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-brightify-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple
          className="hidden"
        />
        
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        
        <p className="text-lg font-medium text-gray-700 mb-1">Upload Images</p>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop your images here or click to browse
        </p>
        <p className="text-xs text-gray-400 mb-4">
          Supported formats: JPG, PNG (Max size per image: {maxSize}MB)
        </p>
        <Button 
          variant="default" 
          onClick={clickFileInput}
          className="mx-auto"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Images
        </Button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Selected Images ({selectedFiles.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {selectedFiles.map((file, index) => (
              <div 
                key={index} 
                className="relative group border rounded-md overflow-hidden"
              >
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Selected ${index}`}
                  className="w-full h-20 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                <div className="text-xs truncate p-1 bg-gray-100">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUploader;
