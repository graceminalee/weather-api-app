import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';



dotenv.config();  // environment variables

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.static('public'));  
app.use(express.urlencoded({ extended: false }));  // Parse url-encoded data



// Helper func
async function getUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Fetch error: ${response.status}`);
    }
    return await response.json();
}

// Fetch weather data based on city and state
async function fetchWeather(city, state) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${apiKey}`;

    try {
        // Getting geolocation data
        const geoData = await getUrl(geoUrl);
        if (geoData.length === 0) {
            throw new Error('Location not found.');
        }

        const { lat, lon } = geoData[0];  // Extract latitude and longitude

        // Getting weather data using lat and lon
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
        const weatherData = await getUrl(weatherUrl);

        // Return relevant weather information
        return {
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            wind_speed: weatherData.wind.speed,
            condition: weatherData.weather[0].main
        };
    } catch (error) {
        console.error('Could not get weather data:', error);
        throw error;
    }
}

// /weather endpoint
app.get('/weather', async (req, res) => {
    const { city, state } = req.query;
    if (!city || !state) {
        return res.status(400).json({ error: 'City and state are required.' });
    }

    try {
        const weatherData = await fetchWeather(city, state);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: 'Could not get weather. Try again' });
    }
});

// server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
