export default async (req, context) => {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint"); // "search" or "forecast"
    const query = url.searchParams.get("q");

    const apiKey = Netlify.env.get("WEATHER_API_KEY");
    const baseUrl = "https://api.weatherapi.com/v1";

    let weatherApiUrl;

    if (endpoint === "forecast") {
        weatherApiUrl = `${baseUrl}/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=7&aqi=no&alerts=no`;
    } else {
        weatherApiUrl = `${baseUrl}/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;
    }

    const response = await fetch(weatherApiUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
};