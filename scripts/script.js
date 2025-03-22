document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("loaded");
});

document.addEventListener("DOMContentLoaded", function () {
  const countryName = getQueryParam("country");
  const countryHero = document.querySelector(".country-hero");
  const dataContainer = document.querySelector("#data-container");

  if (countryHero) countryHero.style.display = "none";
  if (dataContainer) dataContainer.style.display = "none";

  if (countryName) {
    if (!isValidCountryName(countryName)) {
      showErrorNotification("Invalid country name. Please enter a valid name.");
      return;
    }
    fetchData(countryName);
    fetchCountryImage(countryName);
  } else {
    showErrorNotification(
      "No country specified. Please enter a valid country name."
    );
  }
});

const apiKey = "iPviBdzTpSgdd2DDTfhA0Dw5RAo6qDqEHcXaGLlcRkvpNbnkTqwbfURX";

// Get query parameter from the URL
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// Validate country name (should contain letters only)
function isValidCountryName(name) {
  return /^[a-zA-Z\s-]+$/.test(name.trim());
}

async function fetchData(countryName) {
  const heroSection = document.querySelector(".hero");
  const countryHero = document.querySelector(".country-hero");
  const dataContainer = document.getElementById("data-container");
  const nameFlagContainer = document.getElementById("name-flag");
  const imageContainer = document.getElementById("image-container");
  const outputSection = document.getElementById("output");

  if (!dataContainer || !nameFlagContainer || !imageContainer) return;

  dataContainer.innerHTML = "<p>Loading country data...</p>";
  imageContainer.innerHTML = "<p>Loading image...</p>";

  try {
    const apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(
      countryName
    )}`;
    const countryResponse = await fetch(apiUrl);
    if (!countryResponse.ok)
      throw new Error("Country not found. Please try again.");

    const data = await countryResponse.json();
    if (!data || data.length === 0)
      throw new Error("Invalid country name. Try another one.");

    const country = data[0];

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

    nameFlagContainer.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
      <h2>${country.name.common}</h2>
    `;

    const grid = document.createElement("div");
    grid.className = "two-column-grid";

    const leftColumn = document.createElement("div");
    leftColumn.className = "left-column";
    const rightColumn = document.createElement("div");
    rightColumn.className = "right-column";

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
    dataContainer.innerHTML = "";
    dataContainer.appendChild(grid);

    if (countryHero) {
      countryHero.style.display = "flex";
      countryHero.style.opacity = "1";
    }
    dataContainer.style.display = "block";

    // Scroll to #output only if valid data is loaded
    if (outputSection) {
      setTimeout(() => {
        outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 1000);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    dataContainer.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

async function fetchCountryImage(countryName) {
  const imageContainer = document.getElementById("image-container");
  if (!imageContainer) return;

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

// Dynamic Heading Animation
document.addEventListener("DOMContentLoaded", () => {
  const dynamicText = document.getElementById("dynamic-heading");
  if (!dynamicText) return;

  const words = ["Web Developer.", "Programmer.", "Web Designer."];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeEffect = () => {
    const currentWord = words[wordIndex];
    const currentChar = currentWord.substring(0, charIndex);

    dynamicText.innerHTML = currentChar;

    if (!isDeleting && charIndex < currentWord.length) {
      charIndex++;
      setTimeout(typeEffect, 50);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(typeEffect, 50);
    } else {
      isDeleting = !isDeleting;
      wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
      setTimeout(typeEffect, 1000);
    }
  };

  typeEffect();
});
