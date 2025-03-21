
import React from 'react';
import { Sun, Image, Download } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Image className="h-8 w-8 text-brightify-500" />,
      title: "Upload Your Image",
      description: "Select or drag & drop any low-light image that needs enhancement."
    },
    {
      icon: <Sun className="h-8 w-8 text-brightify-500" />,
      title: "AI Enhancement",
      description: "Our advanced ML model processes your image to reveal hidden details and colors."
    },
    {
      icon: <Download className="h-8 w-8 text-brightify-500" />,
      title: "Download & Share",
      description: "Get your stunning brightened image ready to download and share."
    }
  ];

  return (
    <section id="howitworks" className="py-20 bg-gray-50">
      <div className="layout-container">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-brightify-50 text-brightify-700 border border-brightify-200 mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered image enhancement is fast, effective, and incredibly simple to use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative glass-panel rounded-xl p-8 hover:shadow-lg transition-all-300"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-100">
                <span className="text-brightify-600 font-semibold">{index + 1}</span>
              </div>
              
              <div className="mb-6 w-14 h-14 rounded-full bg-brightify-50 flex items-center justify-center">
                {step.icon}
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
