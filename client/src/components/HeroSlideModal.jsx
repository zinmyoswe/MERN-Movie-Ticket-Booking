import React from 'react'
import { X } from 'lucide-react' 

const HeroSlideModal = ({ trailerUrl, onClose }) => {
    if (!trailerUrl) return null

    const AspectRatioContainer = ({ children }) => (
        <div className="relative pt-[56.25%] w-full h-0">
            <div className="absolute inset-0">
                {children}
            </div>
        </div>
    );
    
    const getEmbedUrl = (url) => {
        if (url.includes('youtube.com/watch?v=')) {
            // Added '?autoplay=1' to start the video immediately upon opening the modal
            return url.replace('watch?v=', 'embed/') + '?autoplay=1';
        }
        return url;
    };

    return (
        <div 
            className='fixed inset-0 bg-black/90 flex items-center justify-center z-[100]' 
            onClick={onClose} 
        >
            <div 
                // Increased z-index to ensure the button is visible over the iframe
                className='relative max-w-5xl w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] shadow-2xl rounded-xl overflow-hidden z-[101]' 
                onClick={(e) => e.stopPropagation()} 
            >
                
                {/* 1. CLOSE BUTTON FIX: Placed absolutely inside the container (top right corner). 
                  2. Styling: Uses a soft background for contrast against the video image. 
                */}
                <button 
                    onClick={onClose} 
                    className='absolute top-3 right-3 p-2 text-white transition z-50 rounded-full bg-black/50 backdrop-blur-md border border-white/0 hover:border-white hover:bg-white/30'
                    aria-label="Close trailer modal"
                >
                    <X 
                        className="w-5 h-5 md:w-6 md:h-6" 
                        strokeWidth={3} 
                    />
                </button>

                {/* 4. Iframe with 16:9 Aspect Ratio */}
                <AspectRatioContainer>
                    <iframe
                        width='100%'
                        height='100%'
                        src={getEmbedUrl(trailerUrl)} 
                        title='Movie Trailer'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        allowFullScreen
                        // KEY FIX: Added z-index to iframe as well.
                        className="rounded-xl z-[40]"
                    />
                </AspectRatioContainer>
            </div>
        </div>
    )
}

export default HeroSlideModal