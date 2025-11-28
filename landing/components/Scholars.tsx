"use client"

import React, { useState, useEffect } from 'react';
import Section from './ui/Section';
import { STATS, TESTIMONIALS } from '../constants';
import { Scholar } from '../types';
import { Quote, Star, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const Scholars: React.FC = () => {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  // Fetch Data
  useEffect(() => {
    const fetchScholars = async () => {
      try {
        const backendHost = process.env.NEXT_PUBLIC_BACKEND;
        if (!backendHost) {
          throw new Error("BACKEND_HOST environment variable is not set");
        }
        
        const response = await fetch(`${backendHost}/api/scholars`);
        if (!response.ok) {
          throw new Error(`Error fetching scholars: ${response.statusText}`);
        }
        
        const data = await response.json();
        setScholars(data);
      } catch (err) {
        console.error("Failed to fetch scholars:", err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchScholars();
  }, []);

  // Determine items per page based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carousel Logic
  const maxIndex = Math.max(0, scholars.length - itemsPerPage);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div id="scholars">
      {/* Stats Section */}
      <div className="bg-navy py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 border border-white/10 rounded-xl hover:bg-white/5 transition-colors group">
                  <Icon className="h-10 w-10 text-gold mx-auto mb-4 transform group-hover:scale-110 transition-transform" />
                  <div className="text-3xl md:text-5xl font-bold mb-2 text-white">{stat.value}</div>
                  <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Scholars Section */}
      <Section title="Academic Achievers" subtitle="Top Scholars" light={true}>
        <div className="relative px-4 md:px-12 mb-16 min-h-[400px]">
           
           {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-offwhite/50 backdrop-blur-sm rounded-xl">
                <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
                <p className="text-navy font-medium">Loading scholars...</p>
             </div>
           )}

           {error && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
               <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl flex items-center shadow-sm border border-red-100">
                  <AlertCircle className="w-6 h-6 mr-3" />
                  <div>
                    <p className="font-bold">Unable to load scholar data</p>
                    <p className="text-sm">{error}</p>
                  </div>
               </div>
             </div>
           )}

           {!loading && !error && scholars.length > 0 && (
             <>
               {/* Navigation Buttons */}
               <button 
                 onClick={prevSlide}
                 className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 text-navy p-3 rounded-full shadow-lg hover:bg-gold hover:text-white transition-all duration-300 focus:outline-none disabled:opacity-50"
                 aria-label="Previous Scholar"
                 disabled={scholars.length <= itemsPerPage}
               >
                 <ChevronLeft className="w-6 h-6" />
               </button>
               
               <button 
                 onClick={nextSlide}
                 className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 text-navy p-3 rounded-full shadow-lg hover:bg-gold hover:text-white transition-all duration-300 focus:outline-none disabled:opacity-50"
                 aria-label="Next Scholar"
                 disabled={scholars.length <= itemsPerPage}
               >
                 <ChevronRight className="w-6 h-6" />
               </button>

               {/* Carousel Container */}
               <div className="overflow-hidden py-4 -mx-4 px-4">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                >
                  {scholars.map((scholar) => (
                    <div 
                      key={scholar.id} 
                      className="shrink-0 px-3 w-full md:w-1/2 lg:w-1/3"
                      style={{ width: `${100 / itemsPerPage}%` }}
                    >
                      <div className="bg-white rounded-xl shadow-lg border-t-4 border-gold p-6 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold mr-4 shrink-0">
                            {scholar.image_url ? (
                              <img src={scholar.image_url} alt={scholar.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-navy flex items-center justify-center text-white text-xl font-bold">
                                {scholar.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-navy line-clamp-1">{scholar.name}</h3>
                            <p className="text-sm text-gray-500 font-medium line-clamp-1">{scholar.degree}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 grow">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Top Subjects</h4>
                          {scholar.subjects.map((subj, idx) => (
                            <div key={idx} className="relative">
                              <div className="flex justify-between text-sm font-medium mb-1">
                                <span className="text-charcoal truncate pr-2">{subj.subject}</span>
                                <span className="text-navy font-bold">{subj.marks}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div 
                                  className="bg-gold h-2 rounded-full" 
                                  style={{ width: `${subj.marks}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                           <div className="inline-flex items-center text-xs font-bold text-gold uppercase tracking-wide">
                             <Star className="w-4 h-4 mr-1 fill-current" /> Dean's List
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
               </div>

               {/* Pagination Indicators */}
               {scholars.length > itemsPerPage && (
                 <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: Math.ceil(scholars.length - itemsPerPage + 1) }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          idx === currentIndex ? 'bg-gold w-8' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                 </div>
               )}
             </>
           )}
        </div>

        {/* Testimonials Grid (Secondary) */}
        <div className="border-t border-gray-200 pt-16">
          <div className="text-center mb-10">
             <h3 className="text-2xl font-heading font-bold text-navy">Student Voices</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="bg-offwhite p-8 rounded-xl relative">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-300" />
                <p className="text-gray-700 italic mb-6 relative z-10">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">{testimonial.author}</h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Scholars;