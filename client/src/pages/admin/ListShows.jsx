import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';

const ListShows = () => {
  const { axios, getToken, user } = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-shows', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setShows(data.shows)
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />

      <div className="max-w-6xl mt-6 overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Movie Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Show Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Total Bookings</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Earnings</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {shows.map((show, index) => (
              <tr key={index} className="hover:bg-blue-50 transition-colors text-primary">
                <td className="px-6 py-3">{show.movie.title}</td>
                <td className="px-6 py-3">{dateFormat(show.showDateTime)}</td>
                <td className="px-6 py-3">{Object.keys(show.occupiedSeats).length}</td>
                <td className="px-6 py-3 font-medium text-green-600">
                  {currency} {Object.keys(show.occupiedSeats).length * show.showPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListShows
