import React from 'react'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'

// --- Constants for Readability & Consistency (Copied from Movies.jsx) ---
const SECTION_PADDING = 'px-6 md:px-16 lg:px-24 xl:px-44';
// Added Loading component for consistency, although not strictly required by your original Favourite.jsx
// import Loading from '../components/Loading'; // Assuming you might want to use a loading state here too

const Favourite = () => {

    const { favouriteMovies } = useAppContext()

    // 1. Handle Empty State with Centered Message (Simplified based on original logic)
    if (favouriteMovies.length === 0) {
        return (
            <div className='flex items-center justify-center min-h-[80vh] pt-24 pb-40'>
                <p className='text-gray-400 text-xl font-semibold'>
                    Your favourite list is empty. Add some movies!
                </p>
            </div>
        );
    }
    
    // 2. Render Main Content using Movies.jsx UI structure
    return (
        // Apply responsive padding and vertical spacing from Movies.jsx
        <div className={`relative ${SECTION_PADDING} overflow-hidden min-h-[80vh] pt-24 pb-40`}>
            
            {/* Background Blur Effects (Adjusted positions for visual variety) */}
            <BlurCircle top='100px' right='-50px' />
            <BlurCircle bottom='-100px' left='-100px' />
            
            {/* Header / Section Title (Copied from Movies.jsx style) */}
            <header className='mb-12 md:mb-16 text-center'>
                <h1 className='text-5xl md:text-6xl font-extrabold text-white leading-tight'>
                    Your <span className='text-primary'>Favourites</span>
                </h1>
                <p className='text-lg text-gray-400 mt-3'>
                    The movies and shows you've saved for later.
                </p>
            </header>

            {/* Movie Grid: Using the responsive grid from Movies.jsx */}
            <div className='
                grid 
                grid-cols-2           /* Mobile: 2 columns */
                sm:grid-cols-3        /* Small screens: 3 columns */
                lg:grid-cols-4        /* Large screens: 4 columns */
                xl:grid-cols-5        /* Extra-large screens: 5 columns */
                gap-x-6 gap-y-12 
            '>
                {favouriteMovies.map((movie) => (
                    <MovieCard movie={movie} key={movie._id} />
                ))}
            </div>
            
        </div>
    )
}

export default Favourite;