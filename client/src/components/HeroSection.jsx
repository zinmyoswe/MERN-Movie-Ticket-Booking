import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, PlayCircle, Ticket } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import HeroSlideModal from './HeroSlideModal'
import HeroCarouselLoader from './HeroCarouselLoader'
import axios from 'axios'

const HeroSection = () => {
  const navigate = useNavigate()
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)
  const [trailerUrl, setTrailerUrl] = useState('')

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await axios.get('/api/slide')
        if (data.success) setSlides(data.slides)
      } catch (e) {
        setSlides([])
      }
      setLoading(false)
    }
    fetchSlides()
  }, [])

  const handleTrailer = (slide) => {
    if (slide.movieTrailers && slide.movieTrailers.url) {
      setTrailerUrl(slide.movieTrailers.url)
      setShowTrailer(true)
    }
  }

  return (
    <div className='relative h-screen flex items-center justify-center bg-black'>
      {loading ? (
        <HeroCarouselLoader />
      ) : slides.length > 0 ? (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 30000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className='w-full h-full'
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 h-screen w-full bg-cover bg-center' style={{ backgroundImage: `url(${slide.slideImage})` }}>
                <h1 className='text-3xl md:text-[50px] leading-18 font-semibold mt-20 md:mt-80 lg:mt-80 drop-shadow-lg text-white'>{slide.slide_title || ''}</h1>
                {slide.slidebutton && (
                  <button onClick={() => navigate('/movies')} className='flex items-center gap-1 px-8 py-4 text-sm md:text-[16px] bg-primary hover:bg-zinmyo-200 transition uppercase font-medium cursor-pointer'>
                    {slide.slidebutton}
                    <Ticket  className="h-7  ml-2"/>
                  </button>
                )}
                {slide.movieTrailers && slide.movieTrailers.url && (
                  <button onClick={() => handleTrailer(slide)} className='flex items-center gap-2 px-4 py-2 bg-white/80 rounded text-primary font-semibold mt-2'>
                    <PlayCircle className='w-5 h-5' /> Watch Trailer
                  </button>
                )}
                {slide.movieDetails && (
                  <div className='mt-4 text-white/80 text-lg max-w-xl'>{slide.movieDetails.description || ''}</div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className='flex flex-col items-center justify-center h-full w-full text-white'>No slides available</div>
      )}
      {showTrailer && (
        <HeroSlideModal trailerUrl={trailerUrl} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  )
}

export default HeroSection