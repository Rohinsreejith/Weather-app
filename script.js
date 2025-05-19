const apiKey = "39bc2097b57bd2ac0d201b01f57ed0c1";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const defaultLocation = document.getElementById("default-location");
const setDefaultBtn = document.getElementById("set-default-btn");
const weatherIcon = document.querySelector(".weather-icon");
const toggleBtn = document.getElementById("toggleUnit");
const unitToggle = document.getElementById("unitToggle");
const card = document.querySelector(".card");
const errorEmpty = document.querySelector(".empty-input");
const errorInvalid = document.querySelector(".invalid-city");
const weatherSection = document.querySelector(".weather");
const errorSection = document.querySelector(".error");
const alertMessage = document.getElementById("alert-message");
const audioAlert = new Audio("alert.wav");

let isCelsius = true;
let currentTempCelsius = 22;

document.addEventListener("DOMContentLoaded", () => {
    const defaultCity = localStorage.getItem("defaultCity") || "Bangalore";
    checkWeather(defaultCity);
});

async function checkWeather(city) {
    if (!city) {
        displayError('Please enter a city name');
        clearNotification(); 
        return;
    }

    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        document.querySelector(".city").innerHTML = data.name;
        currentTempCelsius = data.main.temp;
        updateTemperature(currentTempCelsius);
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        displayWeather(data.weather[0].main);
        displayAlert(data);

        weatherSection.style.display = "block";
        errorSection.style.display = "none";
        unitToggle.style.display = "block";
        errorEmpty.style.display = "none";
        errorInvalid.style.display = "none";
        searchBox.value = '';
        defaultLocation.style.display = "block"; 
        if (alertMessage.innerText.trim() !== "") {
            playAudioAlert(); 
        }
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        displayError('Invalid city name. Please enter a valid city.');
        clearNotification(); 
    }
}

function updateTemperature(tempCelsius) {
    if (isCelsius) {
        document.querySelector(".temp").innerHTML = Math.round(tempCelsius) + "°C";
    } else {
        const tempFahrenheit = (tempCelsius * 9 / 5) + 32;
        document.querySelector(".temp").innerHTML = Math.round(tempFahrenheit) + "°F";
    }
}

function displayWeather(weatherMain) {
    switch (weatherMain) {
        case "Clouds":
            weatherIcon.src = "images/clouds.png";
            card.style.backgroundImage = 'url("images/bg_cloud.jpg")';
            break;
        case "Clear":
            weatherIcon.src = "images/clear.png";
            card.style.backgroundImage = 'url("images/bg_clear.jpg")';
            break;
        case "Rain":
            weatherIcon.src = "images/rain.png";
            card.style.backgroundImage = 'url("images/bg_rain.jpg")';
            break;
        case "Snow":
            weatherIcon.src = "images/snow.png";
            card.style.backgroundImage = 'url("images/bg_snow.jpg")';
            break;
        case "Drizzle":
            weatherIcon.src = "images/drizzle.png";
            card.style.backgroundImage = 'url("images/bg_rain.jpg")';
            break;
        case "Mist":
            weatherIcon.src = "images/mist.png";
            card.style.backgroundImage = 'url("images/bg_mist.jpg")';
            break;
        default:
            card.style.backgroundImage = 'url("images/bg_clear.jpg")';
            break;
    }
}

function displayAlert(data) {
    const temperature = data.main.temp;
    const alertMessageElement = document.getElementById("alert-message");

    if (temperature > 40) {
        alertMessageElement.innerText = " - Alert: Extreme heat detetcted!";
        alertMessageElement.style.color = "red";
        displayNotification();
    } else if (temperature <= 15) {
        alertMessageElement.innerText = " - Alert: extreme cold temperature detcted";
        alertMessageElement.style.color = "red";
        displayNotification();
    } else {
        alertMessageElement.innerText = "";
        clearNotification();
    }
}

function displayNotification() {
    const notifications = document.querySelector(".notifications");
    notifications.style.display = "block";
}

function clearNotification() {
    const notifications = document.querySelector(".notifications");
    notifications.style.display = "none";
}

function displayError(message) {
    errorEmpty.style.display = "none";
    errorInvalid.style.display = "none";
    errorSection.textContent = message;
    errorSection.style.display = "block";
    weatherSection.style.display = "none";
    unitToggle.style.display = "none";
    defaultLocation.style.display = "none"; 
    clearNotification(); 
}

function playAudioAlert() {
    audioAlert.currentTime = 0;
    audioAlert.play();
}

toggleBtn.addEventListener("click", () => {
    isCelsius = !isCelsius;
    toggleBtn.innerText = isCelsius ? "Convert to °F" : "Convert to °C";
    updateTemperature(currentTempCelsius);
});

searchBtn.addEventListener("click", () => {
    validateInput();
});

searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        validateInput();
    }
});

function validateInput() {
    const cityName = searchBox.value.trim();
    if (cityName === "") {
        displayError('Please enter a city name');
    } else {
        checkWeather(cityName);
    }
}

setDefaultBtn.addEventListener("click", () => {
    const defaultCity = document.querySelector(".city").innerText;
    localStorage.setItem("defaultCity", defaultCity);
});
