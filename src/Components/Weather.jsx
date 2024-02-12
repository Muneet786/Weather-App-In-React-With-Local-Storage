
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css'; 
const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');

  const apiKey = '0b48ca6287c9aabc25e95721f79153e2';

  useEffect(() => {
    const storedWeatherData = localStorage.getItem('allWeatherData');
    if (storedWeatherData) {
      const allData = JSON.parse(storedWeatherData);
      if (allData[city]) {
        const { data, timestamp } = allData[city];
        const ageInMinutes = (new Date() - new Date(timestamp)) / (1000 * 60);
        if (ageInMinutes < 60) {
          setWeatherData(data);
        } else {
          delete allData[city];
          localStorage.setItem('allWeatherData', JSON.stringify(allData));
        }
      }
    }
  }, [city]);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = response.data;
      setWeatherData(data);
      const storedWeatherData = localStorage.getItem('allWeatherData');
      const allData = storedWeatherData ? JSON.parse(storedWeatherData) : {};
      allData[city] = { data, timestamp: new Date().toLocaleString() };
      localStorage.setItem('allWeatherData', JSON.stringify(allData));
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="weather-container">
      <div className="input-container">
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name" />
        <button onClick={fetchWeatherData}>Get Weather</button>
      </div>
      {weatherData && (
        <div className="weather-info">
          <h2>Weather in {weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;

