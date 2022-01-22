
$(document).ready(function (){
    // Get the current date and time
    let NowMoment = moment().format("l");




// add days for the 5 day forcast
    let day1 = moment().add(1,"days").format("l");
    let day2 = moment().add(2,"days").format("l");
    let day3 = moment().add(3,"days").format("l");
    let day4 = moment().add(4,"days").format("l");
    let day5 = moment().add(5,"days").format("l");

//global variables
    let city;
    let cities;

//function to load most recently searched city from local storage
function loadMostRecent(){
    let lastSearch = localStorage.getItem("mostRecent");
    if (lastSearch){
        city = lastSearch;
        search();
    }else {
        city = "Atlanta";
        search();
    }
}

loadMostRecent()

//function to load recently searced cities from local storage
function loadRecentCities(){
    let recentCities = JSON.parse(localStorage.getItem("cities"));
    if (recentCities){
        cities= recentCities;
    } else {
        cities = [];
    }
}

loadRecentCities()

//event handler for search city button
$("submit").on("click", (e) => {
    e.preventDefault();
    getCity();
    search();
    $("#city-input").val("");
    listCities();
});

//function to save searched cities to local storage
function saveToLocalStorage(){
    localStorage.setItem("mostRecent", city);
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
}

//function to catch user input (city name)
function getCity(){
    city = $("#city-input").val();
    if (city && cities.includes(city) === false){
        saveToLocalStorage();
        return city;
    } else if (!city){
        alert ("Please enter a city!");
    }
}

//function to search the API
function search(){
    let queryURL = "api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=0320a5aedba2298de0a688d13b021c06";
    let coords = [];

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        coords.push(response.coord.lat);
        coords.push(response.coord.lon);
        let cityName = response.name;
        let cityCond = response.weather[0].description.toUpperCase();
        let cityTemp = response.main.temp;
        let cityHum = response.main.humidity;
        let cityWind = response.wind.speed;
        let icon = response.weather[0].icon;

        $("#icon").html(`<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`);
        $("#icon-name").html(cityName + " " + "(" + NowMoment + ")" );
        $("#temp").text("Current Temp (F): " + cityCond);
        $("#humidity").text("Humidity: " + cityTemp.toFixed(1));
        $("#wind-speed").text("Wind Speed: " + cityWind + "mph");
        $("#date1").text(day1);
        $("#date2").text(day2);
        $("#date3").text(day3);
        $("#date4").text(day4);
        $("#date5").text(day5);

        getUV(response.coord.lat, response.coord.lon);
    }).fail(function(){
        alert("Data not found")
    });

    //Get 5 day forecast

    function getUV(lat, lon){
        $.ajax({
            url:"https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=0320a5aedba2298de0a688d13b021c06",
            method:"GET",
        }).then(function(response){
            
            //getting UV index levels
            let uvIndex = response.current.uvi;
            $("#uv-index").text("UV Index:" + " " + uvIndex);
            if (uvIndex >= 8){
                $("#uv-index").css("color", "red");
            } else if (uvIndex > 4 && uvIndex < 8){
                $("uv-index").css("color", "yellow");
            } else{
                $("#uv-index").css("color", "green");
            }

            let cityHigh = response.daily[0].temp.max;
            $("#high").text("Expected high (F): " + " " + cityHigh);

            //forecast temperature variables

            let day1temp = response.daily[1].temp.max;
            let day2temp = response.daily[2].temp.max;
            let day3temp = response.daily[3].temp.max;
            let day4temp = response.daily[4].temp.max;
            let day5temp = response.daily[5].temp.max;

            //humidity variables
            let day1hum = response.daily[1].humidity;
            let day2hum = response.daily[2].humidity;
            let day3hum = response.daily[3].humidity;
            let day4hum = response.daily[4].humidity;
            let day5hum = response.daily[5].humidity;

            //weather icons
            let icon1 = response.daily[1].weather[0].icon;
            let icon2 = response.daily[2].weather[0].icon;
            let icon3 = response.daily[3].weather[0].icon;
            let icon4 = response.daily[4].weather[0].icon;
            let icon5 = response.daily[5].weather[0].icon;

            $("#temp1").text("Temp (F): " + " " + day1temp.toFixed(1));
            $("#temp2").text("Temp (F): " + " " + day2temp.toFixed(1));
            $("#temp3").text("Temp (F): " + " " + day3temp.toFixed(1));
            $("#temp4").text("Temp (F): " + " " + day4temp.toFixed(1));
            $("#temp5").text("Temp (F): " + " " + day5temp.toFixed(1));

            $("#hum1").text("Hum: " + " " + day1hum + "%");
            $("#hum2").text("Hum: " + " " + day2hum + "%");
            $("#hum3").text("Hum: " + " " + day3hum + "%");
            $("#hum4").text("Hum: " + " " + day4hum + "%");
            $("#hum5").text("Hum: " + " " + day5hum + "%");

            $("#icon1").html(
                `<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`
              );
              $("#icon2").html(
                `<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`
              );
              $("#icon3").html(
                `<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`
              );
              $("#icon4").html(
                `<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`
              );
              $("#icon5").html(
                `<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`
              );
        });
    }
}
    function listCities(){
        $("#cityList").text("");
        cities.forEach((city) => {
            $("#cityList").prepend("<tr><td>" + city +"</td></tr>");
        });
    }

    listCities();

    //event handler for recently searched cities in table

    $(document).on("click", "td", (e) => {
        e.preventDefault();
        let listedCity = $(e.target).text();
        city = listedCity;
        search();
    });

    //event handler for clear button

    $("#clr-btn").click(() => {
        localStorage.removedItem("cities");
        loadRecentCities();
        listCities();
    });
});