import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PlayCircle, Ticket } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import HeroSlideModal from './HeroSlideModal';
import HeroCarouselLoader from './HeroCarouselLoader';
import axios from 'axios';

const HeroSection = () => {
    const navigate = useNavigate();
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState('');

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data } = await axios.get('/api/slide');
                if (data.success) setSlides(data.slides);
            } catch (e) {
                setSlides([]);
            }
            setLoading(false);
        };
        fetchSlides();
    }, []);

    const handleTrailer = (slide) => {
        if (slide.movieTrailers && slide.movieTrailers.url) {
            setTrailerUrl(slide.movieTrailers.url);
            setShowTrailer(true);
        }
    };

    // New component or CSS required for the dark gradient overlay
    const GradientOverlay = () => (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
    );

    return (
        <div className="relative h-[80vh] flex items-center justify-center bg-black">
            {loading ? (
                <HeroCarouselLoader />
            ) : slides.length > 0 ? (
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 7000, disableOnInteraction: false }} // Adjust timing for better viewing
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="w-full h-full hero-swiper" // Added custom class for custom styling
                >
                    {slides.map((slide, idx) => (
                        <SwiperSlide key={idx}>
                            {/* Background Image Container */}
                            <div
                                className="relative h-full w-full bg-cover bg-center transition-all duration-1000"
                                style={{ backgroundImage: `url(${slide.slideImage})` }}
                            >
                                {/* 1. Dark Gradient Overlay for Readability */}
                                <GradientOverlay />

                                {/* 2. Content Container - Pinned to the bottom/center-left */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24 z-10 text-white">
                                    {/* 3. Title - Large and bold */}
                                    {/* <h1 className="text-2xl md:text-4xl lg:text-4xl font-extrabold mb-4 drop-shadow-lg leading-tight uppercase">
                                        {slide.slide_title || 'Featured Movie'}
                                    </h1> */}

                                    {/* Movie Details / Description (Slightly dimmed) */}
                                    {slide.movieDetails && (
                                        <p className="text-base md:text-xl text-gray-200 max-w-3xl mb-6 line-clamp-2">
                                            {slide.movieDetails.description || ''}
                                        </p>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* Book Tickets Button - Primary Focus */}
                                        {slide.slidebutton && (
                                            <button
                                                onClick={() => navigate('/movies')}
                                                className="flex items-center gap-2 px-6 py-2 bg-zinmyo-400 text-zinc-950 font-semibold text-lg 
                                                           rounded-lg shadow-xl hover:bg-zinmyo-200 hover:text-white transition duration-300 transform hover:scale-[1.02] uppercase tracking-wider"
                                            >
                                                {slide.slidebutton}
                                                <Ticket className="h-5 w-5 ml-1" />
                                            </button>
                                        )}

                                        {/* Watch Trailer Button - Secondary Focus (Ghost/Outline style) */}
                                        {slide.movieTrailers && slide.movieTrailers.url && (
                                            <button
                                                onClick={() => handleTrailer(slide)}
                                                className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold text-lg 
                                                           rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black transition duration-300"
                                            >
                                                <PlayCircle className="w-6 h-6" fill="currentColor" /> 
                                                Watch Trailer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="flex flex-col items-center justify-center h-full w-full text-white">
                    No slides available
                </div>
            )}
            {showTrailer && (
                <HeroSlideModal trailerUrl={trailerUrl} onClose={() => setShowTrailer(false)} />
            )}
        </div>
    );
};

export default HeroSection;