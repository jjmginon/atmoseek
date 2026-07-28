// --- DOM FUNCTIONS --- //
// All DOM manipulation and display logic

// Spinner helpers
export const addSpinner = (iconElement) => {
    toggleSpinner(iconElement);
    setTimeout(() => toggleSpinner(iconElement), 1000);
};

const toggleSpinner = (iconElement) => {
    iconElement.classList.toggle("none");
    iconElement.nextElementSibling.classList.toggle("block");
    iconElement.nextElementSibling.classList.toggle("none");
};

// Toast

let toastTimerId = null;

export const showToast = (message) => {
    const toastEl = document.getElementById("toast");

    // Set message
    toastEl.textContent = message;

    // Clear the existing dismiss timer so the toast resets instead of overlapping
    if (toastTimerId) clearTimeout(toastTimerId);

    // Show
    toastEl.classList.add("toast--visible");

    // Auto-dismiss after 3 seconds
    toastTimerId = setTimeout(() => {
        toastEl.classList.remove("toast--visible");
        toastTimerId = null;
    }, 3000);
};

// Placeholder text
export const setPlaceholderText = () => {
    const input = document.getElementById("search__input");
    input.placeholder =
        window.innerWidth < 400
            ? "City or zip code"
            : "City, region, or zip code";
};

// Error display
export const displayError = (headerMsg, srMsg) => {
    updateLocationHeader(headerMsg);
    updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (errorMessage) => {
    const formattedMsg = toProperCase(errorMessage);
    updateLocationHeader(formattedMsg);
    updateScreenReaderConfirmation(`${formattedMsg}. Please try again.`);
};

// Screen reader live region
export const updateScreenReaderConfirmation = (message) => {
    document.getElementById("confirmation").textContent = message;
};

// Location header
const updateLocationHeader = (message) => {
    const locationHeading = document.getElementById("current__location");

    if (message.includes("Lat:") && message.includes("Long:")) {
        const parts = message.split(" ");
        const latStr = parts[0].replace(":", ": ").slice(0, 11);
        const lonStr = parts[1].replace(":", ": ").slice(0, 12);
        locationHeading.textContent = `${latStr} • ${lonStr}`;
    } else {
        locationHeading.textContent = message;
    }
};

// Main display update
export const updateDisplay = (weatherData, locationObj) => {
    fadeDisplay();
    clearDisplay();

    const conditionCode = weatherData.current.weather_code;
    const isDay = weatherData.current.is_day === 1;
    const themeClass = getThemeClass(conditionCode, isDay);

    setBackgroundTheme(themeClass);
    updateAmbientIcon(conditionCode, isDay);
    updateConditionLabel(conditionCode);

    const srMessage = buildScreenReaderSummary(weatherData, locationObj);
    updateScreenReaderConfirmation(srMessage);
    updateLocationHeader(locationObj.getName());

    const currentConditionEls = buildCurrentConditionEls(weatherData, locationObj.getUnit());
    renderCurrentConditions(currentConditionEls);

    renderForecast(weatherData, locationObj.getUnit());
    setFocusOnSearch();
    fadeDisplay();
};

// Fade / clear helpers
const fadeDisplay = () => {
    const currentSection = document.getElementById("currentForecast");
    const forecastSection = document.getElementById("dailyForecast");

    currentSection.classList.toggle("zero-vis");
    currentSection.classList.toggle("fade-in");
    forecastSection.classList.toggle("zero-vis");
    forecastSection.classList.toggle("fade-in");
};

const clearDisplay = () => {
    deleteChildren(document.getElementById("current__conditions"));
    deleteChildren(document.getElementById("forecast__track"));
};

const deleteChildren = (parentEl) => {
    while (parentEl.lastElementChild) {
        parentEl.removeChild(parentEl.lastElementChild);
    }
};

// WMO weather code descriptions
// Open-Meteo uses WMO codes instead of text
const WMO_DESCRIPTIONS = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Icy Fog",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    56: "Light Freezing Drizzle",
    57: "Freezing Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Freezing Rain",
    71: "Light Snow",
    73: "Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Light Showers",
    81: "Showers",
    82: "Heavy Showers",
    85: "Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Thunderstorm with Heavy Hail",
};

const getWmoDescription = (code) => {
    return WMO_DESCRIPTIONS[code] ?? "Unknown Conditions";
};

// Background theme
const THEME_CLASSES = [
    "theme-sunny",
    "theme-cloudy",
    "theme-rain",
    "theme-snow",
    "theme-fog",
    "theme-night",
    "theme-thunder",
];

const getThemeClass = (code, isDay) => {
    if (!isDay) return "theme-night";
    if (code === 0 || code === 1) return "theme-sunny";
    if (code === 2 || code === 3) return "theme-cloudy";
    if (code === 45 || code === 48) return "theme-fog";
    if (code >= 71 && code <= 77) return "theme-snow";
    if (code === 85 || code === 86) return "theme-snow";
    if (code === 95 || code === 96 || code === 99) return "theme-thunder";
    // drizzle (51-57), rain (61-67), showers (80-82)
    return "theme-rain";
};

const setBackgroundTheme = (themeClass) => {
    THEME_CLASSES.forEach((cls) => {
        document.documentElement.classList.remove(cls);
    });
    document.documentElement.classList.add(themeClass);
};

// Ambient background icon
const updateAmbientIcon = (code, isDay) => {
    const bgIconEl = document.getElementById("current__bg-icon");
    const iconClass = getWeatherIcon(code, isDay);
    bgIconEl.className = `current__bg-icon ${iconClass}`;
};

// Condition label
const updateConditionLabel = (code) => {
    const labelEl = document.getElementById("current__condition-label");
    labelEl.textContent = getWmoDescription(code);
};

