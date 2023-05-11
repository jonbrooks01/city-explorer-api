'use strict'

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const weatherData = require('./data/weather.json')

const app = express();

app.use(cors())

const PORT = process.env.PORT;

app.get('/', (request, response) => {
  response.status(200).send('Hi! Your default port is working')
});

app.get('/weather', getWeather); 

async function getWeather (request, response, next) {
  try {
    const {lat,lon} = request.query
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`
    const weatherResponse = await axios.get(url);
    const formattedData = weatherResponse.data.data.map(day => new Forecast(day))
    response.status(200).send(formattedData);
  }
  catch (error) {
    next(error);
  }
};


class Forecast {
  constructor(obj) {
    this.date = obj.datetime
    this.description = obj.weather.description
    this.temp = obj.temp
    this.appTemp = obj.app_temp
  }
}

app.get('*', (req, res) => {
  res.status(404).send('Not Found')
});

app.use((error,req,res,next) => {
  res.status(500).send('Hey, its broken sorry!');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));