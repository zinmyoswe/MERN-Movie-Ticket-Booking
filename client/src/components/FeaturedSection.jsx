import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import { useAppContext } from '../context/AppContext';

// --- Constants for Readability & Consistency ---
const SECTION_PADDING = 'px-6 md:px-16 lg:px-24 xl:px-44';
// Refined button styles for better consistency and hover effects
const TAB_BUTTON_CLASSES = 'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap';
const VIEW_ALL_BUTTON_CLASSES = 'px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out';

const FeaturedSection = () => {
    const navigate = useNavigate();
    // Assuming 'shows' from context is the full list of movies/shows
    const { shows } = useAppContext(); 
    const [activeTab, setActiveTab] = useState('showing'); 

    // Filter/slice the shows based on your application logic and active tab
    // For this example, we keep the original logic for simplicity, but a real app 
    // would filter based on 'showing' or 'coming' status.
    const filteredShows = shows.slice(0, 15); 
    const isShowingActive = activeTab === 'showing';

    return (
        // Adjusted padding for a cleaner look
        <div className={`bg-transparent ${SECTION_PADDING} overflow-hidden pt-16 pb-20`}>
            
            {/* Header: Section Title, Tabs, and View All Button */}
            <div className='relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                
                {/* Section Title - Made more prominent */}
                <h2 className='text-3xl md:text-4xl font-extrabold text-white'>
                    Featured <span className='text-primary'>Movies</span>
                </h2>

                {/* Tab Navigation (Segmented Control) */}
                <div className='flex items-center space-x-2 bg-zinc-800 p-1 rounded-full order-3 sm:order-none'>
                    
                    {/* Now Showing Tab */}
                    <button 
                        onClick={() => setActiveTab('showing')}
                        // Apply refined button classes
                        className={`
                            ${TAB_BUTTON_CLASSES}
                            ${isShowingActive 
                                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                : 'bg-transparent text-gray-400 hover:text-white hover:bg-zinc-700'
                            }
                        `}
                    >
                        Now Showing
                    </button>
                    
                    {/* Coming Soon Tab */}
                    <button 
                        onClick={() => setActiveTab('coming')}
                        // Apply refined button classes
                        className={`
                            ${TAB_BUTTON_CLASSES}
                            ${!isShowingActive 
                                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                : 'bg-transparent text-gray-400 hover:text-white hover:bg-zinc-700'
                            }
                        `}
                    >
                        Coming Soon
                    </button>
                </div>

                {/* View All Button - Visible on larger screens, using auto margin to push it to the end */}
                <button 
                    onClick={() => navigate('/movies')} 
                    className={`
                        hidden lg:flex items-center gap-1 
                        ${VIEW_ALL_BUTTON_CLASSES} 
                        bg-transparent border border-primary text-primary 
                        hover:bg-primary hover:text-white group flex-shrink-0
                    `}
                >
                    View All
                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                </button>

                {/* BlurCircle positioning adjusted */}
                <BlurCircle top='10px' right='-80px' />

            </div>

            {/* Movie Grid: Refined responsiveness for better scaling on different devices */}
            <div className='
                grid 
                grid-cols-2          /* Default: 2 columns */
                sm:grid-cols-3       /* Small screens: 3 columns */
                lg:grid-cols-4       /* Large screens: 4 columns */
                xl:grid-cols-5       /* Extra-large screens: 5 columns */
                gap-x-6 gap-y-10 mt-12
            '>
                {filteredShows.map((show) => (
                    // Note: Ensure MovieCard is robust and handles the 'show' data correctly
                    <MovieCard key={show._id} movie={show} />
                ))}
            </div>

            {/* Show More Button (Visible only on smaller views where 'View All' is hidden) */}
            <div className='flex justify-center mt-16 lg:hidden'>
                <button 
                    onClick={() => {navigate('/movies'); scrollTo(0,0)}}
                    className={`
                        ${VIEW_ALL_BUTTON_CLASSES} w-full sm:w-auto 
                        uppercase border-2 border-primary text-primary bg-transparent 
                        hover:bg-primary hover:text-white
                    `}
                >
                    Show More
                </button>
            </div>
        </div>
    );
}

export default FeaturedSection;