import React from 'react'

const HeroSlideModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null
  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-4 max-w-2xl w-full relative'>
        <button onClick={onClose} className='absolute top-2 right-2 text-black text-xl'>×</button>
        <iframe
          width='100%'
          height='400'
          src={trailerUrl}
          title='Trailer'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default HeroSlideModal
