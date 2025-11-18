import React, { useEffect, useState } from 'react'
import Title from '../../components/admin/Title'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const EditSlide = () => {
  const { id } = useParams()
  const { axios, getToken } = useAppContext()
  const navigate = useNavigate()

  const [slide, setSlide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSlide = async () => {
    try {
      const { data } = await axios.get(`/api/slide/${id}`)
      if (data.success) setSlide(data.slide)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (id) fetchSlide()
  }, [id])

  const handleSave = async () => {
    try {
      setSaving(true)
      const payload = {
        slideID: slide.slideID,
        slideImage: slide.slideImage,
        slide_title: slide.slide_title,
        slidebutton: slide.slidebutton,
        movieDetails: slide.movieDetails,
        movieTrailers: slide.movieTrailers,
      }
      const { data } = await axios.put(`/api/slide/${id}`, payload, { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        toast.success('Slide updated')
        navigate('/admin/list-slides')
      } else {
        toast.error(data.message || 'Failed to update')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred')
    }
    setSaving(false)
  }

  if (loading) return <p>Loading...</p>
  if (!slide) return <p>Slide not found</p>

  return (
    <>
      <Title text1="Edit" text2="Slide" />
      <div className='mt-6 max-w-2xl'>
        <label className='block text-sm mb-1'>Slide ID</label>
        <input value={slide.slideID} onChange={(e) => setSlide({ ...slide, slideID: e.target.value })} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Slide Image URL</label>
        <input value={slide.slideImage} onChange={(e) => setSlide({ ...slide, slideImage: e.target.value })} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Slide Title</label>
        <input value={slide.slide_title || ''} onChange={(e) => setSlide({ ...slide, slide_title: e.target.value })} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Slide Button Text</label>
        <input value={slide.slidebutton || ''} onChange={(e) => setSlide({ ...slide, slidebutton: e.target.value })} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Movie Details (JSON)</label>
        <textarea rows={4} value={JSON.stringify(slide.movieDetails || {})} onChange={(e) => {
          try { setSlide({ ...slide, movieDetails: JSON.parse(e.target.value) }) } catch { }
        }} className='w-full p-2 rounded border' />

        <label className='block text-sm mt-3 mb-1'>Movie Trailers (JSON)</label>
        <textarea rows={3} value={JSON.stringify(slide.movieTrailers || {})} onChange={(e) => {
          try { setSlide({ ...slide, movieTrailers: JSON.parse(e.target.value) }) } catch { }
        }} className='w-full p-2 rounded border' />

        <div className='mt-4'>
          <button onClick={handleSave} disabled={saving} className='bg-primary text-white px-4 py-2 rounded'>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </>
  )
}

export default EditSlide
