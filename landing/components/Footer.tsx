import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Facebook, Twitter, Instagram, Linkedin, BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="bg-gold p-1.5 rounded">
                 <BookOpen className="h-5 w-5 text-navy" />
               </div>
               <span className="font-heading font-bold text-xl">
                 Khatri <span className="text-gold">College</span>
               </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering the next generation of leaders through innovative education and research excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
             <h4 className="text-lg font-bold text-white mb-4">Resources</h4>
             <ul className="space-y-2">
               <li><a href="https://student.khatricollege.com/" className="text-gray-400 hover:text-gold transition-colors text-sm">Student Portal</a></li>
               <li><a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">Library</a></li>
               <li><a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">Alumni Network</a></li>
               <li><a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">Career Services</a></li>
             </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-gold hover:text-navy transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-gold hover:text-navy transition-all duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-gold hover:text-navy transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-gold hover:text-navy transition-all duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Khatri College. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
            <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;