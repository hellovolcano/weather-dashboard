var searchFormEl = document.querySelector("#search-form");
var searchTerm = document.querySelector("#search-field");
var cityInfoEl = document.querySelector("#city-info");
var apiKey = "126f457772cbca5e011de1b69127c8f8"


var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var city = searchTerm.value
        // .trim();
    console.log(city)
    if (city) {
        searchCity(city);
        searchTerm.value = "";
        console.log(searchFormEl.value)
        cityInfoEl.textContent = city;
    } else {
        alert("Please enter a city")
    }
}
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
var searchCity = function(city) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
        // request was successful
        if (response.ok) {
           response.json().then(function(data) {
               console.log(data)
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

searchFormEl.addEventListener("submit", formSubmitHandler)