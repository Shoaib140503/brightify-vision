
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import FrameInterpolation from "./pages/FrameInterpolation";
import LowLightEnhancement from "./pages/LowLightEnhancement";
import DeepfakeDetection from "./pages/DeepfakeDetection";
import SuperResolution from "./pages/SuperResolution";
import VideoEnhancementRL from "./pages/VideoEnhancementRL";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index" element={<Index />} />
          <Route path="/frame-interpolation" element={<FrameInterpolation />} />
          <Route path="/low-light-enhancement" element={<LowLightEnhancement />} />
          <Route path="/deepfake-detection" element={<DeepfakeDetection />} />
          <Route path="/super-resolution" element={<SuperResolution />} />
          <Route path="/video-enhancement-rl" element={<VideoEnhancementRL />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
