import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Navbar alreadyOpen={true} />
      <div className="pt-28 pb-16 min-h-screen bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-8">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last Updated: October 26, 2023</p>

          <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Khatri College. We are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or apply for our programs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Personal Identification Information:</strong> Name, phone number, email address, and mailing address when you voluntarily fill out our contact or application forms.</li>
                <li><strong>Academic Information:</strong> Educational background and qualifications provided during the admission process.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and operating system collected automatically for website analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The information we collect is used for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>To process student applications and admissions.</li>
                <li>To communicate with you regarding course inquiries and college updates.</li>
                <li>To improve our website functionality and user experience.</li>
                <li>To comply with legal and regulatory obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                However, please note that no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">5. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-navy">Khatri College Administration</p>
                <p className="text-gray-600">Email: khatricollege@gmail.com</p>
                <p className="text-gray-600">Phone: +91 98116 54422</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;