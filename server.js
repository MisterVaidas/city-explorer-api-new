const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
require('dotenv').config();


const PORT = process.env.PORT || 8081;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

const corsOptions = {
    origin: 'https://64c808c2fae9803cd5d7bcb5--splendorous-yeot-1fa456.netlify.app/',
    optionsSuccessStatus: 200 
  }
  
  app.use(cors(corsOptions));
  

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello there!')
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});

app.get('/weather', async (req, res) => {
    const { searchQuery } = req.query;
    const weatherBitUrl = `https://api.weatherbit.io/v2.0/current?city=${searchQuery}&key=${WEATHER_API_KEY}`;

    try {
        const response = await axios.get(weatherBitUrl);
        const weatherData = response.data.data[0];

        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        

        const customResponse = {
            city: weatherData.city_name,
            country: weatherData.country_code,
            date: formattedDate,
            description: weatherData.weather.description,
            temperature: weatherData.temp
        }

        res.send(customResponse);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching weather data.');
    }
});

app.get('/movies', async (req, res) => {
    const { searchQuery } = req.query;
    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${searchQuery}`;

    try {
        const response = await axios.get(tmdbUrl);
        const movieData = response.data.results;

        const customResponse = movieData.map(movie => {
            let imageUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : 'https://example.com/default-image.jpg';
            return {
                title: movie.title,
                overview: movie.overview,
                average_votes: movie.vote_average.toString(),
                total_votes: movie.vote_count.toString(),
                image_url: imageUrl,
                popularity: movie.popularity.toString(),
                released_on: movie.release_date
            }
        });

        res.send(customResponse);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching movie data.');
    }
});
