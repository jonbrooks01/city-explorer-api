'use strict'

const axios = require('axios');

function getWeather (request, response, next) {
  const {lat,lon} = request.query
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`
    axios.get(url)
    .then(res => res.data.data.map(weather => new Forecast(weather)))
    .then(formattedData => response.status(200).send(formattedData))
    .catch(err => next(err))
  }

class Forecast {
  constructor(obj) {
    this.date = obj.datetime
    this.description = obj.weather.description
    this.temp = obj.temp
    this.appTemp = obj.app_temp
  }
}

module.exports = getWeather
