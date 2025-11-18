import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title.jsx';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Dashboard = () => {

  const {axios, getToken, user, image_base_url} = useAppContext()
  const currency = import.meta.env.VITE_CURRENCY 

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  });

  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {title: "Total Bookings", value: dashboardData.totalBookings || "0", icon: ChartLineIcon},
    {title: "Total Revenue", value: `${currency}${dashboardData.totalRevenue || 0}`, icon: CircleDollarSignIcon},
    {title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon},
    {title: "Total Users", value: dashboardData.totalUser || "0", icon: UsersIcon}
  ]

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        setDashboardData(data.dashboardData)
        setLoading(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error("Error fetching dashboard data")
    }
  }

  useEffect(() => {
    if(user) fetchDashboardData();
  }, [user]);


  return !loading ? (
    <div className="bg-white min-h-screen p-4 md:p-6">

      <Title text1="Admin" text2="Dashboard" />

      {/* Dashboard Analytics Cards */}
      <div className="relative mt-8">
        <BlurCircle top="-120px" left="0" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="
                group rounded-xl p-6 bg-white/40 backdrop-blur-xl
                border border-gray-200 shadow-sm 
                transition-all duration-300 cursor-pointer
                hover:-translate-y-1 hover:shadow-lg hover:bg-white/70
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
                  <p className="text-2xl mt-2 font-semibold text-gray-800">
                    {card.value}
                  </p>
                </div>

                <div
                  className="
                    w-12 h-12 rounded-xl flex items-center justify-center
                    bg-primary/10 text-primary
                    group-hover:bg-primary group-hover:text-white
                    transition-all duration-300
                  "
                >
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Shows */}
      <div className="mt-14">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Active Shows
        </h2>

        <div className="relative grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl pr-4">
          <BlurCircle top="100px" left="-10%" />

          {dashboardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="
                bg-white rounded-xl overflow-hidden border border-gray-200 
                shadow-sm hover:shadow-xl hover:-translate-y-1 
                transition-all duration-300 cursor-pointer
              "
            >
              <img
                src={image_base_url + show.movie.poster_path}
                alt=""
                className="h-60 md:h-80 w-full object-cover"
              />

              <div className="p-3">
                <p className="font-semibold truncate text-gray-800">
                  {show.movie.title}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-primary font-bold text-lg">
                    {currency}{show.showPrice}
                  </p>

                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {show.movie.vote_average.toFixed(1)}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  {dateFormat(show.showDateTime)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  ) : <Loading />
}

export default Dashboard;
