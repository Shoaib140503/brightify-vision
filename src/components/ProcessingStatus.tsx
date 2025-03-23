
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  progress?: number;
  status?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ 
  isProcessing, 
  progress = 0,
  status = "Processing your video..."
}) => {
  if (!isProcessing) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-brightify-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium">{progress}%</span>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">{status}</h3>
          <p className="mt-1 text-sm text-gray-500">
            This may take a moment depending on the video size and complexity
          </p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-brightify-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
