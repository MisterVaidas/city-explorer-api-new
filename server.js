const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
require('dotenv').config();


const PORT = process.env.PORT || 8081;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

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


