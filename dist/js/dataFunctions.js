// --- DATA FUNCTIONS ---//
// API calls and location state helpers

const BASE_URL = "https://api.weatherapi.com/v1";
const FORECAST_URL = `${BASE_URL}/forecast.json`;
const SEARCH_URL = `${BASE_URL}/search.json`;

// Location object helpers

export const setLocationObject = (locationObj, coordsObj) => {
    const { lat, lon, name, unit } = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if (unit) locationObj.setUnit(unit);
};

export const getHomeLocation = () => {
    return localStorage.getItem("atmoSeekHomeLocation");
};

// API: Fetch weather by coordinates
// Returns full forecast JSON from WeatherAPI

export const getWeatherFromCoords = async (locationObj) => {
    const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const query = `${lat},${lon}`;
    const url = `${FORECAST_URL}?key=${WEATHER_API_KEY}&q=${query}&days=7&aqi=no&alerts=no`;

    try {
        const response = await fetch(url);
        const weatherData = await response.json();
        return weatherData;
    } catch (err) {
        console.error("getWeatherFromCoords error:", err);
    }
};

// API: Search for a location by text query
// Handles city names, regions, and zip codes

export const searchLocation = async (queryText) => {
    const url = `${SEARCH_URL}?key=${WEATHER_API_KEY}&q=${encodeURIComponent(queryText)}`;

    try {
        const response = await fetch(url);
        const locationData = await response.json();
        return locationData;
    } catch (err) {
        console.error("searchLocation error:", err);
    }
};

// Utility: Sanitise raw text input
// Collapses extra whitespace and trims

export const cleanText = (rawText) => {
    return rawText.replace(/ {2,}/g, " ").trim();
};