
import React from 'react';
import { Zap, Sparkles, Maximize, Shield, Clock, BarChart } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-brightify-500" />,
      title: "Instant Processing",
      description: "Enhance your images in seconds with our optimized ML model."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-brightify-500" />,
      title: "Intelligent Enhancement",
      description: "AI detects and improves shadows, highlights, and color balance."
    },
    {
      icon: <Maximize className="h-6 w-6 text-brightify-500" />,
      title: "Detail Preservation",
      description: "Enhances visibility without losing important image details."
    },
    {
      icon: <Shield className="h-6 w-6 text-brightify-500" />,
      title: "Privacy Focused",
      description: "Your images are processed locally and never stored on our servers."
    },
    {
      icon: <Clock className="h-6 w-6 text-brightify-500" />,
      title: "Batch Processing",
      description: "Process multiple images at once to save time (coming soon)."
    },
    {
      icon: <BarChart className="h-6 w-6 text-brightify-500" />,
      title: "Advanced Controls",
      description: "Fine-tune enhancement parameters to achieve your desired look."
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="layout-container">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-brightify-50 text-brightify-700 border border-brightify-200 mb-4">
            Key Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Brightify</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our advanced image enhancement technology offers unique benefits that set us apart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel rounded-xl p-6 hover:shadow-lg transition-all-300 hover:translate-y-[-5px]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brightify-50 flex items-center justify-center">
                  {feature.icon}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
