document.addEventListener("DOMContentLoaded", function () {
  const countryName = getQueryParam("country");
  if (countryName) {
    fetchData(countryName);
    fetchCountryImage(countryName);
  } else {
    showErrorNotification(
      "No country specified. Please enter a valid country name.",
    );
  }
});

// dynamic heading
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

// Function to get query parameters from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to fetch and display country data
async function fetchData(countryName) {
  const dataContainer = document.getElementById("data-container");
  const nameFlagContainer = document.getElementById("name-flag");

  try {
    const apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(
      countryName,
    )}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Country not found. Please try again.");
    }

    const data = await response.json();
    const country = data[0]; // Get the first country in the response

    // Extract required fields
    const countryData = {
      Name: country.name.common,
      Capital: country.capital?.[0] || "N/A",
      Region: country.region,
      Area: country.area,
      Population: country.population,
      Timezone: country.timezones?.[0] || "N/A",
    };

    // Clear previous data
    dataContainer.innerHTML = "";
    nameFlagContainer.innerHTML = "";

    // Display country flag and name
    const flagImg = document.createElement("img");
    flagImg.src = country.flags.svg;
    flagImg.alt = `Flag of ${country.name.common}`;

    const countryNameElement = document.createElement("p");
    countryNameElement.textContent = country.name.common;

    nameFlagContainer.appendChild(flagImg);
    nameFlagContainer.appendChild(countryNameElement);

    // Create the two-column grid
    const grid = document.createElement("div");
    grid.className = "two-column-grid";

    // Left Column: Attributes
    const leftColumn = document.createElement("div");
    leftColumn.className = "left-column";

    // Right Column: Data
    const rightColumn = document.createElement("div");
    rightColumn.className = "right-column";

    // Add attributes and data to the columns
    for (const [key, value] of Object.entries(countryData)) {
      // Left Column: Attribute
      const attributeDiv = document.createElement("div");
      attributeDiv.className = "attribute";
      attributeDiv.textContent = `${key}:`;
      leftColumn.appendChild(attributeDiv);

      // Right Column: Data
      const dataDiv = document.createElement("div");
      dataDiv.className = "data";
      dataDiv.textContent = value;
      rightColumn.appendChild(dataDiv);
    }

    // Append columns to the grid
    grid.appendChild(leftColumn);
    grid.appendChild(rightColumn);

    // Append the grid to the container
    dataContainer.appendChild(grid);
  } catch (error) {
    console.error("Error fetching data:", error);
    dataContainer.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

// Function to fetch and display a random country image from Pexels
async function fetchCountryImage(countryName) {
  const imageContainer = document.getElementById("image-container");
  const apiKey = "iPviBdzTpSgdd2DDTfhA0Dw5RAo6qDqEHcXaGLlcRkvpNbnkTqwbfURX";

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${countryName}&per_page=15`,
      {
        headers: {
          Authorization: apiKey,
        },
      },
    );

    const data = await response.json();

    if (data.photos.length > 0) {
      // Select a random image from the fetched results
      const randomIndex = Math.floor(Math.random() * data.photos.length);
      const imageUrl = data.photos[randomIndex].src.large;

      imageContainer.innerHTML = `<img src="${imageUrl}" alt="Scenic view of ${countryName}">`;
    } else {
      imageContainer.innerHTML = "<p>No image found</p>";
    }
  } catch (error) {
    console.error("Error fetching country image:", error);
    imageContainer.innerHTML = "<p>Image not available</p>";
  }
}

// Fetch and display data
const countryName = getQueryParam("country");
if (countryName) {
  fetchData(countryName);
  fetchCountryImage(countryName);
} else {
  document.getElementById("data-container").innerHTML =
    `<p class="error">No country specified. Please go back and search for a country.</p>`;
}
