import React from 'react';
import Button from './ui/Button';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image/Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/banner-2.jpg" 
          alt="Students Collaborating" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-linear-to-t from-navy via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-gold font-bold tracking-widest uppercase text-sm md:text-base mb-4 animate-fade-in-up">
          Welcome to Excellence
        </h2>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-lg">
          Achieve Your Future.<br />
          <span className="text-gold">Khatri College.</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200 mb-10 font-light">
          Pioneering Academic Excellence and Innovation. Join a community dedicated to shaping the leaders of tomorrow.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
            Explore Courses
          </Button>
          <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-navy">
            Virtual Tour <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-gold rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;