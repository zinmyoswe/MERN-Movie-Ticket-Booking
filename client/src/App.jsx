import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Movies from './pages/Movies.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import SeatLayout from './pages/SeatLayout.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Favourite from './pages/Favourite.jsx'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/admin/Layout.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AddShows from './pages/admin/AddShows.jsx'
import ListShows from './pages/admin/ListShows.jsx'
import ListBookings from './pages/admin/ListBookings.jsx'
import AddSlide from './pages/admin/AddSlide.jsx'
import ListSlide from './pages/admin/ListSlide.jsx'
import EditSlide from './pages/admin/EditSlide.jsx'
import DeleteSlide from './pages/admin/DeleteSlide.jsx'
import AddCinema from './pages/admin/AddCinema.jsx'
import ListCinema from './pages/admin/ListCinema.jsx'
import EditCinema from './pages/admin/EditCinema.jsx'
import DeleteCinema from './pages/admin/DeleteCinema.jsx'
import CinemaSection from './components/CinemaSection.jsx'
import CinemaDetail from './components/CinemaDetail.jsx'
// Promotion Admin Pages
import ListPromotion from './pages/admin/ListPromotion.jsx'
import EditPromotion from './pages/admin/EditPromotion.jsx'
import DeletePromotion from './pages/admin/DeletePromotion.jsx'
import { useAppContext } from './context/AppContext.jsx'
import { SignIn } from '@clerk/clerk-react'
import Loading from './components/Loading.jsx'
import AddPromotion from './pages/admin/AddPromotion.jsx'
import PromotionSection from './components/PromotionSection.jsx'
import PromotionDetail from './components/PromotionDetail.jsx'

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  const { user } = useAppContext()

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/cinemas' element={<CinemaSection />} />
        <Route path='/cinemas/:id' element={<CinemaDetail />} />
        <Route path='/promotions' element={<PromotionSection />} />
        <Route path='/promotions/:id' element={<PromotionDetail />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/loading/:nextUrl' element={<Loading />} />
        <Route path='/favourite' element={<Favourite />} />
        <Route path='/admin/*' element={user ? <Layout /> : (
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'}  />
          </div>
        )}>
          <Route index element={<Dashboard />} />
          <Route path='add-shows' element={<AddShows/>} />
          <Route path='list-shows' element={<ListShows/>} />
          <Route path='list-bookings' element={<ListBookings/>} />
          <Route path='add-slide' element={<AddSlide/>} />
          <Route path='list-slides' element={<ListSlide/>} />
          <Route path='edit-slide/:id' element={<EditSlide/>} />
          <Route path='delete-slide/:id' element={<DeleteSlide/>} />
          <Route path='add-cinema' element={<AddCinema/>} />
          <Route path='list-cinemas' element={<ListCinema/>} />
          <Route path='edit-cinema/:id' element={<EditCinema/>} />
          <Route path='delete-cinema/:id' element={<DeleteCinema/>} />
          {/*  Promotion Routes */}
          <Route path='add-promotion' element={<AddPromotion/>} />
          <Route path='list-promotions' element={<ListPromotion />} /> {/* List all promotions */}
          <Route path='edit-promotion/:id' element={<EditPromotion />} /> {/* Edit promotion */}
          <Route path='delete-promotion/:id' element={<DeletePromotion />} /> {/* Delete promotion */}
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App