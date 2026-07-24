// === WEATHER FUNCTION === //
// Proxies Open-Meteo forecast and geocoding requests. No API key required.

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export default async (req, context) => {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint"); // "search" or "forecast"
    const query = url.searchParams.get("q");

    let targetUrl;

    if (endpoint === "forecast") {
        // query is "lat,lon" — split into separate params
        const [lat, lon] = query.split(",");

        targetUrl = `${FORECAST_URL}?` + new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
            daily: "weather_code,temperature_2m_max,temperature_2m_min",
            wind_speed_unit: "mph",
            timezone: "auto",
            forecast_days: "7",
        });
    } else {
        // endpoint === "search" — geocoding by city name
        targetUrl = `${GEOCODING_URL}?` + new URLSearchParams({
            name: query,
            count: "5",
            language: "en",
            format: "json",
        });
    }

    const response = await fetch(targetUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
};