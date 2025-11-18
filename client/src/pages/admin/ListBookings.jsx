import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';

const ListBookings = () => {
  const { axios, getToken, user } = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setBookings(data.bookings)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-6xl mt-6 overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Movie Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Show Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Seats</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {bookings.map((item, index) => (
              <tr key={index} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-3 text-primary">{item.user?.name || "N/A"}</td>
                <td className="px-6 py-3 text-primary">{item.show?.movie?.title || "N/A"}</td>
                <td className="px-6 py-3 text-primary">{item.show?.showDateTime ? dateFormat(item.show.showDateTime) : "N/A"}</td>
                <td className="px-6 py-3 text-primary">
                  {item.bookedSeats
                    ? Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")
                    : "N/A"
                  }
                </td>
                <td className="px-6 py-3 font-medium text-primary">{currency} {item.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListBookings
