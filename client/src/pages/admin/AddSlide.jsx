import React, { useState } from 'react'
import Title from '../../components/admin/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

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
    if (!slideID || !slideImage) return toast.error('slideID and slideImage are required')
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
        toast.success('Slide added')
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
    <>
      <Title text1="Add" text2="Slide" />
      <div className='mt-6 max-w-2xl'>
        <label className='block text-sm mb-1'>Slide ID *</label>
        <input value={slideID} onChange={(e) => setSlideID(e.target.value)} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Slide Image URL *</label>
        <input value={slideImage} onChange={(e) => setSlideImage(e.target.value)} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Slide Title</label>
        <input value={slideTitle} onChange={(e) => setSlideTitle(e.target.value)} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Slide Button Text</label>
        <input value={slideButton} onChange={(e) => setSlideButton(e.target.value)} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Movie Details (JSON or leave empty)</label>
        <textarea rows={4} value={movieDetails} onChange={(e) => setMovieDetails(e.target.value)} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Movie Trailers (JSON, e.g. Youtube embed object)</label>
        <textarea rows={3} value={movieTrailers} onChange={(e) => setMovieTrailers(e.target.value)} className='w-full p-2 rounded border' />

        <div className='mt-4'>
          <button onClick={handleSubmit} disabled={loading} className='bg-primary text-white px-4 py-2 rounded'>
            {loading ? 'Adding...' : 'Add Slide'}
          </button>
        </div>
      </div>
    </>
  )
}

export default AddSlide
