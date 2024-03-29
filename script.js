var searchFormEl = document.querySelector("#search-form");
var searchFormCityInputEl = document.querySelector("#search-form-city-input");
var weatherDayCityEl = document.querySelector("#weather-day-city");
var weatherDayTempEl = document.querySelector("#weather-day-temp");
var weatherDayWindEl = document.querySelector("#weather-day-wind");
var weatherDayHumidityEl = document.querySelector("#weather-day-humidity");
var weatherDayUvIndexEl = document.querySelector("#weather-day-uv-index");
var forecastContainerEl = document.querySelector("#forecast-container");
var weatherDayIconEl = document.querySelector("#weather-day-icon");
var buttonContainerEl = document.querySelector("#button-container");

var baseUrl = "https://api.openweathermap.org/";
var apiKey = "68c335c7245e8ec4a518653c27fb8724";

function populate5day(data) {
  forecastContainerEl.innerHTML = "";
  data.forEach(function (day, index) {
    if (index === 0 || index > 5) {
      return;
    }
    var dt = day.dt;
    var date = moment(dt * 1000).format("L");
    var temp = day.temp.day;
    var windSpeed = day.wind_speed;
    var humidity = day.humidity;
    var icon = day.weather[0].icon;
    var div = document.createElement("div");
    div.classList = "card-weather col-md-2 col-sm-12 bg-info text-black me-3";
    div.innerHTML = `
            <h4>${date}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}.png" />
            <dl>
                <dt>Temp:</dt>
                <dd>${temp}</dd>
                <dt>Wind:</dt>
                <dd>${windSpeed} MPH</dd>
                <dt>Humidity</dt>
                <dd>${humidity}%</dd>
            </dl> 
          `;
    forecastContainerEl.appendChild(div);
  });
}

function getCityDayWeather(city) {
  var url = `${baseUrl}geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data.length) {
        window.alert("No city matches.");
        return;
      }

      storeCityLocation(city);
      populateButtons();

      var cityObject = data[0];
      var lat = cityObject.lat;
      var lon = cityObject.lon;

      var currentWeatherUrl = `${baseUrl}data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

      fetch(currentWeatherUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          var current = data.current;
          var temp = current.temp;
          var windSpeed = current.wind_speed;
          var humidity = current.humidity;
          var uviIndex = current.uvi;
          var icon = current.weather[0].icon;
// remove(".hide");
          weatherDayCityEl.textContent = city;
          weatherDayTempEl.textContent = temp;
          weatherDayWindEl.textContent = windSpeed;
          weatherDayTempEl.textContent = temp;
          weatherDayHumidityEl.textContent = humidity;
          weatherDayUvIndexEl.textContent = uviIndex;
          if (uviIndex < 3) {
            weatherDayUvIndexEl.classList.add("favorable");
          } else if (uviIndex < 7) {
            weatherDayUvIndexEl.classList.add("moderate");
          } else {
            weatherDayUvIndexEl.classList.add("severe");
          }

          weatherDayIconEl.src = `https://openweathermap.org/img/wn/${icon}.png`;

          populate5day(data.daily);
        });
    });
}

function populateButtons() {
  buttonContainerEl.innerHTML = "";
  var cities = window.localStorage.getItem("cities");
  if (cities) {
    cities = JSON.parse(cities);
  } else {
    cities = [];
  }

  cities.forEach(function (city) {
    var button = document.createElement("button");
    button.classList = "btn btn-secondary col-12";
    button.textContent = city;
    button.setAttribute("data-city", city);
    buttonContainerEl.appendChild(button);
  });
}

function storeCityLocation(city) {
  var cities = window.localStorage.getItem("cities");
  if (cities) {
    cities = JSON.parse(cities);
  } else {
    cities = [];
  }
  if (cities.includes(city)) {
    return;
  } else {
    cities.push(city);
  }

  window.localStorage.setItem("cities", JSON.stringify(cities));
}

function handleFormSubmit(evt) {
  evt.preventDefault();
  debugger;
  var city = searchFormCityInputEl.value;
  getCityDayWeather(city);
}

function handleButtonClick(evt) {
  var target = evt.target;
  var city = target.getAttribute("data-city");
  getCityDayWeather(city);
}

function addEventListeners() {
  searchFormEl.addEventListener("submit", handleFormSubmit);
  buttonContainerEl.addEventListener("click", handleButtonClick);
}

function init() {
  addEventListeners();
  populateButtons();
}

init();

// init();

// function getWeatherApi(searchParam, format) {
//   var baseUrl = `https://api.openweathermap.org/data/2.5/onecalll?lat={lat}&lon={lon}&appid={68c335c7245e8ec4a518653c27fb8724}`;
// }