"use client"

import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import Button from './ui/Button';

interface NavbarProps {
  alreadyOpen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ alreadyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || alreadyOpen ? 'bg-navy shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <a href="#home" className="flex items-center gap-2 group">
              <div className="bg-gold p-2 rounded-lg group-hover:bg-white transition-colors duration-300">
                 <BookOpen className="h-6 w-6 text-navy" />
              </div>
              <span className={`font-heading font-bold text-xl md:text-2xl tracking-tight ${
                scrolled ? 'text-white' : 'text-white'
              }`}>
                Khatri <span className="text-gold">College</span>
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center md:space-x-3 lg:space-x-7">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-200 hover:text-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button variant="primary" className="py-2 px-4 text-sm shadow-none hidden lg:block">
              Apply Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute w-full bg-navy border-t border-gray-700 transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-xl">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-gold block px-3 py-2 rounded-md text-base font-medium"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-4 px-3">
             <Button variant="primary" className="w-full">Apply Now</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;