
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="layout-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-brightify-700 to-brightify-400 flex items-center justify-center">
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-brightify-400 to-brightify-600"></div>
              </div>
            </div>
            <span className="text-lg font-semibold text-foreground">Brightify</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all-200">Features</a>
            <a href="#howitworks" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all-200">How It Works</a>
            <a href="#processor" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all-200">Try It Now</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline" 
              size="icon"
              className="rounded-full h-9 w-9 border-gray-200 hover:bg-gray-100"
              aria-label="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
