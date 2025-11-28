import About from '@/components/About'
import Contact from '@/components/Contact'
import Courses from '@/components/Courses'
import Faculty from '@/components/Faculty'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import Scholars from '@/components/Scholars'
import React from 'react'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        <Hero />
        <About />
        <Courses />
        <Faculty />
        <Scholars />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default Home