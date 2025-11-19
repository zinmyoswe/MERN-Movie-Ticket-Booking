import React, { useEffect, useState } from 'react'
import Title from '../../components/admin/Title'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const DeleteSlide = () => {
  const { id } = useParams()
  const { axios, getToken } = useAppContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingSlide, setLoadingSlide] = useState(true)
  const [slide, setSlide] = useState(null)

  useEffect(() => {
    if (!id) return navigate('/admin/list-slides')

    const fetchSlide = async () => {
      try {
        setLoadingSlide(true)
        const { data } = await axios.get(`/api/slide/${id}`)
        if (data && data.success) {
          setSlide(data.slide || data.data || null)
        } else {
          setSlide(null)
        }
      } catch (err) {
        console.error('Failed to fetch slide', err)
        toast.error('Failed to load slide')
      } finally {
        setLoadingSlide(false)
      }
    }

    fetchSlide()
  }, [id])

  const handleCancel = () => navigate('/admin/list-slides')

  const handleDelete = async () => {
    if (!id) return
    try {
      setLoading(true)
      const { data } = await axios.delete(`/api/slide/${id}`, { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data && data.success) {
        toast.success('Slide deleted')
        navigate('/admin/list-slides')
      } else {
        toast.error(data.message || 'Failed to delete')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Title text1="Delete" text2="Slide" />

      <div className="mt-6">
        {loadingSlide ? (
          <p>Loading slide...</p>
        ) : slide ? (
          <div className="max-w-xl bg-white shadow rounded p-6">
            {slide.slideImage && (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img src={slide.slideImage} alt="slide image" className="w-full h-48 object-cover rounded mb-4" />
            )}

            <h3 className="text-lg font-semibold">{slide.slide_title || 'Untitled Slide'}</h3>
            {slide.slidebutton && <p className="text-sm text-gray-600 mt-2">Button: {slide.slidebutton}</p>}
            <p className="mt-4 text-red-700">Are you sure you want to permanently delete this slide?</p>

            <div className="flex gap-3 mt-6">
              <button onClick={handleCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60">
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        ) : (
          <p>Slide not found.</p>
        )}
      </div>
    </>
  )
}

export default DeleteSlide
