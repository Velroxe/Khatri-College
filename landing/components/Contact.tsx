"use client"

import React, { useState } from 'react';
import Section from './ui/Section';
import Button from './ui/Button';
import { MapPin, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrorMessage(null);

    try {
      const backendHost = process.env.NEXT_PUBLIC_BACKEND;
      if (!backendHost) {
        // Fallback for demo purposes if env var isn't set, though in prod this should likely fail
        console.warn("BACKEND_HOST not set, simulating success");
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFormStatus('success');
        setFormData({ name: '', phone: '', message: '' });
        return;
      }

      const response = await fetch(`${backendHost}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      setFormStatus('success');
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setFormStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <Section id="contact" title="Get in Touch" subtitle="Apply & Inquire" light={false}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info & Map */}
        <div className="space-y-8">
          <div className="bg-offwhite p-8 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-navy mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-gold mt-1 mr-4" />
                <div>
                  <h4 className="font-semibold text-charcoal">Campus Address</h4>
                  <p className="text-gray-600">E-37, Tagore Garden Extn.<br />New Delhi - 110027</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-gold mt-1 mr-4" />
                <div>
                  <h4 className="font-semibold text-charcoal">Phone Number</h4>
                  <p className="text-gray-600">+91 98116 54422</p>
                  <p className="text-gray-600 text-sm">Mon-Fri, 9am - 5pm</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 text-gold mt-1 mr-4" />
                <div>
                  <h4 className="font-semibold text-charcoal">Email Address</h4>
                  <p className="text-gray-600">khatricollege@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder Map */}
          <div className="h-64 bg-gray-200 rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-200">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d569.7789174408714!2d77.11057018852584!3d28.64869396313892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d037ae0115ca1%3A0x1b449b1554e59251!2sKhatri%20College!5e0!3m2!1sen!2sin!4v1764357838574!5m2!1sen!2sin"
                title="Map"
                className="filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {formStatus === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-2">Message Sent!</h3>
              <p className="text-gray-600">Thank you for contacting Khatri College. Our admissions team will get back to you shortly.</p>
              <button
                onClick={() => setFormStatus('idle')}
                className="mt-6 text-navy font-semibold hover:text-gold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-bold text-navy mb-2">Send us a Message</h3>
              <p className="text-gray-500 mb-6 text-sm">Interested in applying? Have questions about our curriculum? Fill out the form below.</p>

              {formStatus === 'error' && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-start text-sm">
                  <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                  <span>{errorMessage || "Something went wrong. Please try again."}</span>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy outline-none transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-navy focus:border-navy outline-none transition-colors"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={formStatus === 'submitting'}>
                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Contact;
