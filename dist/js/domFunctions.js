// ---DOM FUNCTIONS --- //
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
// Orchestrates fade, clear, build, render
export const updateDisplay = (weatherData, locationObj) => {
    fadeDisplay();
    clearDisplay();

    const conditionCode = weatherData.current.condition.code;
    const isDay = weatherData.current.is_day === 1;
    const themeClass = getThemeClass(conditionCode, isDay);

    setBackgroundTheme(themeClass);
    updateAmbientIcon(conditionCode, isDay);
    updateConditionLabel(weatherData.current.condition.text);

    const srMessage = buildScreenReaderSummary(weatherData, locationObj);
    updateScreenReaderConfirmation(srMessage);
    updateLocationHeader(locationObj.getName());

    const currentConditionEls = buildCurrentConditionEls(weatherData, locationObj.getUnit());
    renderCurrentConditions(currentConditionEls);

    renderForecast(weatherData);
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

// WeatherAPI condition codes are NOT contiguous ranges — they jump
// (1201 → 1204 → 1207 → 1210 → 1237 → 1240…), so each weather family
// is listed as an explicit set rather than a min/max range.

const FOG_CODES = [1030, 1135, 1147];
const THUNDER_CODES = [1087, 1273, 1276, 1279, 1282];
const SNOW_CODES = [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264];
const RAIN_CODES = [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1249, 1252];
const CLOUDY_CODES = [1003, 1006, 1009];

const getThemeClass = (conditionCode, isDay) => {
    if (!isDay) return "theme-night";

    if (conditionCode === 1000) return "theme-sunny";
    if (THUNDER_CODES.includes(conditionCode)) return "theme-thunder";
    if (FOG_CODES.includes(conditionCode)) return "theme-fog";
    if (SNOW_CODES.includes(conditionCode)) return "theme-snow";
    if (RAIN_CODES.includes(conditionCode)) return "theme-rain";
    if (CLOUDY_CODES.includes(conditionCode)) return "theme-cloudy";

    return "theme-cloudy";
};

const setBackgroundTheme = (themeClass) => {
    THEME_CLASSES.forEach((cls) => {
        document.documentElement.classList.remove(cls);
    });
    document.documentElement.classList.add(themeClass);
};

// Ambient background icon
// Large, low-opacity icon reflecting current condition
const updateAmbientIcon = (conditionCode, isDay) => {
    const bgIconEl = document.getElementById("current__bg-icon");
    const iconClass = getWeatherIcon(conditionCode, isDay);

    bgIconEl.className = `current__bg-icon ${iconClass}`;
};

// Condition label
// Short text under the location name (e.g. "Light rain")
const updateConditionLabel = (conditionText) => {
    const labelEl = document.getElementById("current__condition-label");
    labelEl.textContent = toProperCase(conditionText);
};

// Screen reader weather summary
const buildScreenReaderSummary = (weatherData, locationObj) => {
    const locationName = locationObj.getName();
    const unit = locationObj.getUnit();
    const tempValue = Math.round(weatherData.current[unit === "metric" ? "temp_c" : "temp_f"]);
    const tempUnit = unit === "metric" ? "Celsius" : "Fahrenheit";
    const description = weatherData.current.condition.text;
    return `${description}, ${tempValue}° ${tempUnit} in ${locationName}`;
};

// Current conditions DOM builders
const buildCurrentConditionEls = (weatherData, unit) => {
    const isMetric = unit === "metric";
    const tempValue = Math.round(weatherData.current[isMetric ? "temp_c" : "temp_f"]);
    const feelsValue = Math.round(weatherData.current[isMetric ? "feelslike_c" : "feelslike_f"]);
    const highValue = Math.round(weatherData.forecast.forecastday[0].day[isMetric ? "maxtemp_c" : "maxtemp_f"]);
    const lowValue = Math.round(weatherData.forecast.forecastday[0].day[isMetric ? "mintemp_c" : "mintemp_f"]);
    const windValue = Math.round(weatherData.current[isMetric ? "wind_kph" : "wind_mph"]);
    const windUnit = isMetric ? "km/h" : "mph";
    const humidity = weatherData.current.humidity;
    const condText = toProperCase(weatherData.current.condition.text);
    const condCode = weatherData.current.condition.code;
    const isDay = weatherData.current.is_day === 1;
    const unitLabel = isMetric ? "C" : "F";

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
        <span class="high-low__high">H: ${highValue}°</span>
        <span class="high-low__low">L: ${lowValue}°</span>
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
const renderForecast = (weatherData) => {
    // Skip index 0 (today) — start from tomorrow
    const futureDays = weatherData.forecast.forecastday.slice(1);

    futureDays.forEach((dayData) => {
        const dayEl = buildForecastDayEl(dayData);
        document.getElementById("forecast__track").appendChild(dayEl);
    });
};

const buildForecastDayEl = (dayData) => {
    const dayLabel = getDayAbbreviation(dayData.date);
    const highTemp = Math.round(dayData.day.maxtemp_c);
    const lowTemp = Math.round(dayData.day.mintemp_c);
    const condText = dayData.day.condition.text;
    const iconUrl = `https:${dayData.day.condition.icon}`;

    const dayEl = createElement("div", "forecast__day");
    dayEl.innerHTML = `
        <p class="forecast__day-label">${dayLabel}</p>
        <img
            class="forecast__day-icon"
            src="${iconUrl}"
            alt="${condText}"
            width="32"
            height="32"
        >
        <p class="forecast__day-high">${highTemp}°</p>
        <p class="forecast__day-low">${lowTemp}°</p>
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
    // dateString from WeatherAPI is "YYYY-MM-DD"
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
};

const setFocusOnSearch = () => {
    document.getElementById("search__input").focus();
};

// Weather icon mapper
// Maps WeatherAPI condition codes to Font Awesome classes
const getWeatherIcon = (conditionCode, isDay) => {
    if (conditionCode === 1000) {
        return isDay ? "fa-regular fa-sun" : "fa-regular fa-moon";
    }
    if (conditionCode === 1003) {
        return isDay ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud-moon";
    }
    if (CLOUDY_CODES.includes(conditionCode)) {
        return "fa-solid fa-cloud";
    }
    if (FOG_CODES.includes(conditionCode)) {
        return "fa-solid fa-smog";
    }
    if (THUNDER_CODES.includes(conditionCode)) {
        return "fa-solid fa-cloud-bolt";
    }
    if (SNOW_CODES.includes(conditionCode)) {
        return "fa-regular fa-snowflake";
    }
    if (RAIN_CODES.includes(conditionCode)) {
        return isDay ? "fa-solid fa-cloud-sun-rain" : "fa-solid fa-cloud-moon-rain";
    }
    return "fa-regular fa-circle-question";
};