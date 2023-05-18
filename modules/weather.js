'use strict'

const axios = require('axios');
const cache = require('./cache')



function getWeather (request, response, next) {
  const {lat,lon} = request.query
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`
    const key = 'obj' + lat + lon

    console.log(cache)

    if(cache[key] && (Date.now() - cache[key].timestamp < 43200000)) {
      console.log('cache hit - sending date from cache');
      response.status(200).send(cache[key].data)
    }
    else{
      console.log('cache miss - making a new request to the API')
      axios.get(url)
      .then(res => res.data.data.map(weather => new Forecast(weather)))
      .then(formattedData => {
        cache[key] = {};
        cache[key].data = formattedData
        cache[key].timestamp = Date.now();

        response.status(200).send(formattedData)
      })
      .catch(err => next(err))
    }
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
