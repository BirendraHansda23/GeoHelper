document.addEventListener("DOMContentLoaded", () => {
  const countryName = new URLSearchParams(window.location.search).get(
    "country"
  );

  function isValidCountryName(name) {
    const regex = /^[A-Za-z\s-]+$/;
    return regex.test(name.trim());
  }

  if (isValidCountryName(countryName)) {
    async function fetchData(countryName) {
      try {
        const flagTitle = document.getElementById("flag-title");
        const outputTable = document.getElementById("output-table");
        const outputContainer = document.getElementById("output-container");
        const countryFlag = document.getElementById("country-flag");
        const imageElement = document.getElementById("country-image"); // ✅ Make sure this is in your HTML

        const apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const country = data[0];

        const countryData = {
          Name: country.name.common,
          Capital: country.capital?.[0] || "N/A",
          Region: country.region,
          Area: country.area.toLocaleString(),
          Population: country.population.toLocaleString(),
          Timezone: country.timezones?.[0] || "N/A",
          Languages: country.languages
            ? Object.values(country.languages).join(", ")
            : "N/A",
          Currencies: country.currencies
            ? Object.values(country.currencies)
                .map((curr) => curr.name)
                .join(", ")
            : "N/A",
        };

        // Set flag
        if (country.flags.svg) {
          countryFlag.src = country.flags.svg;
          countryFlag.alt = `Flag of ${country.name.common}`;
        }
        flagTitle.textContent = `${country.name.common}`;

        // Fetch one random image
        const images = await fetchCountryImages(country.name.common);
        if (images.length > 0) {
          const randomIndex = Math.floor(Math.random() * images.length);
          imageElement.src = images[randomIndex];
          imageElement.alt = `Scenic view of ${country.name.common}`;
        }

        giveOutput(countryData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    function giveOutput(countryData) {
      const outputContainer = document.getElementById("output-container");
      const outputTable = document.getElementById("output-table");
      outputContainer.classList.remove("hidden");
      outputContainer.scrollIntoView({ behavior: "smooth" });

      outputTable.innerHTML = `
        <div class="row"><div class="title">Name:</div><div class="data">${countryData.Name}</div></div>
        <div class="row"><div class="title">Capital:</div><div class="data">${countryData.Capital}</div></div>
        <div class="row"><div class="title">Region:</div><div class="data">${countryData.Region}</div></div>
        <div class="row"><div class="title">Area (sq km):</div><div class="data">${countryData.Area}</div></div>
        <div class="row"><div class="title">Population:</div><div class="data">${countryData.Population}</div></div>
        <div class="row"><div class="title">Timezone:</div><div class="data">${countryData.Timezone}</div></div>
        <div class="row"><div class="title">Languages:</div><div class="data">${countryData.Languages}</div></div>
        <div class="row"><div class="title">Currencies:</div><div class="data">${countryData.Currencies}</div></div>
      `;

      document
        .querySelectorAll(".row")
        .forEach((row) => row.classList.add("flex", "gap-[18px]", "py-2"));
      document
        .querySelectorAll(".title")
        .forEach((title) =>
          title.classList.add(
            "w-2/5",
            "font-semibold",
            "text-md",
            "text-right",
            "p-3",
            "bg-gradient-to-l",
            "from-orange-50",
            "to-amber-50",
            "text-black"
          )
        );
      document
        .querySelectorAll(".data")
        .forEach((data) =>
          data.classList.add(
            "w-3/5",
            "font-normal",
            "text-md",
            "text-left",
            "p-3",
            "bg-gradient-to-r",
            "from-orange-50",
            "to-amber-50",
            "text-black"
          )
        );
    }

    fetchData(countryName);
  } else {
    alert("Invalid country name. Please enter a valid country name.");
  }
});

async function fetchCountryImages(countryName) {
  const query = `${countryName} scenic landscape`;
  const apiKey = "iPviBdzTpSgdd2DDTfhA0Dw5RAo6qDqEHcXaGLlcRkvpNbnkTqwbfURX";
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    return data.photos.map((photo) => photo.src.landscape);
  } catch (error) {
    console.error("Error fetching country images:", error);
    return [];
  }
}
