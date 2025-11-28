import React from 'react';
import Section from './ui/Section';
import { CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  const highlights = [
    "Established in 1991 with a legacy of success",
    "State-of-the-art research facilities",
    "Global partnerships with industry leaders",
    "Holistic development approach"
  ];

  return (
    <Section id="about" title="Our Legacy" subtitle="Who We Are" light={false}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/20 rounded-full -z-10"></div>
          <img 
            src="/about.jpg" 
            alt="Campus Library" 
            className="rounded-lg shadow-2xl w-full object-cover h-[400px] md:h-[500px]"
          />
          <div className="absolute -bottom-6 -right-6 bg-navy text-white p-6 rounded-lg shadow-xl hidden md:block">
            <p className="text-4xl font-bold text-gold">35+</p>
            <p className="text-sm uppercase tracking-wider">Years of Excellence</p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-heading font-bold text-navy mb-4">
            Pioneering Academic Excellence and Innovation
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            At Khatri College, we believe education is more than just acquiring knowledge; it is about igniting curiosity and fostering a spirit of innovation. Since our inception, we have been dedicated to providing a transformative learning experience that empowers students to lead in a rapidly changing world.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our campus is a melting pot of culture, intellect, and creativity, designed to inspire collaboration and breakthrough thinking across all disciplines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gold mt-1 mr-3 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;