import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  light?: boolean;
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  className = '', 
  children, 
  title, 
  subtitle,
  light = true 
}) => {
  return (
    <section 
      id={id} 
      className={`py-16 md:py-24 ${light ? 'bg-offwhite' : 'bg-white'} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16">
            {subtitle && (
              <span className="block text-gold font-semibold tracking-wider uppercase text-sm mb-2">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy">
                {title}
              </h2>
            )}
            <div className="w-20 h-1 bg-gold mx-auto mt-4 rounded-full"></div>
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;