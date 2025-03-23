
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

import Home from './pages/Home';
import FrameInterpolation from './pages/FrameInterpolation';
import LowLightEnhancement from './pages/LowLightEnhancement';
import DeepfakeDetection from './pages/DeepfakeDetection';
import SuperResolution from './pages/SuperResolution';
import VideoEnhancementRL from './pages/VideoEnhancementRL';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/frame-interpolation" element={<FrameInterpolation />} />
            <Route path="/low-light-enhancement" element={<LowLightEnhancement />} />
            <Route path="/deepfake-detection" element={<DeepfakeDetection />} />
            <Route path="/super-resolution" element={<SuperResolution />} />
            <Route path="/video-enhancement-rl" element={<VideoEnhancementRL />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
