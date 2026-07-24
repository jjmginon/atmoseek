// ============================================
// AUTOCOMPLETE
// Debounced location suggestions with full
// ARIA combobox keyboard + pointer interaction
// ============================================

import { searchLocation } from "./dataFunctions.js";

const DEBOUNCE_DELAY_MS = 300;
const MIN_QUERY_LENGTH = 2;

let debounceTimerId = null;
let suggestionResults = [];
let activeIndex = -1;
let onSelectCallback = null;

const inputEl = document.getElementById("search__input");
const listboxEl = document.getElementById("search__suggestions");

// ============================================
// Public init
// onSelect receives the chosen WeatherAPI result object
// ============================================

export const initAutocomplete = (onSelect) => {
    onSelectCallback = onSelect;

    inputEl.addEventListener("input", handleInput);
    inputEl.addEventListener("keydown", handleKeydown);
    inputEl.addEventListener("blur", handleBlur);
    listboxEl.addEventListener("mousedown", handleListboxMousedown);
};

// ============================================
// Input handling (debounced fetch)
// ============================================

const handleInput = () => {
    const queryText = inputEl.value.trim();

    clearTimeout(debounceTimerId);

    if (queryText.length < MIN_QUERY_LENGTH) {
        closeSuggestions();
        return;
    }

    debounceTimerId = setTimeout(() => fetchSuggestions(queryText), DEBOUNCE_DELAY_MS);
};

const fetchSuggestions = async (queryText) => {
    const results = await searchLocation(queryText);

    // Guard against the input changing while the request was in flight
    if (!results || inputEl.value.trim().length < MIN_QUERY_LENGTH) {
        closeSuggestions();
        return;
    }

    suggestionResults = results;
    renderSuggestions(suggestionResults);
};

// ============================================
// Rendering
// ============================================

const renderSuggestions = (results) => {
    listboxEl.innerHTML = "";
    activeIndex = -1;

    if (!results.length) {
        closeSuggestions();
        return;
    }

    results.forEach((result, index) => {
        const itemEl = buildSuggestionItem(result, index);
        listboxEl.appendChild(itemEl);
    });

    openSuggestions();
};

const buildSuggestionItem = (result, index) => {
    const itemEl = document.createElement("li");

    // Build the secondary line: show region + country if region exists
    // and isn't the same as the city name, otherwise just country
    const metaText = result.admin1 && result.admin1 !== result.name
        ? `${result.admin1}, ${result.country}`
        : result.country;

    itemEl.id = `search__suggestion-${index}`;
    itemEl.className = "search__suggestion";
    itemEl.setAttribute("role", "option");
    itemEl.setAttribute("aria-selected", "false");
    itemEl.dataset.index = index;

    itemEl.innerHTML = `
        <span class="search__suggestion-name">${result.name}</span>
        <span class="search__suggestion-meta">${metaText}</span>
    `;

    return itemEl;
};

// ============================================
// Open / close state
// ============================================

const openSuggestions = () => {
    listboxEl.classList.remove("none");
    inputEl.setAttribute("aria-expanded", "true");
};

const closeSuggestions = () => {
    listboxEl.classList.add("none");
    listboxEl.innerHTML = "";
    inputEl.setAttribute("aria-expanded", "false");
    inputEl.setAttribute("aria-activedescendant", "");
    suggestionResults = [];
    activeIndex = -1;
};

// ============================================
// Keyboard navigation
// ============================================

const handleKeydown = (event) => {
    const isOpen = !listboxEl.classList.contains("none");
    if (!isOpen || !suggestionResults.length) return;

    switch (event.key) {
        case "ArrowDown":
            event.preventDefault();
            moveActiveIndex(1);
            break;
        case "ArrowUp":
            event.preventDefault();
            moveActiveIndex(-1);
            break;
        case "Enter":
            if (activeIndex >= 0) {
                event.preventDefault();
                selectSuggestion(activeIndex);
            }
            break;
        case "Escape":
            closeSuggestions();
            break;
    }
};

const moveActiveIndex = (direction) => {
    const itemCount = suggestionResults.length;
    activeIndex = (activeIndex + direction + itemCount) % itemCount;
    highlightActiveItem();
};

const highlightActiveItem = () => {
    const items = listboxEl.querySelectorAll(".search__suggestion");

    items.forEach((item, index) => {
        const isActive = index === activeIndex;
        item.classList.toggle("search__suggestion--active", isActive);
        item.setAttribute("aria-selected", String(isActive));
    });

    const activeItem = items[activeIndex];
    if (activeItem) {
        inputEl.setAttribute("aria-activedescendant", activeItem.id);
        activeItem.scrollIntoView({ block: "nearest" });
    }
};

// ============================================
// Selection (pointer + keyboard share this path)
// ============================================

const handleListboxMousedown = (event) => {
    const itemEl = event.target.closest(".search__suggestion");
    if (!itemEl) return;

    // Prevent the input's blur-close from firing before we read the click
    event.preventDefault();
    selectSuggestion(Number(itemEl.dataset.index));
};

const selectSuggestion = (index) => {
    const result = suggestionResults[index];
    if (!result) return;

    inputEl.value = result.name;
    closeSuggestions();

    if (onSelectCallback) onSelectCallback(result);
};

// ============================================
// Blur handling
// Delay close slightly so click-selection above can register first
// ============================================

const handleBlur = () => {
    setTimeout(closeSuggestions, 100);
};