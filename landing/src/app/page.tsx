import About from '@/components/About'
import Contact from '@/components/Contact'
import Courses from '@/components/Courses'
import Faculties from '@/components/Faculties'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import Scholars from '@/components/Scholars'
import React from 'react'

const Home = () => {
  return (
    <>
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