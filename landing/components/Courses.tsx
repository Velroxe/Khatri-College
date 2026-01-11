import React from 'react';
import Section from './ui/Section';
import { COURSES } from '../constants';
import { ArrowRight } from 'lucide-react';

const Courses: React.FC = () => {
  return (
    <Section id="courses" title="Academic Programs" subtitle="Your Path to Success" light={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {COURSES.map((course) => (
          <div 
            key={course.id} 
            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-navy/90 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide font-semibold">
                {course.category}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-heading font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                {course.description}
              </p>
              <a href="/courses" className="flex items-center text-navy font-semibold text-sm hover:text-gold transition-colors">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <a href="/courses" className="inline-block text-navy border-b-2 border-gold pb-1 hover:text-gold transition-colors font-medium">
          View All Programs
        </a>
      </div>
    </Section>
  );
};

export default Courses;