var searchFormEl = document.querySelector("#search-form");
var searchTerm = document.querySelector("#search-field");
var cityInfoEl = document.querySelector("#city-info");
var apiKey = "126f457772cbca5e011de1b69127c8f8"
var currentDayInfoEl = document.querySelector("#current-day-info")
var fiveDayForecastEl = document.querySelector("#five-day-forecast")
var prevSearchEl = document.querySelector("#prev-search-terms")

// initialize previous search terms array
var prevSearchTerms = []

// get the current date
var currentDate = luxon.DateTime.now().toFormat('MM/dd/yyyy')

var loadPrevSearchTerms = function() {
    prevSearchTerms = JSON.parse(localStorage.getItem("prevSearchTerms"));

    // if nothing in localStorage, create a new object to track all task status arrays
    if (!prevSearchTerms) {
      prevSearchTerms = []
    }
  
    // loop over object properties for each city name, add a button
    createPrevSearchBtn(prevSearchTerms)
    }



var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var city = searchTerm.value
        // .trim();
    
    if (city) {
        cityToLatLong(city);
        searchTerm.value = "";

        


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

    // set the header
    cityInfoEl.textContent = city + " (" + currentDate + ")";

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
        // request was successful
        if (response.ok) {
           response.json().then(function(data) {

                // append the icon to the header
                var iconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
                var iconImg = document.createElement("img")
                iconImg.setAttribute("src",iconUrl)
                iconImg.setAttribute("alt", "Glyph depicting the weather for the day")
                cityInfoEl.append(iconImg)

               getLatLong(data)
           });
        } else {
            alert("Error: City cannot be found");
        }
        })
        .catch(function(error) {
            // Catch for any errors from the server
            alert("Unable to connect to weather service");
        });
};

var getLatLong = function(array) {
    var lat = array.coord.lat
    var lon = array.coord.lon

    // use one API to search for the city based on latitude and longitude
    searchCity(lat,lon)
    displayPrevSearch(lat, lon)
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
               displayFiveDayForecast(data)
           });
        } else {
            alert("Error: City cannot be found");
        }
        })
        .catch(function(error) {
            // Catch for any errors from the server
            alert("Unable to connect to weather service");
        });
};

var displayCurrentDayWeather = function(array) {
    
    // create element to store current temperature
    var tempEl = document.createElement("p")
    tempEl.textContent = "Temp: " + array.current.temp + " °F"
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

var displayFiveDayForecast = function(array) {

    // clear out any five day forecast from previous searches
    fiveDayForecastEl.textContent=''
    // for loop to get the next 5 days of data. Start at 1 since index 0 is today's date
    for (var i = 1; i < 6; i++) {
        // convert the unix timestamp to a human readable date using luxon
        var date  = luxon.DateTime.fromSeconds(array.daily[i].dt).toFormat('MM/dd/yyyy')

        // create the card to hold each day
        var fiveDayDiv = document.createElement("div")
        fiveDayDiv.classList.add("five-day-forecast-card")

        // save the date as a heading
        var fiveDayDate = document.createElement("h3")
        fiveDayDate.textContent = date;

        // get the icon http://openweathermap.org/img/w/10d.png
        var fiveDayIconUrl = "http://openweathermap.org/img/w/" + array.daily[i].weather[0].icon + ".png"
        var fiveDayIconImg = document.createElement("img")
        fiveDayIconImg.setAttribute("src",fiveDayIconUrl)
        fiveDayIconImg.setAttribute("alt", "Glyph depicting the weather for the day")

        var fiveDayIcon = document.createElement("p")

        fiveDayIcon.append(fiveDayIconImg)
        // fiveDayIcon.innerHTML = array.daily[i].weather.icon
        
        // get the temp for the day
        var fiveDayTemp = document.createElement("p")
        fiveDayTemp.textContent= "Temp: " + array.daily[i].temp.day + " °F"

        // get the wind for the day
        var fiveDayWind = document.createElement("p")
        fiveDayWind.textContent= "Wind: " + array.daily[i].wind_speed + " MPH"

        // get the humidity for the day
        var fiveDayHumidity = document.createElement("p")
        fiveDayHumidity.textContent= "Humidity: " + array.daily[i].humidity + " %"

        fiveDayDiv.append(fiveDayDate, fiveDayIcon, fiveDayTemp, fiveDayWind, fiveDayHumidity)

        // append each card to the container
        fiveDayForecastEl.append(fiveDayDiv)
    }

}

var savePrevSearch = function(array) {
    localStorage.setItem("prevSearchTerms", JSON.stringify(prevSearchTerms));
}

var createPrevSearchBtn = function(array) {
    // loop through array 
    for (var i = 0; i < array.length; i++) {

    
    // create the button
    var prevSearchButton = document.createElement("button")
    prevSearchButton.textContent = array[i].city
    prevSearchButton.setAttribute("value", array[i].city)
    prevSearchButton.classList.add("btn")
    prevSearchButton.classList.add("btn-light")
    prevSearchButton.classList.add("prev-search")

    //append the button to the container div
    prevSearchEl.append(prevSearchButton)

    }
}

var displayPrevSearch = function(lat, lon) {
    var searchTerm = cityInfoEl.textContent
    var city = searchTerm.split("(")[0].trim()
    // create an object with the information we need
    var prevCity = {
        city: city,
        lat: lat,
        lon: lon
    }

    // createPrevSearchBtn(city)

    // use unshift method to place the most recently searched city in the 0 index
    prevSearchTerms.unshift(prevCity)

    // limit the array that stores the previous searches to 10. Pop out the last element whenever the array length = 11
    if (prevSearchTerms.length == 11) {
        prevSearchTerms.pop()
    }

    // clear what was there before and then build the search buttons with the new order
    prevSearchEl.textContent = ""
    createPrevSearchBtn(prevSearchTerms)
    
    savePrevSearch(prevSearchTerms)

}

// load previous search terms
loadPrevSearchTerms()

// event listener for the initial search form
searchFormEl.addEventListener("submit", formSubmitHandler)

// event listener for the previous search area
prevSearchEl.addEventListener("click", function(event) {

    // get the event and the lat and lon from the data attributes we set earlier
    var city = event.target.value

    // Pass in the button click to the cityToLatLong function to update the info for the city)
    cityToLatLong(city)
    
})