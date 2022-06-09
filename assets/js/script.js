var searchFormEl = document.querySelector("#search-form");
var searchTerm = document.querySelector("#search-field");
var cityInfoEl = document.querySelector("#city-info");
var apiKey = "126f457772cbca5e011de1b69127c8f8"
var currentDayInfoEl = document.querySelector("#current-day-info")

// get the current date
var currentDate = luxon.DateTime.now().toFormat('MM/dd/yyyy')

var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var city = searchTerm.value
        // .trim();
    console.log(city)
    if (city) {
        cityToLatLong(city);
        searchTerm.value = "";

        cityInfoEl.textContent = city + " (" + currentDate + ")";

    } else {
        alert("Please enter a city")
    }
}
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

var cityToLatLong = function(city) {
    // format the open weather map api url to pull lat & long
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    //clear out the previous results
    currentDayInfoEl.textContent = ''

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
        // request was successful
        if (response.ok) {
           response.json().then(function(data) {
               getLatLong(data)
           });
        } else {
            alert("Error: City cannot be found");
        }
        })
        .catch(function(error) {
            // Catch for any errors from the server
            alert("Unable to weather service");
        });
};

var getLatLong = function(array) {
    var lat = array.coord.lat
    var lon = array.coord.lon
    console.log(lat)
    console.log(lon)
    // use one API to search for the city based on latitude and longitude
    searchCity(lat,lon)
}

var searchCity = function(lat, lon) {
    // format the open weather map api url to pull lat & long
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + apiKey + "&units=imperial";

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
        // request was successful
        if (response.ok) {
           response.json().then(function(data) {
               displayCurrentDayWeather(data)
           });
        } else {
            alert("Error: City cannot be found");
        }
        })
        .catch(function(error) {
            // Catch for any errors from the server
            alert("Unable to weather service");
        });
};

var displayCurrentDayWeather = function(array) {
    console.log(array)
    // create element to store current temperature
    var tempEl = document.createElement("p")
    tempEl.textContent = "Temp: " + array.current.temp
    // create element to store current wind
    var windEl = document.createElement("p")
    windEl.textContent = "Wind: " + array.current.wind_speed + " MPH"

    // create element to store humidity
    var humidityEl = document.createElement("p")
    humidityEl.textContent = "Humidity: " + array.current.humidity + " %"

    // create element to store UV
    var UVEl = document.createElement("p")
    UVEl.textContent = "UV Index: " + array.current.uvi

    // append all to the div
    currentDayInfoEl.append(tempEl,windEl,humidityEl,UVEl)
}

searchFormEl.addEventListener("submit", formSubmitHandler)