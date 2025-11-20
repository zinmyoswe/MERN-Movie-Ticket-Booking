import React, { useState } from 'react'
import Title from '../../components/admin/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import "./AdminZin.css"

const AddSlide = () => {
  const { axios, getToken } = useAppContext()
  const navigate = useNavigate()

  const [slideID, setSlideID] = useState('')
  const [slideImage, setSlideImage] = useState('')
  const [slideTitle, setSlideTitle] = useState('')
  const [slideButton, setSlideButton] = useState('')
  const [movieDetails, setMovieDetails] = useState('')
  const [movieTrailers, setMovieTrailers] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!slideID || !slideImage) return toast.error('Slide ID and Slide Image are required')
    try {
      setLoading(true)
      const payload = {
        slideID,
        slideImage,
        slide_title: slideTitle || null,
        slidebutton: slideButton || null,
        movieDetails: movieDetails ? JSON.parse(movieDetails) : null,
        movieTrailers: movieTrailers ? JSON.parse(movieTrailers) : null,
      }
      const { data } = await axios.post('/api/slide', payload, { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        toast.success('Slide added successfully')
        navigate('/admin/list-slides')
      } else {
        toast.error(data.message || 'Failed to add slide')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white min-h-screen p-6 adminzin">
      <Title text1="Add" text2="Slide" />

      <div className="mt-6 max-w-2xl bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-4">
        
        {/* Slide ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slide ID *</label>
          <input
            value={slideID}
            onChange={(e) => setSlideID(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
            placeholder="Enter Slide ID"
          />
        </div>

        {/* Slide Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slide Image URL *</label>
          <input
            value={slideImage}
            onChange={(e) => setSlideImage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Slide Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slide Title</label>
          <input
            value={slideTitle}
            onChange={(e) => setSlideTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
            placeholder="Enter Slide Title"
          />
        </div>

        {/* Slide Button */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slide Button Text</label>
          <input
            value={slideButton}
            onChange={(e) => setSlideButton(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
            placeholder="Enter Button Text"
          />
        </div>

        {/* Movie Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Movie Details (JSON or leave empty)</label>
          <textarea
            rows={4}
            value={movieDetails}
            onChange={(e) => setMovieDetails(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition resize-none"
            placeholder='{"title":"Movie Name","genre":"Action"}'
          />
        </div>

        {/* Movie Trailers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Movie Trailers (JSON, e.g., YouTube embed object)</label>
          <textarea
            rows={3}
            value={movieTrailers}
            onChange={(e) => setMovieTrailers(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition resize-none"
            placeholder='{"youtube":"https://youtube.com/..."}'
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Slide'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddSlide
