import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {

    const navigate = useNavigate();
  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16
    lg:px-36 bg-[url("/heropcineplex.jpg")] bg-cover bg-center h-screen'>
        <div className="flex justify-center items-center gap-1 mt-20 max-md:hidden">
            <img src="/1.png" alt="" className="max-h-8 lg:h-8" />
            <img src="/2.png" alt="" className="max-h-8 lg:h-8" />
            <img src="/3.png" alt="" className="max-h-8 lg:h-8" />
            <img src="/4.png" alt="" className="max-h-8 lg:h-8" />
            <img src="/5.png" alt="" className="max-h-8 lg:h-8" />
        </div>
        

        <h1 className='text-5xl md:text-[70px] md: leading-18 font-semibold'>PCineplex</h1>

        <div className='flex items-center gap-4 text-white text-2xl'>
            <span>Enjoy 10% Cashback</span>
         
            
        </div>

        <div className='flex items-center gap-4 text-gray-300'>
        
                 <span>For your movie bookings</span>
            
        </div>

        <button onClick={() => navigate('/movies')} className='flex items-center gap-1 px-6 py-3
        text-sm bg-primary hover:bg-zinmyo-200 transition rounded-full font-medium cursor-pointer'>
            Explore Movies
            <ArrowRight className='w-5 h-5'/>
        </button>
    </div>
  )
}

export default HeroSection