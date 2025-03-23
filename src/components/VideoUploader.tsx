
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Video, FileVideo, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoUploaderProps {
  onVideoSelected: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ 
  onVideoSelected, 
  accept = "video/mp4,video/quicktime,video/x-msvideo", 
  maxSize = 100, // 100MB default
  label = "Upload Video"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    const files = e.dataTransfer.files;
    if (files.length) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a video file."
      });
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `File size should be less than ${maxSize}MB.`
      });
      return;
    }

    setSelectedFile(file);
    onVideoSelected(file);
    toast({
      title: "Video selected",
      description: `${file.name} is ready for processing.`
    });
  };

  const clickFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging 
          ? 'border-brightify-500 bg-brightify-50' 
          : selectedFile 
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
        className="hidden"
      />
      
      <div className="mb-4 flex justify-center">
        {selectedFile ? (
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <FileVideo className="w-8 h-8 text-gray-500" />
          </div>
        )}
      </div>
      
      {selectedFile ? (
        <div>
          <p className="text-lg font-medium text-gray-700 mb-1">{selectedFile.name}</p>
          <p className="text-sm text-gray-500 mb-4">
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <Button 
            variant="outline" 
            onClick={clickFileInput}
            className="mx-auto"
          >
            Change Video
          </Button>
        </div>
      ) : (
        <>
          <p className="text-lg font-medium text-gray-700 mb-1">{label}</p>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your video here or click to browse
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Supported formats: MP4, MOV, AVI (Max size: {maxSize}MB)
          </p>
          <Button 
            variant="default" 
            onClick={clickFileInput}
            className="mx-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Video
          </Button>
        </>
      )}
    </div>
  );
};

export default VideoUploader;
