import React, {  useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const SeatLayout = () => {

  const groupRows = [["A","B"], ["C","D"], ["E","F"], ["G","H"], ["I","J"]];

  const {id: movieId, showId, cinemaId} = useParams();
  console.log('SeatLayout Params - movieId:', movieId, 'showId:', showId, 'cinemaId:', cinemaId);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const navigate = useNavigate();

  const {axios, getToken, user} = useAppContext()

  const getShow = async () => {
    try {
      const {data} = await axios.get(`/api/show/single/${showId}`);
      console.log('getShow API Response data:', data);
      if(data.success){
        setShow(data.show)
        console.log('Show state set:', data.show);
      }
    } catch (error) {
      console.error('Error fetching single show:', error);
    }
  }

  const handleSeatClick = (seatId) => {
    if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
      return toast('You can select maximum 5 seats');
    }
    if(occupiedSeats.includes(seatId)){
      return toast('This seat is already booked')
    }
    if (selectedSeats.includes(seatId)) {
        setSelectedSeats(prev => prev.filter(seat => seat !== seatId));
    } else {
        setSelectedSeats(prev => [...prev, seatId]);
    }
  }

  const renderSeats = (row, count = 9) => {
    return (
      <div key={row} className='flex gap-2 mt-2'>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            return (
              <button
                key={seatId}
                onClick={() => handleSeatClick(seatId)}
                className={`h-8 w-8 border border-primary/60 cursor-pointer 
                  ${selectedSeats.includes(seatId) && "bg-primary text-white"}
                  ${occupiedSeats.includes(seatId) && "opacity-50" }
                  `}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const getOccupiedSeats = async () => {
    try {
      const {data} = await axios.get(`/api/booking/seats/${showId}`)
      console.log('getOccupiedSeats API Response data:', data);
      if(data.success){
        setOccupiedSeats(data.occupiedSeats)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching occupied seats:', error);
    }
  }

  const bookTickets = async () => {
    try {
      if(!user) return toast.error('Please login to proceed')

        if(!selectedSeats.length) return toast.error('Please select seats');

        const {data} = await axios.post('/api/booking/create', {showId: showId, cinemaId: cinemaId, selectedSeats},
          {headers: { Authorization: `Bearer ${await getToken()}`}})

        if(data.success){
          window.location.href = data.url;
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
      console.error('Error booking tickets:', error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getShow()
    getOccupiedSeats()
  }, []);

  useEffect(() => {
    if (show) {
      console.log('Rendering <h1> with:', {
        movieTitle: show.movie.title,
        cinemaName: show.cinemas && show.cinemas.length > 0 ? show.cinemas[0].cinemaName : 'N/A',
        showDateTime: show.showDateTime
      });
    }
  }, [show]);

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      
      {/* Seat Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top='-100px' left='-100px'/>
        <BlurCircle top='0' left='0'/>
        <h1 className='text-2xl font-semibold mb-4'>{show.movie.title} - {show.cinemas[0].cinemaName} - {isoTimeFormat(show.showDateTime)}</h1>
        <img src={assets.screenImage2} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
             {groupRows[0].map(row => renderSeats(row))}
          </div>

          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

          <button onClick={bookTickets}
          className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary
          hover:bg-zinmyo-200 transition rounded-full font-medium cursor-pointer
          active:scale-95' > 
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={3} className='w-4 h-4' />
          </button>

      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout