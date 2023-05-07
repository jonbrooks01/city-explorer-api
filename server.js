'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json')

const app = express();

app.use(cors())

const PORT = process.env.PORT;

app.get('/', (request, response) => {
  response.status(200).send('Hi! Your default port is working')
});

app.get('/weather', (request, response, next) =>{
  try {
    const {searchQuery} = request.query
    console.log(searchQuery)
    const cityData = weatherData.find((city) => city.city_name === searchQuery)
    console.log(cityData)
    const formattedData = cityData.data.map(day => new Forecast(day))
    response.status(200).send(formattedData);
  }
  catch (error) {
    next(error);
  }
});

class Forecast {
  constructor(obj) {
    this.date = obj.datetime
    this.description = obj.weather.description
    this.lowTemp = obj.low_temp
    this.highTemp = obj.max_temp
  }
}

app.get('*', (req, res) => {
  res.status(404).send('Not Found')
});

app.use((error,req,res,next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));