import React, { useEffect, useState, useMemo } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartTitle, Tooltip, Legend)

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

      {/* --- Earnings & Bookings visualization (Chart.js) --- */}
      <div className="max-w-6xl mt-6">
        <h2 className="text-lg font-medium">Earnings & Bookings by Movie</h2>
        <div className="mt-4 grid grid-cols-1 gap-6">
          {(() => {
            const movieMap = {};
            shows.forEach((show) => {
              const movieName = show.movie?.title || show.movie || 'Unknown';
              const bookings = show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0;
              const earning = bookings * (show.showPrice || 0);
              if (!movieMap[movieName]) movieMap[movieName] = { bookings: 0, earnings: 0 };
              movieMap[movieName].bookings += bookings;
              movieMap[movieName].earnings += earning;
            });

            const movieArr = Object.keys(movieMap).map((name) => ({ name, ...movieMap[name] }));
            if (movieArr.length === 0) return <div className="text-gray-500">No shows data available.</div>;

            // sort by earnings desc
            movieArr.sort((a, b) => b.earnings - a.earnings);

            const labels = movieArr.map(m => m.name);
            const earningsData = movieArr.map(m => Number(m.earnings.toFixed(2)));
            const bookingsData = movieArr.map(m => m.bookings);

            const barOptions = {
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: false }
              }
            };

            const lineOptions = {
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: false }
              },
              scales: { y: { beginAtZero: true } }
            };

            const barData = {
              labels,
              datasets: [
                {
                  label: 'Earnings',
                  data: earningsData,
                  backgroundColor: 'rgba(16,185,129,0.8)', // emerald
                }
              ]
            };

            const lineData = {
              labels,
              datasets: [
                {
                  label: 'Bookings',
                  data: bookingsData,
                  borderColor: 'rgba(59,130,246,0.9)', // blue
                  backgroundColor: 'rgba(59,130,246,0.4)',
                  tension: 0.3,
                  fill: true,
                }
              ]
            };

            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-3xl  shadow-2xl">
                  <div className="p-4 border rounded bg-white">
                    <h3 className="font-medium mb-2">Earnings (Bar Chart)</h3>
                    <Bar options={barOptions} data={barData} />
                  </div>
                  </div>


                <div className="p-4 border rounded-3xl  shadow-2xl">
                  <div className="p-4 border rounded bg-white">
                    <h3 className="font-medium mb-2">Bookings (Line Chart)</h3>
                    <Line options={lineOptions} data={lineData} />
                  </div>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </div>

        {/* --- Earnings by Day (Bar Chart inside a card) --- */}
        <div className="max-w-6xl mt-6">
          <div className="p-4 border rounded-3xl  shadow-2xl">
            <h3 className="font-medium mb-2 text-zinc-900">Earnings by Day</h3>
            {(() => {
              const dayMap = {};
              // Helper to format as `Mon-DD` e.g. Nov-19
              const fmt = (d) => {
                const dt = new Date(d);
                if (isNaN(dt)) return d;
                const month = dt.toLocaleString(undefined, { month: 'short' });
                const day = String(dt.getDate()).padStart(2, '0');
                return `${month}-${day}`;
              }

              shows.forEach((show) => {
                const bookings = show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0;
                const earning = bookings * (show.showPrice || 0);
                const key = fmt(show.showDateTime);
                const timeKey = new Date(show.showDateTime).setHours(0,0,0,0);
                if (!dayMap[key]) dayMap[key] = { earnings: 0, bookings: 0, timeKey };
                dayMap[key].earnings += earning;
                dayMap[key].bookings += bookings;
              });

              const dayArr = Object.keys(dayMap).map(k => ({
                label: k,
                earnings: dayMap[k].earnings,
                bookings: dayMap[k].bookings,
                timeKey: dayMap[k].timeKey
              }));

              // sort by actual date (timeKey)
              dayArr.sort((a,b) => a.timeKey - b.timeKey);

              if (dayArr.length === 0) return <div className="text-gray-500">No shows data available.</div>;

              const dayLabels = dayArr.map(d => d.label);
              const dayEarnings = dayArr.map(d => Number(d.earnings.toFixed(2)));
              const dayBookings = dayArr.map(d => d.bookings);

              const dayCombinedOptions = {
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: 'Earnings' } },
                  y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Bookings' } }
                }
              }

              const dayCombinedData = {
                labels: dayLabels,
                datasets: [
                  {
                    type: 'bar',
                    label: 'Earnings',
                    data: dayEarnings,
                    backgroundColor: 'rgba(16,185,129,0.85)',
                    yAxisID: 'y'
                  },
                  {
                    type: 'line',
                    label: 'Bookings',
                    data: dayBookings,
                    borderColor: 'rgba(59,130,246,0.9)',
                    backgroundColor: 'rgba(59,130,246,0.4)',
                    tension: 0.3,
                    yAxisID: 'y1'
                  }
                ]
              }

              const highest = Math.max(...dayEarnings);
              const lowest = Math.min(...dayEarnings);

              return (
                <div>
                  <Bar options={dayCombinedOptions} data={dayCombinedData} />
                  <div className="mt-3 text-sm text-gray-600">Highest day: <strong>${highest.toFixed(2)}</strong> | Lowest day: <strong>${lowest.toFixed(2)}</strong></div>
                </div>
              )
            })()}
          </div>
        </div>

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
