document.addEventListener("DOMContentLoaded", function () {
  const countryName = getQueryParam("country");

  // Initially hide the sections
  document.querySelector(".country-hero").style.display = "none";
  document.querySelector("#data-container").style.display = "none";

  if (countryName) {
    fetchData(countryName);
    fetchCountryImage(countryName);
  } else {
    showErrorNotification(
      "No country specified. Please enter a valid country name."
    );
  }
});

require("dotenv").config();
const apiKey = process.env.PEXELS_API_KEY;

// Function to get query parameters from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to fetch and display country data
async function fetchData(countryName) {
  const dataContainer = document.getElementById("data-container");
  const nameFlagContainer = document.getElementById("name-flag");
  const imageContainer = document.getElementById("image-container");

  // Show loading message
  dataContainer.innerHTML = "<p>Loading country data...</p>";
  imageContainer.innerHTML = "<p>Loading image...</p>";

  try {
    const apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(
      countryName
    )}`;

    // Fetch country data and image in parallel
    const [countryResponse, imageResponse] = await Promise.all([
      fetch(apiUrl),
      fetchCountryImage(countryName),
    ]);

    // Handle country data response
    if (!countryResponse.ok)
      throw new Error("Country not found. Please try again.");
    const data = await countryResponse.json();
    const country = data[0];

    // Extract required fields
    const countryData = {
      Name: country.name.common,
      Capital: country.capital?.[0] || "N/A",
      Region: country.region,
      "Area (sq km)": country.area.toLocaleString(),
      Population: country.population.toLocaleString(),
      Timezone: country.timezones?.[0] || "N/A",
      Languages: country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A",
      Currency: country.currencies
        ? Object.values(country.currencies)
            .map((c) => c.name)
            .join(", ")
        : "N/A",
    };

    // Clear previous data
    nameFlagContainer.innerHTML = "";
    dataContainer.innerHTML = "";

    // Display country flag and name
    nameFlagContainer.innerHTML = `
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
        <h2>${country.name.common}</h2>
      `;

    // Create the two-column grid
    const grid = document.createElement("div");
    grid.className = "two-column-grid";

    const leftColumn = document.createElement("div");
    leftColumn.className = "left-column";

    const rightColumn = document.createElement("div");
    rightColumn.className = "right-column";

    // Populate columns
    for (const [key, value] of Object.entries(countryData)) {
      const attributeDiv = document.createElement("div");
      attributeDiv.className = "attribute";
      attributeDiv.textContent = `${key}:`;
      leftColumn.appendChild(attributeDiv);

      const dataDiv = document.createElement("div");
      dataDiv.className = "data";
      dataDiv.textContent = value;
      rightColumn.appendChild(dataDiv);
    }

    grid.appendChild(leftColumn);
    grid.appendChild(rightColumn);
    dataContainer.appendChild(grid);

    // Make sections visible with smooth transition
    document.querySelector(".country-hero").style.display = "flex";
    document.querySelector("#data-container").style.display = "block";
  } catch (error) {
    console.error("Error fetching data:", error);
    dataContainer.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

// Function to fetch and display a random country image from Pexels
async function fetchCountryImage(countryName) {
  const imageContainer = document.getElementById("image-container");
  const apiKey = "";

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${countryName}&per_page=15`,
      { headers: { Authorization: apiKey } }
    );

    if (!response.ok) throw new Error("Failed to fetch image.");

    const data = await response.json();

    if (data.photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.photos.length);
      const imageUrl = data.photos[randomIndex].src.large;

      imageContainer.innerHTML = `<img src="${imageUrl}" alt="Scenic view of ${countryName}">`;
    } else {
      imageContainer.innerHTML = "<p>No image found.</p>";
    }
  } catch (error) {
    console.error("Error fetching country image:", error);
    imageContainer.innerHTML = "<p>Image not available.</p>";
  }
}

// Check if there's a country query parameter and fetch data
const countryQuery = getQueryParam("country");
if (countryQuery) {
  fetchData(countryQuery);
}

// Dynamic heading

const dynamicText = document.getElementById("dynamic-heading");
const words = ["Web Developer.", "Programmer.", "Web Designer."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
  const currentWord = words[wordIndex];
  const currentChar = currentWord.substring(0, charIndex);

  dynamicText.textContent = currentChar;

  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(typeEffect, 50);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 50);
  } else {
    isDeleting = !isDeleting;
    wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
    setTimeout(typeEffect, 1200);
  }
};

typeEffect();
