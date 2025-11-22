import React, {  useState } from 'react'
import BlurCircle from '../components/BlurCircle'
import {  ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const DateSelect = ({dateTime, id}) => {

    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedCinemaId, setSelectedCinemaId] = useState(null);
    const [selectedShowId, setSelectedShowId] = useState(null);

    const onBookHandler = () => {
        if(!selectedDate || !selectedShowId || !selectedCinemaId) {
            return toast('Please select a date, cinema, and showtime')
        }
        navigate(`/movies/${id}/${selectedShowId}/${selectedCinemaId}`);
        scrollTo(0,0);
    }


  return (
    <div id='dateSelect' className='pt-30'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-10
        relative p-8 bg-primary/10 border-primary/20 rounded-lg'>
            <BlurCircle top='-100px' left='-100px' />
            <BlurCircle top='100px' right='0px' />

            <div>
                <p className='text-lg font-semibold'>Choose Date</p>
                <div className='flex items-center gap-0 text-sm mt-5'>
                    <ChevronLeftIcon width={28} />
                    <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
                        {Object.keys(dateTime).map((date) => (
                            <button onClick={() => {setSelectedDate(date); setSelectedCinemaId(null); setSelectedShowId(null);}} key={date} className={`flex flex-col items-center
                            justify-center h-14 w-14 aspect-square rounded cursor-pointer
                            ${selectedDate === date ? 'bg-primary text-white' : 'border border-primary/70'}
                            `}>
                                <span>{new Date(date).getDate()}</span>
                                <span>{new Date(date).toLocaleDateString("en-US", {month: "short"})}</span>
                            </button>
                        ))}
                    </span>
                    <ChevronRightIcon width={28} />
                </div>
            </div>
            <button 
            onClick={onBookHandler}
            className='bg-primary text-white px-8 py-2 mt-6 rounded
            hover:bg-primary/90 transition-all cursor-pointer'>
                Book Now
            </button>
        </div>

        {selectedDate && Object.keys(dateTime[selectedDate]).length > 0 && (
            <div className='mt-8'>
                <p className='text-lg font-semibold mb-4'>Choose Cinema</p>
                <div className='flex flex-wrap gap-4'>
                    {Object.entries(dateTime[selectedDate]).map(([cinemaName, shows]) => (
                        <button
                            key={cinemaName}
                            onClick={() => {
                                setSelectedCinemaId(shows[0].cinemaId);
                                setSelectedShowId(null);
                            }}
                            className={`px-6 py-2 rounded border transition
                                ${selectedCinemaId === shows[0].cinemaId
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-gray-700 hover:border-primary'
                                }`}
                        >
                            {cinemaName}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {selectedDate && selectedCinemaId && Object.entries(dateTime[selectedDate]).find(([name, shows]) => shows[0].cinemaId === selectedCinemaId)?.[1].length > 0 && (
            <div className='mt-8'>
                <p className='text-lg font-semibold mb-4'>Choose Time</p>
                <div className='flex flex-wrap gap-4'>
                    {Object.entries(dateTime[selectedDate]).find(([name, shows]) => shows[0].cinemaId === selectedCinemaId)?.[1].map((show, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedShowId(show.showId)}
                            className={`px-6 py-2 rounded border transition
                                ${selectedShowId === show.showId
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-gray-700 hover:border-primary'
                                }`}
                        >
                            {new Date(show.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </button>
                    ))}
                </div>
            </div>
        )}



    </div>
  )
}

export default DateSelect