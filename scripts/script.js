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
        const flagContainer = document.getElementById("flag-container");
        const flagTitle = document.getElementById("flag-title");
        const outputTable = document.getElementById("output-table");
        const outputContainer = document.getElementById("output-container");

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

        flagContainer.innerHTML = `
          <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" id="flag" class="h-[100px] object-contain"/>
        `;

        flagTitle.textContent = `${country.name.common}`;

        function giveOutput() {
          outputContainer.classList.toggle("hidden");

          outputTable.innerHTML = `
            <div class="row">
              <div class="title">Name:</div>
              <div class="data">${countryData.Name}</div>
            </div>
            <div class="row">
              <div class="title">Capital:</div>
              <div class="data">${countryData.Capital}</div>
            </div>
            <div class="row">
              <div class="title">Region:</div>
              <div class="data">${countryData.Region}</div>
            </div>
            <div class="row">
              <div class="title">Area (sq km):</div>
              <div class="data">${countryData.Area}</div>
            </div>
            <div class="row">
              <div class="title">Population:</div>
              <div class="data">${countryData.Population}</div>
            </div>
            <div class="row">
              <div class="title">Timezone:</div>
              <div class="data">${countryData.Timezone}</div>
            </div>
            <div class="row">
              <div class="title">Languages:</div>
              <div class="data">${countryData.Languages}</div>
            </div>
            <div class="row">
              <div class="title">Currencies:</div>
              <div class="data">${countryData.Currencies}</div>
            </div>
          `;

          const rows = document.querySelectorAll(".row");
          rows.forEach((row) =>
            row.classList.add("flex", "gap-[18px]", "py-2")
          );

          const titles = document.querySelectorAll(".title");
          titles.forEach((title) =>
            title.classList.add(
              "w-2/5",
              "font-semibold",
              "text-md",
              "text-right",
              "p-3",
              "bg-gradient-to-l",
              "from-[#f5f5f5]",
              "to-[#ffffff]",
              "text-black"
            )
          );

          const datas = document.querySelectorAll(".data");
          datas.forEach((data) =>
            data.classList.add(
              "w-3/5",
              "font-normal",
              "text-md",
              "text-left",
              "p-3",
              "bg-gradient-to-r",
              "from-[#f5f5f5]",
              "to-[#ffffff]",
              "text-black"
            )
          );
        }

        giveOutput();
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData(countryName);
  } else {
    alert("Invalid country name. Please enter a valid country name.");
  }
});
