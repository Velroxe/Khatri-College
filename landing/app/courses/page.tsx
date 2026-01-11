import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Contact from '@/components/Contact'

const CoursesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow">
        {/* Page Header */}
        <section className="bg-navy text-white py-20">
          <div className="mt-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Our Academic Programs
            </h1>
            <p className="max-w-3xl mx-auto text-gray-200 text-lg">
              Detailed course structure designed to build strong foundations,
              academic excellence, and professional confidence.
            </p>
          </div>
        </section>

        {/* Courses Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 space-y-16">

            {/* English Speaking Course */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-navy mb-6">
                English Speaking Course
              </h2>

              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    A. Basic Grammar Course (3 Months)
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Fundamentals of English grammar</li>
                    <li>Sentence structure and usage</li>
                    <li>Parts of speech</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    B. Advanced English Course (2 Months)
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Common error exercises</li>
                    <li>Vocabulary development</li>
                    <li>Hindi to English translation</li>
                    <li>Answer writing skills</li>
                    <li>Article writing</li>
                    <li>Cloze tests</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    C. Speaking Course (2 Months)
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Just-A-Minute (JAM) sessions</li>
                    <li>Interview practice</li>
                    <li>Speech delivery</li>
                    <li>Debate sessions</li>
                    <li>Listening exercises</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* French Language */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-navy mb-6">
                French Language Course (Up to Higher Level)
              </h2>

              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    A. Basic Level
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Basic verbs</li>
                    <li>This / That / These</li>
                    <li>General vocabulary</li>
                    <li>Use of “of / about”</li>
                    <li>Present tense</li>
                    <li>Quel, quels, quelle, quelles</li>
                    <li>Common phrases and sentences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    B. Intermediate Level
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Present & past tense</li>
                    <li>Recent past</li>
                    <li>Near & simple future</li>
                    <li>Future perfect</li>
                    <li>Past continuous</li>
                    <li>Imperfect tense</li>
                    <li>Vocabulary enhancement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    C. Advanced Level
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Pronouns</li>
                    <li>Degrees of comparison</li>
                    <li>Present conditional</li>
                    <li>Past conditional</li>
                    <li>Advanced vocabulary</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Class X */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-navy mb-4">
                Class X (All Subjects)
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>English</li>
                <li>Mathematics</li>
                <li>Science</li>
                <li>Social Science</li>
              </ul>
            </div>

            {/* Commerce */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-navy mb-4">
                Commerce Stream (XI & XII)
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Accountancy</li>
                <li>Economics</li>
                <li>Business Studies</li>
                <li>Mathematics</li>
                <li>English</li>
              </ul>
            </div>

            {/* Junior Classes */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-navy mb-4">
                Junior Classes
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>All subjects</li>
                <li>English speaking sessions</li>
                <li>Mathematics workshops</li>
              </ul>
            </div>

            {/* CA Foundation */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-navy mb-4">
                CA Foundation
              </h2>
              <p className="text-gray-700">
                Complete preparation for CA Foundation with expert guidance,
                concept clarity, and exam-oriented practice.
              </p>
            </div>

          </div>
        </section>

        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default CoursesPage
