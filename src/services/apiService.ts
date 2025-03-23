
// API Service for handling video processing requests

type ProcessResult = {
  success: boolean;
  processedVideoUrl?: string;
  error?: string;
  result?: DeepfakeResult;
};

type DeepfakeResult = {
  is_fake: boolean;
  fake_probability: number;
  total_frames: number;
  fake_frames: number;
};

export const processVideo = async (
  videoFile: File, 
  feature: string, 
  options: {
    subFeature?: string;
    speedFactor?: number;
  } = {}
): Promise<ProcessResult> => {
  // Create FormData to send the file
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('feature', feature);
  
  if (options.subFeature) {
    formData.append('subFeature', options.subFeature);
  }
  
  if (options.speedFactor) {
    formData.append('speedFactor', options.speedFactor.toString());
  }

  try {
    // Send the request to the API
    const response = await fetch('http://localhost:5000/api/process-video', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process video');
    }
    
    const data = await response.json();
    
    if (feature === 'deepfake') {
      return {
        success: data.success,
        result: data.result
      };
    } else {
      return {
        success: data.success,
        processedVideoUrl: data.processedVideoPath 
          ? `http://localhost:5000/api/download/${encodeURIComponent(data.processedVideoPath)}`
          : undefined
      };
    }
  } catch (error) {
    console.error("Error processing video:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process video. Please try again later."
    };
  }
};

export const processImagesToVideo = async (imageFiles: File[], fps: number = 30): Promise<ProcessResult> => {
  // Create FormData to send the files
  const formData = new FormData();
  
  // Append all image files
  imageFiles.forEach(file => {
    formData.append('images', file);
  });
  
  formData.append('fps', fps.toString());

  try {
    // Send the request to the API
    const response = await fetch('http://localhost:5000/api/image-to-video', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process images to video');
    }
    
    const data = await response.json();
    
    return {
      success: data.success,
      processedVideoUrl: data.processedVideoPath 
        ? `http://localhost:5000/api/download/${encodeURIComponent(data.processedVideoPath)}`
        : undefined
    };
  } catch (error) {
    console.error("Error processing images to video:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create video from images. Please try again later."
    };
  }
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
};
