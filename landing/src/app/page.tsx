import About from '@/components/About'
import Contact from '@/components/Contact'
import Courses from '@/components/Courses'
import Faculties from '@/components/Faculties'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import Scholars from '@/components/Scholars'
import React from 'react'

export const dynamic = "force-static"; // optional but good for SEO

const Home = () => {

  const base_url = "https://www.khatricollege.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Khatri College",
    url: `${base_url}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base_url}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Khatri College",
    url: `${base_url}`,
    logo: `${base_url}/assets/favicon_io/android-chrome-512x512.png`,
    description:
      "Khatri College offers foundational classes (5–10), commerce programs (11–12), CA Foundation, and other professional courses.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    sameAs: [
      // Add your social links here if needed:
      // "https://www.facebook.com/yourpage",
      // "https://instagram.com/yourpage"
    ],
  };

  const coursesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Khatri College Courses",
    itemListElement: [
      {
        "@type": "Course",
        name: "Classes 5-10 (School Foundation)",
        description:
          "Complete foundational learning across all subjects, focusing on NCERT syllabus, concept clarity, strengthening analytical thinking, concept mastery, and preparation for board foundations.",
        provider: {
          "@type": "EducationalOrganization",
          name: "Khatri College",
        },
      },
      {
        "@type": "Course",
        name: "Classes 11 & 12 (Commerce ~ Maths)",
        description:
          "Comprehensive commerce curriculum including Accountancy & Business Studies, designed for in-depth understanding and complete preparation for board and competitive exams.",
        provider: {
          "@type": "EducationalOrganization",
          name: "Khatri College",
        },
      },
      {
        "@type": "Course",
        name: "C.A. Foundation",
        description:
          "Expert CA foundation coaching with conceptual mastery & mock tests.",
        provider: {
          "@type": "EducationalOrganization",
          name: "Khatri College",
        },
      },
      {
        "@type": "Course",
        name: "Other Professional Courses",
        description:
          "Additional commerce, finance, and competitive exam specialization programs.",
        provider: {
          "@type": "EducationalOrganization",
          name: "Khatri College",
        },
      },
    ],
  };

  return (
    <>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([jsonLd, organizationLd, coursesLd]),
        }}
      />

      <Navbar />
      <Hero />
      <About />
      <Courses />
      <Faculties />
      <Scholars />
      <Contact />
      <Footer />
    </>
  )
}

export default Home