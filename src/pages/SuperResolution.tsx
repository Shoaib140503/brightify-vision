
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoUploader from '../components/VideoUploader';
import ProcessingStatus from '../components/ProcessingStatus';
import VideoPlayer from '../components/VideoPlayer';
import { processVideo } from '../services/apiService';
import { toast } from '@/hooks/use-toast';

const SuperResolution = () => {
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Simulate progress updates during processing
  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setProcessingProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 99) {
            clearInterval(timer);
            return 99;
          }
          return newProgress;
        });
      }, 500);
      
      return () => clearInterval(timer);
    }
  }, [isProcessing]);
  
  const handleVideoSelected = (file: File) => {
    setSelectedVideoFile(file);
    setProcessedVideoUrl(null);
  };
  
  const handleProcessVideo = async () => {
    if (!selectedVideoFile) {
      toast({
        variant: "destructive",
        title: "No video selected",
        description: "Please select a video to enhance."
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessedVideoUrl(null);
    
    try {
      const result = await processVideo(selectedVideoFile, "srgan");
      
      if (result.success && result.processedVideoUrl) {
        setProcessingProgress(100);
        setProcessedVideoUrl(result.processedVideoUrl);
        toast({
          title: "Enhancement complete",
          description: "Your video has been enhanced with super-resolution!"
        });
      } else {
        throw new Error(result.error || "Failed to enhance video");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (processedVideoUrl) {
      const a = document.createElement('a');
      a.href = processedVideoUrl;
      a.download = "super_resolution_video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your enhanced video is being downloaded."
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Features
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Super Resolution Enhancement</h1>
          <p className="text-gray-600 mb-6">
            Enhance video quality using SRGAN (Super-Resolution Generative Adversarial Network) to improve details and clarity.
          </p>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">SRGAN Video Enhancement</h2>
              <p className="text-gray-600 mb-6">
                Upload a video to enhance its resolution and quality using our state-of-the-art SRGAN model.
              </p>
              
              <VideoUploader onVideoSelected={handleVideoSelected} />
              
              {selectedVideoFile && !processedVideoUrl && !isProcessing && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={handleProcessVideo}>
                    <Play className="w-4 h-4 mr-2" />
                    Enhance Video
                  </Button>
                </div>
              )}
            </div>
            
            {isProcessing && (
              <ProcessingStatus 
                isProcessing={isProcessing}
                progress={Math.round(processingProgress)} 
                status="Applying SRGAN super-resolution..."
              />
            )}
            
            {processedVideoUrl && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Enhanced Video</h2>
                <VideoPlayer 
                  src={processedVideoUrl} 
                  title="Super Resolution Enhanced Video"
                  onDownload={handleDownload}
                />
                
                <div className="mt-4 flex justify-center">
                  <Button onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Enhanced Video
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperResolution;
