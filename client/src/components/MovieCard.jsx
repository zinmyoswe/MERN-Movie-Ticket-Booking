import { Star, Clock, Ticket } from 'lucide-react'; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timeFormat from '../lib/timeFormat';
import { useAppContext } from '../context/AppContext';

// Constants for consistent styling
const METADATA_TEXT_CLASS = 'text-xs text-gray-300 font-light';
const BUTTON_CLASS = 'w-full py-2 px-4 mt-3 rounded-md text-sm font-medium text-zinc-950 hover:bg-zinc-100 transition-all duration-300 shadow-lg cursor-pointer';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const { image_base_url } = useAppContext();

    const handleNavigation = (e) => {
        navigate(`/movies/${movie._id}`);
        window.scrollTo(0, 0); 
    };

    // Prepare data
    const genresText = (movie.genres || []).slice(0, 2).map(genre => genre.name).join(" / ");
    const runtimeText = timeFormat(movie.runtime || 138); 
    const formattedRating = (movie.vote_average || 0).toFixed(1);

    return (
        // FIX: Removed fixed width classes (w-40, md:w-56, lg:w-[234px]) and added w-full.
        // The card size is now determined entirely by the parent grid columns.
        <div 
            className='group relative w-full bg-zinc-900 rounded-xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out hover:scale-[1.05] hover:shadow-2xl hover:shadow-primary/40 cursor-pointer'
            onClick={handleNavigation} 
        >
            
            {/* Image Area (Main Content) */}
            <div className='relative w-full aspect-[2/3] overflow-hidden'>
                <img 
                    src={image_base_url + movie.poster_path} 
                    alt={`Poster for ${movie.title}`} 
                    className="
                        w-full h-full object-cover rounded-xl 
                        transition-opacity duration-300 group-hover:opacity-95
                    " 
                />
                
                {/* Always visible Rating Badge (Top Right) */}
                <div className='absolute top-3 right-3 flex items-center bg-zinc-950/70 backdrop-blur-sm px-2 py-1 rounded-full text-white font-semibold text-xs shadow-lg border border-primary/50'>
                    <Star className='w-3 h-3 text-primary fill-primary mr-1' />
                    {formattedRating}
                </div>
            </div>

            {/* The Modern Hover Overlay */}
            <div 
                className='absolute inset-0 z-10 rounded-xl transition-opacity duration-300
        /* Start with full transparency and a low-opacity black background */
        bg-black/40 opacity-0
        /* On hover, reveal the content and increase the darkening */
        group-hover:opacity-100 group-hover:bg-black/60
        flex flex-col justify-end p-4'
                style={{
                    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))'
                }}
            >
                
                {/* Movie Title */}
                <h3 className='text-xl font-extrabold text-white leading-tight mb-2 line-clamp-2'>
                    {movie.title}
                </h3>

                {/* Genres */}
                <p className={`${METADATA_TEXT_CLASS} mb-1`}>
                    {genresText}
                </p>

                {/* Runtime */}
                <div className='flex items-center mb-4'>
                    <Clock className='w-4 h-4 text-white mr-2 mt-1' />
                    <span className={METADATA_TEXT_CLASS}>
                        {runtimeText}
                    </span>
                </div>
                
                {/* Buy Ticket Button (CTA) */}
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        handleNavigation(); 
                    }} 
                    className={`${BUTTON_CLASS} bg-white mb-8 text-zinc-950 hover:bg-white`}
                >
                    <div className='flex items-center justify-center gap-2'>
                        
                         MORE INFO
                    </div>
                </button>
                
            </div>
            
            {/* Always visible, but subtle title at the bottom (optional for clarity) */}
             <div className='absolute bottom-0 left-0 right-0 p-2 text-center bg-zinc-900/50 backdrop-blur-sm'>
                 <p className='text-xs text-white font-medium truncate'>{movie.title}</p>
             </div>
        </div>
    );
}

export default MovieCard;