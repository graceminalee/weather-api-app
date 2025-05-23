// public/script.js
document.getElementById('weather-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const response = await fetch(`/weather?city=${city}&state=${state}`);
    const data = await response.json();

    // If no issues then execute
    if (response.ok) {
        document.getElementById('weather-in').innerText = `Weather in ${city}, ${state}`;
        document.getElementById('description').innerText = `${data.description}`;
        document.getElementById('temperature').innerText = `Temperature: ${data.temperature}°F`;
        document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind_speed} mph`;

        const description = data.description; 
        const weatherIcon = document.getElementById('weather-icon');

        // Set image source, description
        if (description.includes("clouds")) {
            weatherIcon.src = "/icons/clouds.webp";
            weatherIcon.alt = "Overcast";
        } else if (description.includes("sun") ){//|| description.includes("clear")) {
            weatherIcon.src = "/icons/sunny.png";
            weatherIcon.alt = "Sunny";
        } else if (description.includes("rain") || description.includes("mist")) {
            weatherIcon.src = "/icons/rain.webp";
            weatherIcon.alt = "Rainy";
        } else if (description.includes("partly cloudy") || description.includes("partly sunny")) {
            weatherIcon.src = "/icons/partly-cloudy.png";
            weatherIcon.alt = "Partly Cloudy";
        } else if (description.includes("mist")) {
            weatherIcon.src = "/icons/mist.jpeg";
            weatherIcon.alt = "Rainy";
        } else if (description.includes("smoke")) {
            weatherIcon.alt = "Smoke";
        }else {
            weatherIcon.src = "/icons/default.png";
            weatherIcon.alt = "Default Weather Icon";
        } 

    
    // Get data and change the background color depending on condition (calling funciton)
    document.body.style.backgroundColor = getThemeColor(data.condition);
    } else {
        alert(data.error);
    }

    // Function has cases for different conditions. 
    function getThemeColor(condition) {
        switch (condition) {
        case 'Clear': return '#d8f0f2';
        case 'Clouds': return '#d5dfe0';
        case 'Smoke': return '#d5dfe0';
        case 'Rain': return '#c1d7e6';
        case 'Mist': return '#c1d7e6';

        default: return 'white';
        }
    }
    
});

  
