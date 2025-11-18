import React, { useEffect, useState } from 'react'
import Title from '../../components/admin/Title'
import Loading from '../../components/Loading'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const ListSlide = () => {
  const { axios, user } = useAppContext()
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchSlides = async () => {
    try {
      const { data } = await axios.get('/api/slide')
      if (data.success) setSlides(data.slides)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSlides()
  }, [user])

  return !loading ? (
    <div className="bg-white min-h-screen p-6">
      <Title text1="List" text2="Slides" />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {slides.map((slide) => (
          <div
            key={slide._id}
            className="bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col md:flex-row"
          >
            {/* Left: Slide Image */}
            <div className="md:w-1/2 w-full h-48 md:h-auto">
              <img
                src={slide.slideImage}
                alt={slide.slide_title || slide.slideID}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Slide Details */}
            <div className="md:w-1/2 w-full p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-gray-800 font-semibold text-lg truncate">{slide.slide_title || '—'}</h3>
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Slide ID:</span> {slide.slideID}
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Button:</span> {slide.slidebutton || '—'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/admin/edit-slide/${slide._id}`)}
                  className="border border-primary text-primary bg-transparent px-6 py-1 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/admin/delete-slide/${slide._id}`)}
                  className="bg-red-600 text-white px-6 py-1 rounded-full hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default ListSlide
