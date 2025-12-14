import React from 'react'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import Loading from '../components/Loading'

// --- Constants for Readability & Consistency ---
const SECTION_PADDING = 'px-6 md:px-16 lg:px-24 xl:px-44';

const Movies = () => {

    // Destructuring shows from context
    const { shows } = useAppContext()

    // Show Loading component while data is being fetched or is empty
    if (shows.length === 0) {
        return <Loading />;
    }

    // Render the main content
    return (
        <div className={`relative ${SECTION_PADDING} overflow-hidden min-h-[80vh] pt-24 pb-40`}>
            
            {/* Background Blur Effects (Adjusted for better coverage) */}
            <BlurCircle top='150px' left='-100px' />
            <BlurCircle bottom='-50px' right='0px' />
            
            {/* Header / Section Title */}
            <header className='mb-12 md:mb-16 text-center'>
                <h1 className='text-5xl md:text-6xl font-extrabold text-white leading-tight'>
                    Explore <span className='text-primary'>All Films</span>
                </h1>
                <p className='text-lg text-gray-400 mt-3'>
                    Discover the complete list of movies currently showing and coming soon.
                </p>
            </header>

            {/* Movie Grid: Replacing flex-wrap with a responsive grid */}
            <div className='
                grid 
                grid-cols-2          /* Mobile: 2 columns */
                sm:grid-cols-3       /* Small screens: 3 columns */
                lg:grid-cols-4       /* Large screens: 4 columns */
                xl:grid-cols-5       /* Extra-large screens: 5 columns */
                gap-x-6 gap-y-12 
            '>
                {shows.map((movie) => (
                    <MovieCard movie={movie} key={movie._id} />
                ))}
            </div>
            
        </div>
    )
}

export default Movies;