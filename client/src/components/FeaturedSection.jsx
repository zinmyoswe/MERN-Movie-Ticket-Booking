import { ArrowRight } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle';
import { dummyShowsData } from '../assets/assets';
import MovieCard from './MovieCard';
import { useAppContext } from '../context/AppContext';

const FeaturedSection = () => {

    const navigate = useNavigate();
    const { shows } = useAppContext()
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden '>
        <div className='relative flex items-center justify-between pt-20 pb-10'>
            <BlurCircle top='10px' right='-80px' />
            <p className='text-gray-300 font-medium text-primary text-lg max-sm:text-[14px]'>
                <button className='uppercase bg-primary text-white px-6 py-1 rounded-full hover:bg-zinmyo-200 transition-colors duration-200 cursor-pointer'>Now Showing</button>
                <button className='mx-2 uppercase border border-primary text-primary bg-transparent px-6 py-1 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer'>Coming Soon</button>
                </p>
            
            <button onClick={() => navigate('/movies')} className='max-sm:hidden group flex items-center gap-2 mx-2 uppercase border border-primary text-primary bg-transparent px-6 py-1 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer'>
                View All
                <ArrowRight className='group-hover:translate-0.5 transition w-4.5 h-4.5' />
            </button>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-16 lg:gap-16 mt-8 max-sm:mt-2'>
            {shows.slice(0,15).map((show) => (
                <MovieCard key={show._id} movie={show} />
            ))}
        </div>


        <div className='flex justify-center mt-20 mb-20'>
            <button onClick={() => {navigate('/movies'); scrollTo(0,0)}}
                className='uppercase border border-primary text-primary bg-transparent px-6 py-1 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer'>
                Show More
            </button>
        </div>
    </div>
  )
}

export default FeaturedSection