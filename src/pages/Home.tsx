
import React from 'react';
import { Zap, Film, Sun, ShieldAlert, ScanLine, Sparkles, Monitor } from 'lucide-react';
import Header from '../components/Header';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';

const Home = () => {
  const features = [
    {
      id: 1,
      title: "Frame Interpolation",
      description: "Enhance video smoothness, convert images to video, adjust playback speed with our frame interpolation tools.",
      icon: <Film className="w-5 h-5 text-indigo-600" />,
      link: "/frame-interpolation",
      bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
    },
    {
      id: 2,
      title: "Low Light Enhancement",
      description: "Improve visibility in dark videos using traditional techniques or our advanced LLNET AI model.",
      icon: <Sun className="w-5 h-5 text-amber-600" />,
      link: "/low-light-enhancement",
      bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
    },
    {
      id: 3,
      title: "Deepfake Detection",
      description: "Analyze videos to detect if they've been manipulated using deepfake technology with our AMTENnet model.",
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      link: "/deepfake-detection",
      bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
    },
    {
      id: 4,
      title: "Super Resolution",
      description: "Enhance video quality and resolution using SRGAN technology to bring out details and clarity.",
      icon: <ScanLine className="w-5 h-5 text-emerald-600" />,
      link: "/super-resolution",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    },
    {
      id: 5,
      title: "RLGAN Enhancement",
      description: "Enhance video quality using Reinforcement Learning GAN technology for better details and colors.",
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      link: "/video-enhancement-rl",
      bgColor: "bg-gradient-to-br from-sky-50 to-blue-50",
    },
    {
      id: 6,
      title: "Custom Processing",
      description: "Coming soon: Apply customized processing pipelines combining multiple enhancement techniques.",
      icon: <Monitor className="w-5 h-5 text-violet-600" />,
      link: "#",
      bgColor: "bg-gradient-to-br from-gray-50 to-slate-50",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-brightify-50 text-brightify-700 border border-brightify-200 mb-4">
                Video Enhancement Suite
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hybrid Model for Video Enhancement
              </h1>
              <p className="text-xl text-gray-600">
                A comprehensive solution for video processing and enhancement using
                advanced techniques and machine learning models.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  linkTo={feature.link}
                  bgColor={feature.bgColor}
                />
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-brightify-50 to-blue-50 rounded-xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                  <h2 className="text-2xl font-bold mb-2">Ready to enhance your videos?</h2>
                  <p className="text-gray-600">
                    Our hybrid models combine traditional techniques and AI for superior results.
                  </p>
                </div>
                <div className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-brightify-500" />
                  <span className="text-sm text-brightify-700 font-medium">Powered by advanced ML models</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
