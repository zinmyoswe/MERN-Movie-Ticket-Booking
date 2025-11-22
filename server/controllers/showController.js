import Cinema from "../models/Cinema.js";
// Get cinemas by location for addShow UI
export const getCinemasByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.json({ success: false, message: "Location required" });
    const cinemas = await Cinema.find({ Location: location }).sort({ cinemaName: 1 });
    res.json({ success: true, cinemas });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

export const getNowPlayingMovies = async (req, res) => {
  try{
    const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',{
        headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
    })

    const movies = data.results;
    res.json({success: true, movies: movies})
  }catch(error){
    console.error(error);
    res.json({success: false, movies: error.message})
  }
}


//API to add a new show to the database

export const addShow = async (req, res) => {
  try{
    const {movieId, showsInput, showPrice, cinemaIds} = req.body

    let movie = await Movie.findById(movieId)

    if(!movie){
        //fetch movie details and credits from TMDB API
        const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
                headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
            }),
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
                headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
            })
        ]);

        const movieApiData = movieDetailsResponse.data;
        const movieCreditsData = movieCreditsResponse.data;

        const movieDetails = {
            _id: movieId,
            title: movieApiData.title,
            overview: movieApiData.overview,
            poster_path: movieApiData.poster_path,
            backdrop_path: movieApiData.backdrop_path,
            genres: movieApiData.genres,
            casts: movieCreditsData.cast,
            release_date: movieApiData.release_date,
            original_language: movieApiData.original_language,
            tagline: movieApiData.tagline || "",
            vote_average: movieApiData.vote_average,
            runtime: movieApiData.runtime,
        }

        //Add movie to the database
        movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];
    cinemaIds.forEach(cinemaId => {
      showsInput.forEach(show => {
        const showDate = show.date;
        show.time.forEach((time) => {
          const dateTimeString = `${showDate}T${time}`;
          showsToCreate.push({
            movie: movieId,
            showDateTime: new Date(dateTimeString),
            showPrice,
            occupiedSeats: {},
            cinemas: [cinemaId] // Changed to plural and an array
          })
        })
      });
    });
    if(showsToCreate.length > 0){
        await Show.insertMany(showsToCreate);
    }

    //Trigger Inngest event
    await inngest.send({
      name: "app/show.added",
      data: {movieTitle: movie.title}
    })

    res.json({success: true, message: 'Show Added Successfully'});
  }
  catch(error){
    console.error(error);
    res.json({success: false, message: error.message});
  }
}
// ...duplicate block removed...


//API to get all shows from the database
export const getShows = async (req, res) => {
  try{
    const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');

    // Filter for unique movies. Using a Map to ensure uniqueness based on movie ID.
    const uniqueMoviesMap = new Map();
    shows.forEach(show => {
      if (show.movie) { // Ensure movie is not null
        uniqueMoviesMap.set(show.movie._id.toString(), show.movie);
      }
    });
    const uniqueMovies = Array.from(uniqueMoviesMap.values());

    res.json({success: true, shows: uniqueMovies})
  }catch(error){
    console.error(error);
    res.json({success: false, message: error.message});
  }
}

//API to get a single show from the database
export const getShow = async (req, res) => {
  try{
    const {movieId} = req.params;
    console.log('Fetching shows for movieId:', movieId);
    const currentTime = new Date();
    console.log('Current server time for query (new Date()):', currentTime);
    //get all upcoming shows for the movie
    const shows = await Show.find({movie: movieId, showDateTime: {$gte: currentTime }}).populate('cinemas'); // Changed 'cinema' to 'cinemas'
    console.log('Shows found by query:', shows);

    let movie = await Movie.findById(movieId);

    // If movie is not in our DB, fetch from TMDB and save it
    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };
      movie = await Movie.create(movieDetails);
    }
    const dateTime = {};

    shows.forEach((show) => {
        if (!show.cinemas || show.cinemas.length === 0) return; // Check if cinemas array is populated and not empty

        show.cinemas.forEach(cinema => { // Iterate over the cinemas array
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = {};
            }
            const cinemaName = cinema.cinemaName; // Access properties from the populated cinema object
            if(!dateTime[date][cinemaName]){
                dateTime[date][cinemaName] = [];
            }
            dateTime[date][cinemaName].push({
                time: show.showDateTime,
                showId: show._id,
                cinemaId: cinema._id
            });
        });
    });
    res.json({success: true, movie, dateTime})
  }catch(error){
    console.error(error);
    res.json({success: false, message: error.message});
  }
}

// Delete a show
export const deleteShow = async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.body.showId);
    res.send({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

//API to get a single show by its ID
export const getShowById = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await Show.findById(showId).populate('movie').populate('cinemas');

    if (!show) {
      return res.json({ success: false, message: "Show not found" });
    }

    res.json({ success: true, show });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
