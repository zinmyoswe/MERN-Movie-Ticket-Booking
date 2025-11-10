import React from 'react'
import HomeSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailerSection from '../components/TrailerSection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
       <HomeSection />
       <FeaturedSection />
       <TrailerSection />
       <Footer />
      
    </div>
  )
}

export default Home