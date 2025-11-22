import { Star } from 'lucide-react'; // Changed StarIcon to Star for consistency/simplicity
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timeFormat from '../lib/timeFormat';
import { useAppContext } from '../context/AppContext';

// Assuming movie structure is consistent with the original
const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const { image_base_url } = useAppContext();

    // Utility function to handle navigation and scrolling
    const handleNavigation = () => {
        navigate(`/movies/${movie._id}`);
        // Ensure scrollTo is part of a global object or imported if needed,
        // but it typically works globally in a browser environment.
        window.scrollTo(0, 0); 
    };

    const releaseYear = new Date(movie.release_date).getFullYear();
    const genresText = (movie.genres || []).slice(0, 2).map(genre => genre.name).join(" / ");
    const runtimeText = timeFormat(movie.runtime);
    const formattedRating = (movie.vote_average || 0).toFixed(1);

    return (
        // 1. Sleeker container: Slightly larger card, more pronounced shadow on hover.
        <div 
            className='group relative flex flex-col bg-primary uppercase  rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out hover:scale-[1.02] hover:shadow-primary/50 w-40 md:w-56 lg:w-[234px] cursor-pointer mb-4'
            onClick={handleNavigation} // Make the whole card clickable for navigation
        >
            
            {/* 2. Image and Rating Overlay */}
            <div className='relative w-full aspect-[2/3] overflow-hidden'>
                <img 
                    src={image_base_url + movie.poster_path} 
                    alt={`Poster for ${movie.title}`} 
                    className='w-full h-full transition-transform duration-500 group-hover:scale-105' 
                />
                
                {/* Rating Overlay: Positioned in the corner for a cinematic look */}
                {/* <div className='absolute top-3 right-3 flex items-center bg-zinc-950/70 backdrop-blur-sm p-2 rounded-lg text-white font-bold text-sm shadow-lg'>
                    <Star className='w-4 h-4 text-primary fill-primary mr-1' />
                    {formattedRating}
                </div> */}
            </div>

            {/* 3. Content Area: Padding and text alignment for cleanliness */}
            <div className='text-center mt-1'>
                
                {/* Title */}
                <h3 className='text-lg font-bold text-white truncate mb-1' title={movie.title}>
                    {movie.title}
                </h3>

                {/* Metadata: Use a clear, separate line for better readability */}
                {/* <p className='text-xs text-gray-400 mb-3'>
                    <span className='font-medium'>{releaseYear}</span> 
                    <span className='mx-1'>&middot;</span> 
                    {genresText} 
                    <span className='mx-1'>&middot;</span> 
                    {runtimeText}
                </p> */}

                {/* 4. Action Button */}
                {/* <button 
                    // Prevent navigation from firing twice when clicking the button inside the card
                    onClick={(e) => { e.stopPropagation(); handleNavigation(); }} 
                    className='mt-auto w-full py-2 text-sm bg-primary text-zinc-950 font-semibold rounded-lg transition duration-300 hover:bg-primary/80 hover:shadow-md hover:shadow-primary/50'
                >
                    Get Tickets
                </button> */}
            </div>
        </div>
    );
}

export default MovieCard;