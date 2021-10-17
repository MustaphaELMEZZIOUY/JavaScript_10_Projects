let origin  = 'https://api.allorigins.win/raw?url=';
let apiUrlLocation = 'https://www.metaweather.com/api/location/search/?query=';
let apiUrlWeather = 'https://www.metaweather.com/api/location/';

let from = document.querySelector('.form');
let weather = document.querySelector('.weather');
let locationCity = document.getElementById('location');

let res = fetch(origin + 'https://www.metaweather.com/api/location/search/?query=london');

async function getLocation(city){
  let res = await fetch(origin + apiUrlLocation + city);
  return res.json();
}

async function getWeather(idLocation) {
  let res = await fetch(origin + apiUrlWeather + idLocation);
  return res.json();
}

from.addEventListener('submit', getAndDisplayWeather);

async function getAndDisplayWeather(even) {
  even.preventDefault();
  let city = locationCity.value;

  if(city){
    let idLocation = await getLocation(city);
    let idLength = idLocation.length;
    if(idLength > 0 && idLength === 1){
      let locationWeather = await getWeather(idLocation[0].woeid);
      let info = locationWeather.consolidated_weather[0];
      let str = `
      <img src="https://www.metaweather.com/static/img/weather/ico/${info.weather_state_abbr}.ico" alt="wheater icon">
        ${info.the_temp.toFixed(2)} °C
      <img src="https://www.metaweather.com/static/img/weather/ico/${info.weather_state_abbr}.ico" alt="wheater icon">
      <br>
      <span>${info.weather_state_name}</span>
      `
      weather.innerHTML = str;
    } else {
      alert(`City does't exist, try another location`);
    }
  }
}

