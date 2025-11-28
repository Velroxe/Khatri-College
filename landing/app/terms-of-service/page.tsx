import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

const TermsOfService: React.FC = () => {

  return (
    <>
      <Navbar alreadyOpen={true} />
      <div className="pt-28 pb-16 min-h-screen bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-8">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Effective Date: October 26, 2023</p>

          <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Khatri College website, you agree to comply with and be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">2. Educational Services</h2>
              <p className="text-gray-700 leading-relaxed">
                Khatri College provides educational information, course details, and admission services through this website.
                While we strive for accuracy, course curriculums and schedules are subject to change without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">3. User Conduct</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to use the website for lawful purposes only. You are prohibited from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Submitting false or misleading information on application forms.</li>
                <li>Attempting to gain unauthorized access to the website's backend or user data.</li>
                <li>Using the website to harass, defame, or infringe upon the rights of others.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">4. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content on this website, including text, graphics, logos, and course materials, is the property of Khatri College
                and is protected by intellectual property laws. Unauthorized reproduction or distribution is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Khatri College shall not be liable for any direct, indirect, incidental, or consequential damages arising out of your use
                or inability to use the website. We do not guarantee that the website will be uninterrupted or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-navy mb-4">6. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Khatri College is located,
                without regard to its conflict of law provisions.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;