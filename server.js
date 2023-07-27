const express = require('express');
const cors = require('cors');
const app = express();
const weatherData = require('./data/weather.json');


const PORT = process.env.PORT || 8082;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello there!')
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});

app.get('/weather', (req, res) => {
    const { lat, lon, searchQuery } = req.query;

    let foundCity = weatherData.find(data =>
        data.city_name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (!foundCity) {
        res.status(404).send('Error: City not found');
    } else {

        let dailyWeather = foundCity.data.map(day => {
            return {
                date: day.valid_date,
                description: day.weather.description,
            };
        });

        res.send(dailyWeather);
    }
});