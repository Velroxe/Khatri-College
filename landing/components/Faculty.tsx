"use client"

import React, { useState, useEffect } from 'react';
import Section from './ui/Section';
import { Faculty as FacultyType } from '../types';
import { Award, BookOpen, Clock, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const Faculty: React.FC = () => {
  const [facultyMembers, setFacultyMembers] = useState<FacultyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  // Fetch Data
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const backendHost = process.env.NEXT_PUBLIC_BACKEND;
        if (!backendHost) {
          throw new Error("BACKEND_HOST environment variable is not set");
        }
        
        const response = await fetch(`${backendHost}/api/faculties`);
        if (!response.ok) {
          throw new Error(`Error fetching faculty: ${response.statusText}`);
        }
        
        const data = await response.json();
        setFacultyMembers(data);
      } catch (err) {
        console.error("Failed to fetch faculty members:", err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
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
  const maxIndex = Math.max(0, facultyMembers.length - itemsPerPage);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <Section id="faculty" title="Distinguished Faculty" subtitle="Mentors & Leaders" light={false}>
      <div className="relative px-4 md:px-12 min-h-[400px]">
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-white/50 backdrop-blur-sm rounded-xl transition-all">
             <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
             <p className="text-navy font-medium">Loading faculty members...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl flex items-center shadow-sm border border-red-100">
               <AlertCircle className="w-6 h-6 mr-3" />
               <div>
                 <p className="font-bold">Unable to load faculty data</p>
                 <p className="text-sm">{error}</p>
               </div>
            </div>
          </div>
        )}

        {!loading && !error && facultyMembers.length > 0 && (
          <>
            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 text-navy p-3 rounded-full shadow-lg hover:bg-gold hover:text-white transition-all duration-300 focus:outline-none disabled:opacity-50"
              aria-label="Previous Faculty Member"
              disabled={facultyMembers.length <= itemsPerPage}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 text-navy p-3 rounded-full shadow-lg hover:bg-gold hover:text-white transition-all duration-300 focus:outline-none disabled:opacity-50"
              aria-label="Next Faculty Member"
              disabled={facultyMembers.length <= itemsPerPage}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel Container */}
            <div className="overflow-hidden py-4 -mx-4 px-4">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
              >
                {facultyMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="shrink-0 px-3 w-full md:w-1/2 lg:w-1/3"
                    style={{ width: `${100 / itemsPerPage}%` }}
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group h-full">
                      
                      {/* Image Section */}
                      <div className="relative h-72 overflow-hidden bg-gray-100">
                        <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/0 transition-colors z-10"></div>
                        {member.image_url ? (
                          <img 
                            src={member.image_url} 
                            alt={member.name} 
                            className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <BookOpen className="w-12 h-12" />
                          </div>
                        )}
                        
                        {/* Experience Badge */}
                        <div className="absolute top-4 right-4 z-20 bg-gold text-navy font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 text-xs uppercase tracking-wide">
                          <Clock className="w-3 h-3" />
                          {member.experience_years} Years
                        </div>

                        {/* Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-navy to-transparent h-3/4 opacity-90"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20">
                            <h3 className="text-xl font-bold font-heading leading-tight">{member.name}</h3>
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-5 grow flex flex-col gap-4">
                        
                        {/* Qualifications */}
                        <div>
                          <div className="flex items-center text-navy mb-2">
                            <Award className="w-4 h-4 mr-2 text-gold" />
                            <span className="text-xs font-bold uppercase tracking-wider">Qualifications</span>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {member.qualifications.split(',').map((qual, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2 text-gold">•</span>
                                <span className="line-clamp-2">{qual.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Specialities */}
                        <div className="pt-4 border-t border-gray-100 mt-auto">
                          <div className="flex items-center text-navy mb-2">
                            <BookOpen className="w-4 h-4 mr-2 text-gold" />
                            <span className="text-xs font-bold uppercase tracking-wider">Specialities</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {member.specialities.split(',').slice(0, 3).map((spec, i) => (
                              <span key={i} className="text-xs bg-gray-50 text-navy border border-gray-200 px-2 py-1 rounded-md font-medium whitespace-nowrap">
                                {spec.trim()}
                              </span>
                            ))}
                            {member.specialities.split(',').length > 3 && (
                                <span className="text-xs text-gray-400 px-1 py-1">+More</span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pagination Indicators */}
            {facultyMembers.length > itemsPerPage && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.ceil(facultyMembers.length - itemsPerPage + 1) }).map((_, idx) => (
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
    </Section>
  );
};

export default Faculty;