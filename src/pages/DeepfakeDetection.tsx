
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoUploader from '../components/VideoUploader';
import ProcessingStatus from '../components/ProcessingStatus';
import { processVideo } from '../services/apiService';
import { toast } from '@/hooks/use-toast';

interface DeepfakeResult {
  is_fake: boolean;
  fake_probability: number;
  total_frames: number;
  fake_frames: number;
}

const DeepfakeDetection = () => {
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DeepfakeResult | null>(null);
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
    setDetectionResult(null);
  };
  
  const handleProcessVideo = async () => {
    if (!selectedVideoFile) {
      toast({
        variant: "destructive",
        title: "No video selected",
        description: "Please select a video to analyze."
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    setDetectionResult(null);
    
    try {
      const result = await processVideo(selectedVideoFile, "deepfake");
      
      if (result.success && result.result) {
        setProcessingProgress(100);
        setDetectionResult(result.result);
        toast({
          title: "Analysis complete",
          description: "Your video has been analyzed for deepfake detection."
        });
      } else {
        throw new Error(result.error || "Failed to analyze video");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
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
          <h1 className="text-3xl font-bold mb-2">Deepfake Detection</h1>
          <p className="text-gray-600 mb-6">
            Analyze videos to detect if they've been manipulated using deepfake technology.
          </p>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Upload Video for Analysis</h2>
              <p className="text-gray-600 mb-6">
                Our AMTENnet AI model will analyze your video and determine if it contains deepfake manipulations.
              </p>
              
              <VideoUploader onVideoSelected={handleVideoSelected} />
              
              {selectedVideoFile && !detectionResult && !isProcessing && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={handleProcessVideo}>
                    <Play className="w-4 h-4 mr-2" />
                    Analyze Video
                  </Button>
                </div>
              )}
            </div>
            
            {isProcessing && (
              <ProcessingStatus 
                isProcessing={isProcessing}
                progress={Math.round(processingProgress)} 
                status="Analyzing video for deepfake manipulation..."
              />
            )}
            
            {detectionResult && (
              <div className={`p-6 rounded-lg shadow-sm ${
                detectionResult.is_fake 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center mb-4">
                  {detectionResult.is_fake ? (
                    <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                  )}
                  <h2 className="text-xl font-semibold">
                    {detectionResult.is_fake ? "Deepfake Detected" : "Authentic Video"}
                  </h2>
                </div>
                
                <div className="mb-6">
                  <p className={`text-lg ${
                    detectionResult.is_fake ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {detectionResult.is_fake 
                      ? "Our AI model has detected signs of manipulation in this video." 
                      : "Our AI model indicates this video appears to be authentic."}
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Probability of being fake</p>
                      <p className="text-2xl font-bold">
                        {(detectionResult.fake_probability * 100).toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Frames analyzed</p>
                      <p className="text-2xl font-bold">
                        {detectionResult.total_frames}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-white p-4 border border-gray-200">
                  <h3 className="font-medium mb-2">Detection Details</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our AMTENnet model analyzed {detectionResult.total_frames} frames and 
                    found {detectionResult.fake_frames} frames with potential manipulation.
                  </p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        detectionResult.is_fake ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${detectionResult.fake_probability * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Authentic</span>
                    <span>Fake</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeepfakeDetection;
