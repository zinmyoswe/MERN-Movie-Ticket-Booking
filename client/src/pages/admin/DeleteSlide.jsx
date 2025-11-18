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

  useEffect(() => {
    const doDelete = async () => {
      if (!id) return navigate('/admin/list-slides')
      try {
        setLoading(true)
        const { data } = await axios.delete(`/api/slide/${id}`, { headers: { Authorization: `Bearer ${await getToken()}` } })
        if (data.success) {
          toast.success('Slide deleted')
        } else {
          toast.error(data.message || 'Failed to delete')
        }
      } catch (error) {
        console.error(error)
        toast.error('An error occurred')
      }
      setLoading(false)
      navigate('/admin/list-slides')
    }
    doDelete()
  }, [id])

  return (
    <>
      <Title text1="Delete" text2="Slide" />
      <p className='mt-6'>{loading ? 'Deleting...' : 'Processing deletion...'}</p>
    </>
  )
}

export default DeleteSlide