// Screen reader weather summary
const buildScreenReaderSummary = (weatherData, locationObj) => {
    const locationName = locationObj.getName();
    const unit = locationObj.getUnit();
    const tempC = weatherData.current.temperature_2m;
    const tempValue = unit === "metric"
        ? Math.round(tempC)
        : Math.round(celsiusToFahrenheit(tempC));
    const tempUnit = unit === "metric" ? "Celsius" : "Fahrenheit";
    const description = getWmoDescription(weatherData.current.weather_code);
    return `${description}, ${tempValue}° ${tempUnit} in ${locationName}`;
};

// Unit conversion helpers
// Open-Meteo always returns Celsius for temp
const celsiusToFahrenheit = (c) => (c * 9 / 5) + 32;

const convertTemp = (celsius, unit) => {
    return unit === "metric"
        ? Math.round(celsius)
        : Math.round(celsiusToFahrenheit(celsius));
};

// Current conditions DOM builders
const buildCurrentConditionEls = (weatherData, unit) => {
    const current = weatherData.current;
    const todayDaily = weatherData.daily;
    const unitLabel = unit === "metric" ? "C" : "F";
    const windUnit = "mph"; // Open-Meteo returns mph (we set wind_speed_unit=mph)

    const tempValue = convertTemp(current.temperature_2m, unit);
    const feelsValue = convertTemp(current.apparent_temperature, unit);
    const highValue = convertTemp(todayDaily.temperature_2m_max[0], unit);
    const lowValue = convertTemp(todayDaily.temperature_2m_min[0], unit);
    const windValue = Math.round(current.wind_speed_10m);
    const humidity = current.relative_humidity_2m;
    const condCode = current.weather_code;
    const isDay = current.is_day === 1;
    const condText = getWmoDescription(condCode);

    // Temperature block
    const tempEl = createElement("div", "temp");
    tempEl.innerHTML = `${tempValue}<span class="temp__unit">°${unitLabel}</span>`;

    // Icon
    const iconEl = createElement("div", "icon");
    const iconMarkup = getWeatherIcon(condCode, isDay);
    iconEl.innerHTML = `<i class="${iconMarkup}" aria-hidden="true" title="${condText}"></i>`;

    // High / low
    const highLowEl = createElement("div", "high-low");
    highLowEl.innerHTML = `
        <span class="high-low__high">H: ${highValue}°${unitLabel}</span>
        <span class="high-low__low">L: ${lowValue}°${unitLabel}</span>
    `;

    // Description
    const descEl = createElement("p", "desc");
    descEl.textContent = condText;

    // Meta row
    const metaEl = createElement("div", "meta");
    metaEl.innerHTML = `
        <span>Feels like ${feelsValue}°</span>
        <span>Humidity ${humidity}%</span>
        <span>Wind ${windValue} ${windUnit}</span>
    `;

    return [tempEl, iconEl, highLowEl, descEl, metaEl];
};

const renderCurrentConditions = (conditionEls) => {
    const container = document.getElementById("current__conditions");
    conditionEls.forEach((el) => container.appendChild(el));
};

// Forecast DOM builders
// Open-Meteo daily data is parallel arrays — index i across time/weather_code/max/min
const renderForecast = (weatherData, unit) => {
    const daily = weatherData.daily;

    // Skip index 0 (today) — show the next 6 days
    for (let i = 1; i < daily.time.length; i++) {
        const dayEl = buildForecastDayEl(
            daily.time[i],
            daily.weather_code[i],
            daily.temperature_2m_max[i],
            daily.temperature_2m_min[i],
            unit
        );
        document.getElementById("forecast__track").appendChild(dayEl);
    }
};

const buildForecastDayEl = (dateString, code, maxTempC, minTempC, unit) => {
    const dayLabel = getDayAbbreviation(dateString);
    const highTemp = convertTemp(maxTempC, unit);
    const lowTemp = convertTemp(minTempC, unit);
    const condText = getWmoDescription(code);
    const iconClass = getWeatherIcon(code, true);
    const unitLabel = unit === "metric" ? "C" : "F";

    const dayEl = createElement("div", "forecast__day");
    dayEl.innerHTML = `
        <p class="forecast__day-label">${dayLabel}</p>
        <i class="${iconClass} forecast__day-icon" aria-hidden="true" title="${condText}"></i>
        <p class="forecast__day-high">${highTemp}°${unitLabel}</p>
        <p class="forecast__day-low">${lowTemp}°${unitLabel}</p>
    `;

    return dayEl;
};

// Utilities
const createElement = (tag, className) => {
    const el = document.createElement(tag);
    el.className = className;
    return el;
};

const toProperCase = (text) => {
    return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const getDayAbbreviation = (dateString) => {
    // dateString from Open-Meteo is "YYYY-MM-DD"
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
};

const setFocusOnSearch = () => {
    document.getElementById("search__input").focus();
};

// WMO code → Font Awesome icon mapper
const getWeatherIcon = (code, isDay) => {
    if (code === 0 || code === 1) {
        return isDay ? "fa-regular fa-sun" : "fa-regular fa-moon";
    }
    if (code === 2) {
        return isDay ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud-moon";
    }
    if (code === 3) {
        return "fa-solid fa-cloud";
    }
    if (code === 45 || code === 48) {
        return "fa-solid fa-smog";
    }
    if (code >= 51 && code <= 57) {
        return "fa-solid fa-cloud-rain";
    }
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
        return isDay ? "fa-solid fa-cloud-sun-rain" : "fa-solid fa-cloud-moon-rain";
    }
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
        return "fa-regular fa-snowflake";
    }
    if (code === 95 || code === 96 || code === 99) {
        return "fa-solid fa-cloud-bolt";
    }
    return "fa-regular fa-circle-question";
};