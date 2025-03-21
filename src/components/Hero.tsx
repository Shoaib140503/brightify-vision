
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToProcessor = () => {
    const processorSection = document.getElementById('processor');
    if (processorSection) {
      processorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-24 flex items-center">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[10%] w-[40vmax] h-[40vmax] rounded-full bg-brightify-100/30 blur-[120px] -z-10" />
        <div className="absolute top-[50%] left-[15%] w-[25vmax] h-[25vmax] rounded-full bg-brightify-200/20 blur-[100px] -z-10" />
      </div>
      
      <div className="layout-container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 animate-fade-in">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-brightify-50 text-brightify-700 border border-brightify-200">
              Powered by Advanced ML
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-down">
            Transform Dark Photos Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brightify-600 to-brightify-400">Stunning Imagery</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up">
            Brightify uses cutting-edge machine learning to instantly enhance low-light images, 
            revealing details and colors you never knew were there.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg" 
              className="px-8 rounded-full bg-gradient-to-r from-brightify-600 to-brightify-500 hover:from-brightify-700 hover:to-brightify-600 transition-all duration-300"
              onClick={scrollToProcessor}
            >
              Try It Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 rounded-full border-gray-300"
              onClick={() => document.getElementById('howitworks')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
            <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
