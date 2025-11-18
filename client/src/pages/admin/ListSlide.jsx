import React, { useEffect, useState } from 'react'
import Title from '../../components/admin/Title'
import Loading from '../../components/Loading'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const ListSlide = () => {
  const { axios, getToken, user } = useAppContext()
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
    <>
      <Title text1="List" text2="Slides" />
      <div className='mt-6 max-w-4xl overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>Slide ID</th>
              <th className='p-2 font-medium pl-5'>Image</th>
              <th className='p-2 font-medium pl-5'>Title</th>
              <th className='p-2 font-medium pl-5'>Button</th>
              <th className='p-2 font-medium pl-5'>Actions</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {slides.map((s, i) => (
              <tr key={i} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                <td className='p-2 min-w-45 pl-5'>{s.slideID}</td>
                <td className='p-2'><img src={s.slideImage} alt='' className='h-12 object-cover rounded' /></td>
                <td className='p-2'>{s.slide_title || '—'}</td>
                <td className='p-2'>{s.slidebutton || '—'}</td>
                <td className='p-2'>
                  <button onClick={() => navigate(`/admin/edit-slide/${s._id}`)} className='mr-3 text-blue-600'>Edit</button>
                  <button onClick={() => navigate(`/admin/delete-slide/${s._id}`)} className='text-red-600'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListSlide
