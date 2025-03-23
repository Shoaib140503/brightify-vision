
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="layout-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-brightify-700 to-brightify-400 flex items-center justify-center">
              <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-brightify-400 to-brightify-600"></div>
              </div>
            </div>
            <span className="text-lg font-semibold text-foreground">VideoEnhancer</span>
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
              className="rounded-full h-9 w-9 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-gray-400" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
