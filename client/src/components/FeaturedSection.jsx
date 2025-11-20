import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle'; // Assuming this component is for background effects
import MovieCard from './MovieCard'; // Using the newly modernized MovieCard
import { useAppContext } from '../context/AppContext';

const FeaturedSection = () => {
    const navigate = useNavigate();
    const { shows } = useAppContext();

    // Utility function for navigation and scroll
    const handleNavigate = (path) => {
        navigate(path);
        // Ensure scrollTo is used correctly (window.scrollTo)
        window.scrollTo(0, 0); 
    };

    return (
        // 1. Padding remains good for large screens
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-16 overflow-hidden bg-zinc-950 text-white'>
            
            {/* --- Section Header --- */}
            <div className='relative flex items-center justify-between pb-12'>
                {/* Background effect remains (adjust its styling if needed in BlurCircle.jsx) */}
                <BlurCircle top='10px' right='100px' />
                
                {/* 2. Enhanced Title: Larger, bolder, and more impactful */}
                <h2 className='text-xl md:text2xl font-extrabold tracking-tight text-white'>
                     Now Showing
                </h2>
                
                {/* 3. Modernized 'View All' Button */}
                <button 
                    onClick={() => handleNavigate('/movies')} 
                    className='group flex items-center gap-1.5 text-base font-semibold text-white transition duration-300 hover:text-primary/80 hover:gap-3'
                >
                    View All
                    {/* Arrow animation on hover is more pronounced */}
                    <ArrowRight className='w-5 h-5 transition duration-300 group-hover:translate-x-1' />
                </button>
            </div>

            {/* --- Movie Grid --- */}
            <div 
                // 4. Improved Grid Layout: Consistent gap, slightly more items on larger screens if possible (keeping 5 for consistency with original MovieCard width)
                className='grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-1 md:gap-1 lg:gap-1 mt-4 mb-4'
            >
                {/* Slice to 5 items for a clean row if using 5 columns, or 4 for 4 columns. */}
                {shows.slice(0, 8).map((show) => (
                    <MovieCard key={show._id} movie={show} />
                ))}
            </div>

            {/* --- Show More Button --- */}
            <div className='flex justify-center mt-20'>
                {/* 5. Cinematic Button Style: Primary color, subtle hover effect, large text */}
                <button 
                    onClick={() => handleNavigate('/movies')}
                    className='px-6 py-3 text-lg bg-primary text-white font-bold rounded-4xl transition duration-300 shadow-xl shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/50'
                >
                    Show More
                </button>
            </div>
        </div>
    );
}

export default FeaturedSection;