// --- MAIN --- //
// App initialisation and event wiring

import {
    setLocationObject,
    getHomeLocation,
    getWeatherFromCoords,
    searchLocation,
    cleanText,
} from "./dataFunctions.js";

import {
    setPlaceholderText,
    addSpinner,
    displayError,
    displayApiError,
    updateScreenReaderConfirmation,
    updateDisplay,
} from "./domFunctions.js";

import CurrentLocation from "./CurrentLocation.js";
import { initAutocomplete } from "./autocomplete.js";

const currentLoc = new CurrentLocation();

// App init
const initApp = () => {
    document.getElementById("getLocation").addEventListener("click", handleGeoRequest);
    document.getElementById("home").addEventListener("click", handleHomeRequest);
    document.getElementById("saveLocation").addEventListener("click", handleSaveLocation);
    document.getElementById("unit").addEventListener("click", handleUnitToggle);
    document.getElementById("refresh").addEventListener("click", handleRefresh);
    document.getElementById("searchBar__form").addEventListener("submit", handleSearchSubmit);

    initAutocomplete(handleSuggestionSelect);

    setPlaceholderText();
    loadWeather();
};

document.addEventListener("DOMContentLoaded", initApp);

// Geolocation
const handleGeoRequest = (event) => {
    if (event?.type === "click") {
        addSpinner(document.querySelector(".fa-location-dot"));
    }
    if (!navigator.geolocation) return handleGeoError();
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
};

const handleGeoError = (errObj) => {
    const errMsg = errObj ? errObj.message : "Geolocation not supported";
    displayError(errMsg, errMsg);
};

const handleGeoSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    const coordsObj = {
        lat: latitude,
        lon: longitude,
        name: `Lat:${latitude} Long:${longitude}`,
    };
    setLocationObject(currentLoc, coordsObj);
    fetchAndDisplay(currentLoc);
};

// Home location
const loadWeather = (event) => {
    const savedLocation = getHomeLocation();

    if (!savedLocation && !event) return handleGeoRequest();

    if (!savedLocation && event?.type === "click") {
        displayError(
            "No home location saved.",
            "Please save a home location first."
        );
        return;
    }

    if (savedLocation && !event) {
        loadSavedLocation(savedLocation);
        return;
    }

    addSpinner(document.querySelector(".fa-house"));
    loadSavedLocation(savedLocation);
};

const handleHomeRequest = (event) => loadWeather(event);

const loadSavedLocation = (savedLocationJson) => {
    if (typeof savedLocationJson !== "string") return;

    const locationData = JSON.parse(savedLocationJson);
    const coordsObj = {
        lat: locationData.lat,
        lon: locationData.lon,
        name: locationData.name,
        unit: locationData.unit,
    };
    setLocationObject(currentLoc, coordsObj);
    fetchAndDisplay(currentLoc);
};

// Save location
const handleSaveLocation = () => {
    if (!currentLoc.getLat() || !currentLoc.getLon()) return;

    addSpinner(document.querySelector(".fa-floppy-disk"));

    const locationData = {
        name: currentLoc.getName(),
        lat: currentLoc.getLat(),
        lon: currentLoc.getLon(),
        unit: currentLoc.getUnit(),
    };

    localStorage.setItem("atmoSeekHomeLocation", JSON.stringify(locationData));
    updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location.`);
};

// Unit toggle
const handleUnitToggle = () => {
    addSpinner(document.querySelector(".fa-temperature-half"));
    currentLoc.toggleUnit();
    fetchAndDisplay(currentLoc);
};

// Refresh
const handleRefresh = () => {
    addSpinner(document.querySelector(".fa-rotate:not(.fa-spin)"));
    fetchAndDisplay(currentLoc);
};

// Search submit
const handleSearchSubmit = async (event) => {
    event.preventDefault();

    const rawText = document.getElementById("search__input").value;
    const queryText = cleanText(rawText);
    if (!queryText.length) return;

    addSpinner(document.querySelector(".fa-magnifying-glass"));

    const searchResults = await searchLocation(queryText);

    if (!searchResults) {
        displayError("Connection error.", "Connection error. Please try again.");
        return;
    }

    if (!searchResults.length) {
        displayApiError("Location not found");
        return;
    }

    // Use the first result returned by WeatherAPI search
    selectSearchResult(searchResults[0]);
};

// Suggestion select (from autocomplete dropdown)
const handleSuggestionSelect = (result) => {
    addSpinner(document.querySelector(".fa-magnifying-glass"));
    selectSearchResult(result);
};

// Shared: WeatherAPI result -> location -> fetch

const selectSearchResult = (result) => {
    // Build display name: "City, Region, Country" when region exists
    // and differs from city name, otherwise "City, Country"
    const nameParts = [result.name];

    if (result.admin1 && result.admin1 !== result.name) {
        nameParts.push(result.admin1);
    }

    if (result.country) {
        nameParts.push(result.country);
    }

    const coordsObj = {
        lat: result.latitude,
        lon: result.longitude,
        name: nameParts.join(", "),
    };

    setLocationObject(currentLoc, coordsObj);
    fetchAndDisplay(currentLoc);
};

// Fetch + render
const fetchAndDisplay = async (locationObj) => {
    const weatherData = await getWeatherFromCoords(locationObj);
    if (weatherData) updateDisplay(weatherData, locationObj);
};