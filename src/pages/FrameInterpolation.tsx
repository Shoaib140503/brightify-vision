
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoUploader from '../components/VideoUploader';
import MultipleImageUploader from '../components/MultipleImageUploader';
import ProcessingStatus from '../components/ProcessingStatus';
import VideoPlayer from '../components/VideoPlayer';
import { processVideo, processImagesToVideo } from '../services/apiService';
import { toast } from '@/hooks/use-toast';
import { useToast } from '@/hooks/use-toast';

const FrameInterpolation = () => {
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("interpolation");
  const [speedFactor, setSpeedFactor] = useState(1.0);
  
  // Reset state when tab changes
  useEffect(() => {
    setSelectedVideoFile(null);
    setSelectedImageFiles([]);
    setProcessedVideoUrl(null);
    setIsProcessing(false);
    setProcessingProgress(0);
  }, [activeTab]);
  
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
  
  const handleImagesSelected = (files: File[]) => {
    setSelectedImageFiles(files);
    setProcessedVideoUrl(null);
  };
  
  const handleProcessVideo = async () => {
    if (!selectedVideoFile) {
      toast({
        variant: "destructive",
        title: "No video selected",
        description: "Please select a video to process."
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessedVideoUrl(null);
    
    try {
      const options: {
        subFeature?: string;
        speedFactor?: number;
      } = {};
      
      if (activeTab === "speed") {
        options.subFeature = "speed";
        options.speedFactor = speedFactor;
      }
      
      const result = await processVideo(selectedVideoFile, "interpolation", options);
      
      if (result.success && result.processedVideoUrl) {
        setProcessingProgress(100);
        setProcessedVideoUrl(result.processedVideoUrl);
        toast({
          title: "Processing complete",
          description: "Your video has been processed successfully!"
        });
      } else {
        throw new Error(result.error || "Failed to process video");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleProcessImages = async () => {
    if (selectedImageFiles.length < 2) {
      toast({
        variant: "destructive",
        title: "Not enough images",
        description: "Please select at least 2 images to create a video."
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessedVideoUrl(null);
    
    try {
      const result = await processImagesToVideo(selectedImageFiles);
      
      if (result.success && result.processedVideoUrl) {
        setProcessingProgress(100);
        setProcessedVideoUrl(result.processedVideoUrl);
        toast({
          title: "Processing complete",
          description: "Your video has been created successfully!"
        });
      } else {
        throw new Error(result.error || "Failed to create video from images");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Processing failed",
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
      a.download = `processed_${activeTab}_video.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your processed video is being downloaded."
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
          <h1 className="text-3xl font-bold mb-2">Frame Interpolation</h1>
          <p className="text-gray-600 mb-6">
            Enhance video smoothness, create videos from images, or adjust playback speed.
          </p>
          
          <Tabs defaultValue="interpolation" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="interpolation">Video Smoothening</TabsTrigger>
              <TabsTrigger value="images">Images to Video</TabsTrigger>
              <TabsTrigger value="speed">Speed Conversion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="interpolation">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Video Smoothening</h2>
                  <p className="text-gray-600 mb-6">
                    Enhance the fluidity of videos by generating intermediate frames, making the motion appear smoother.
                  </p>
                  
                  <VideoUploader onVideoSelected={handleVideoSelected} />
                  
                  {selectedVideoFile && !processedVideoUrl && !isProcessing && (
                    <div className="mt-6 flex justify-center">
                      <Button onClick={handleProcessVideo}>
                        <Play className="w-4 h-4 mr-2" />
                        Process Video
                      </Button>
                    </div>
                  )}
                </div>
                
                {isProcessing && (
                  <ProcessingStatus 
                    isProcessing={isProcessing}
                    progress={Math.round(processingProgress)} 
                    status="Generating intermediate frames..."
                  />
                )}
                
                {processedVideoUrl && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Processed Video</h2>
                    <VideoPlayer 
                      src={processedVideoUrl} 
                      title="Smoothened Video"
                      onDownload={handleDownload}
                    />
                    
                    <div className="mt-4 flex justify-center">
                      <Button onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="images">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Images to Video Conversion</h2>
                  <p className="text-gray-600 mb-6">
                    Convert a series of images into a cohesive video, perfect for creating time-lapses or stop-motion animations.
                  </p>
                  
                  <MultipleImageUploader onImagesSelected={handleImagesSelected} />
                  
                  {selectedImageFiles.length > 1 && !processedVideoUrl && !isProcessing && (
                    <div className="mt-6 flex justify-center">
                      <Button onClick={handleProcessImages}>
                        <Play className="w-4 h-4 mr-2" />
                        Create Video
                      </Button>
                    </div>
                  )}
                </div>
                
                {isProcessing && (
                  <ProcessingStatus 
                    isProcessing={isProcessing}
                    progress={Math.round(processingProgress)} 
                    status="Creating video from images..."
                  />
                )}
                
                {processedVideoUrl && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Generated Video</h2>
                    <VideoPlayer 
                      src={processedVideoUrl} 
                      title="Generated Video from Images"
                      onDownload={handleDownload}
                    />
                    
                    <div className="mt-4 flex justify-center">
                      <Button onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="speed">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Speed Conversion</h2>
                  <p className="text-gray-600 mb-6">
                    Adjust the speed of your videos, creating slow-motion or fast-motion effects.
                  </p>
                  
                  <VideoUploader onVideoSelected={handleVideoSelected} />
                  
                  {selectedVideoFile && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Speed Factor
                      </label>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-sm text-gray-500">Slow</span>
                        <input
                          type="range"
                          min="0.25"
                          max="4"
                          step="0.25"
                          value={speedFactor}
                          onChange={(e) => setSpeedFactor(parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">Fast</span>
                        <span className="ml-2 text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                          {speedFactor}x
                        </span>
                      </div>
                      
                      {!processedVideoUrl && !isProcessing && (
                        <div className="flex justify-center">
                          <Button onClick={handleProcessVideo}>
                            <Play className="w-4 h-4 mr-2" />
                            Process Video
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {isProcessing && (
                  <ProcessingStatus 
                    isProcessing={isProcessing}
                    progress={Math.round(processingProgress)} 
                    status={`Converting video to ${speedFactor}x speed...`}
                  />
                )}
                
                {processedVideoUrl && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Processed Video</h2>
                    <VideoPlayer 
                      src={processedVideoUrl} 
                      title={`${speedFactor}x Speed Video`}
                      onDownload={handleDownload}
                    />
                    
                    <div className="mt-4 flex justify-center">
                      <Button onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default FrameInterpolation;
