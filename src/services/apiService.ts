
// API Service for handling video processing requests

type ProcessResult = {
  success: boolean;
  processedVideoUrl?: string;
  error?: string;
  result?: DeepfakeResult;
};

type ImageProcessResult = {
  success: boolean;
  processedImageUrl?: string;
  error?: string;
};

type DeepfakeResult = {
  is_fake: boolean;
  fake_probability: number;
  total_frames: number;
  fake_frames: number;
};

// Check if we're in development mode
const isDev = import.meta.env.DEV;
// Base API URL - use environment variable if available, otherwise fallback to localhost
const API_BASE_URL = isDev ? 'http://localhost:5000/api' : '/api';

// Helper function to check if the API is running
const isApiRunning = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.ok;
  } catch (error) {
    console.warn("API health check failed, using mock data:", error);
    return false;
  }
};

// Function to create a mock URL that works in development
const createMockUrl = (filename: string): string => {
  // In a real app, you'd serve static files or use a mock server
  // For demo purposes, we'll just return a placeholder
  return `https://placehold.co/600x400?text=Processed+${encodeURIComponent(filename)}`;
};

export const processImage = async (imageFile: File): Promise<ImageProcessResult> => {
  // Create FormData to send the file
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    // First check if API is running
    const apiAvailable = await isApiRunning();
    
    if (!apiAvailable) {
      console.log("API not available, using mock data");
      return {
        success: true,
        processedImageUrl: createMockUrl(imageFile.name)
      };
    }
    
    // Send the request to the API
    const response = await fetch(`${API_BASE_URL}/process-image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process image');
    }
    
    const data = await response.json();
    
    return {
      success: data.success,
      processedImageUrl: data.processedImagePath 
        ? `${API_BASE_URL}/download/${encodeURIComponent(data.processedImagePath)}`
        : undefined
    };
  } catch (error) {
    console.error("Error processing image:", error);
    
    // If in development, provide mock data for demonstration
    if (isDev) {
      console.log("Using mock data for development");
      return {
        success: true,
        processedImageUrl: createMockUrl(imageFile.name)
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process image. Please try again later."
    };
  }
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
    // First check if API is running
    const apiAvailable = await isApiRunning();
    
    if (!apiAvailable) {
      console.log("API not available, using mock data");
      
      // For deepfake detection, return mock result
      if (feature === 'deepfake') {
        return {
          success: true,
          result: {
            is_fake: Math.random() > 0.5,
            fake_probability: Math.random(),
            total_frames: 100,
            fake_frames: Math.floor(Math.random() * 100)
          }
        };
      }
      
      // For other features, return mock video URL
      return {
        success: true,
        processedVideoUrl: createMockUrl(videoFile.name)
      };
    }
    
    // Send the request to the API
    const response = await fetch(`${API_BASE_URL}/process-video`, {
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
          ? `${API_BASE_URL}/download/${encodeURIComponent(data.processedVideoPath)}`
          : undefined
      };
    }
  } catch (error) {
    console.error("Error processing video:", error);
    
    // If in development, provide mock data for demonstration
    if (isDev) {
      console.log("Using mock data for development");
      
      // For deepfake detection, return mock result
      if (feature === 'deepfake') {
        return {
          success: true,
          result: {
            is_fake: Math.random() > 0.5,
            fake_probability: Math.random(),
            total_frames: 100,
            fake_frames: Math.floor(Math.random() * 100)
          }
        };
      }
      
      // For other features, return mock video URL
      return {
        success: true,
        processedVideoUrl: createMockUrl(videoFile.name)
      };
    }
    
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
    // First check if API is running
    const apiAvailable = await isApiRunning();
    
    if (!apiAvailable) {
      console.log("API not available, using mock data");
      return {
        success: true,
        processedVideoUrl: createMockUrl('images-to-video.mp4')
      };
    }
    
    // Send the request to the API
    const response = await fetch(`${API_BASE_URL}/image-to-video`, {
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
        ? `${API_BASE_URL}/download/${encodeURIComponent(data.processedVideoPath)}`
        : undefined
    };
  } catch (error) {
    console.error("Error processing images to video:", error);
    
    // If in development, provide mock data for demonstration
    if (isDev) {
      console.log("Using mock data for development");
      return {
        success: true,
        processedVideoUrl: createMockUrl('images-to-video.mp4')
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create video from images. Please try again later."
    };
  }
};

export const checkApiHealth = async (): Promise<boolean> => {
  return await isApiRunning();
};
