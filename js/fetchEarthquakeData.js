"use strict";

// Import functions from modules
import { calcMagnitudeColour, formatDateTime, flyToStrongestEarthquake, entityPopupContent } from "./cesium.js";

// Get elements from DOM
const earthquakeTotalDOM = document.getElementById("earthquake-total");
const daysDataDOM = document.getElementById("days-data");
const footerTimeDOM = document.querySelector(".box-footer-time");
const magnitudeRedDOM = document.getElementById("magnitude-red");
const magnitudeOrangeDOM = document.getElementById("magnitude-orange");
const magnitudeYellowDOM = document.getElementById("magnitude-yellow");
const highestEarthquakeDOM = document.querySelector(".box-highest-earthquake");
const spinner = document.querySelectorAll(".spinner");

// Initialise variables to keep count of magnitude category
let magYellowCount = [], magOrangeCount = [], magRedCount = [], magnitudeCategory;

// API parameters
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
const format = "geojson";
const minMagnitude = 1;
const orderBy = "time"
// const proxyUrl = "https://cors-anywhere.herokuapp.com/";

// User parameters
let daysToFetch;

// Base URL
const baseUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=${format}&minmagnitude=${minMagnitude}&orderby=${orderBy}&eventtype=earthquake`;

// Fetch earthquake data from USGS
export async function fetchEarthQuakes(viewer) {

    try {

        // Activate spinners
        spinner.forEach(spinner => spinner.style.display = "inline-block");

        // Current date and time
        const currentDateTime = new Date();

        // Get days to fetch from checked slider value
        daysToFetch = Number(document.querySelector("input[type='radio']:checked").value);
        
        // Date object with the number of days to request data
        const daysRequested = new Date();
        daysRequested.setDate(daysRequested.getDate() - daysToFetch);

        // Convert date and time to the format required
        const startTime = daysRequested.toISOString(); // Format: YYYY-MM-DD
        // console.log(startTime);

        // URL used for API request
        const url = `${baseUrl}&starttime=${startTime}`;
    
        // API fetch response
        const response = await fetch(url, { mode: "cors" });
        // console.log(response);

        // API results
        if (response.ok) {
            const results = await response.json();
            // console.log(results);

            // Update earthquake total on DOM
            earthquakeTotalDOM.textContent = results.metadata.count;

            // Update days data on DOM
            daysDataDOM.textContent = daysToFetch === 1 ? "24 Hours" : `${daysToFetch} Days`;

            // Format and update time on data retrieved box
            footerTimeDOM.textContent = `Data retrieved: ${formatDateTime(currentDateTime)}`;
            // footerTimeDOM.textContent = "Error retrieving data – please try again later or check internet connection";
            // footerTimeDOM.style.color = "var(--magnitude-red)";

            // Reset magnitude count variables
            magYellowCount = [];
            magOrangeCount = [];
            magRedCount = [];
            
            // Find the index of the earthquake with the highest magnitude
            const allMagnitudes = results.features.map(i => i.properties.mag); // get all magnitude values
            const highestMagIndex = allMagnitudes.reduce( (maxIdx, num, idx, array) => num > array[maxIdx] ? idx: maxIdx, 0);

            // Get the magnitude and place for this index
            const highestMag = results.features[highestMagIndex].properties.mag;
            const highestMagPlace = results.features[highestMagIndex].properties.place;
            const highestMagLink = results.features[highestMagIndex].properties.url;
            const strongestLon = results.features[highestMagIndex].geometry.coordinates[0];
            const strongestLat = results.features[highestMagIndex].geometry.coordinates[1];
            const highestMagTime = formatDateTime(results.features[highestMagIndex].properties.time);

            // Update highest earthquake by magnitude box
            highestEarthquakeDOM.innerHTML = `
                <a id="XXX">M ${highestMag} – ${highestMagPlace}</a>
                <br>
                <span class="box-footer">Earthquake time: ${highestMagTime}</span>
            `;

            // Add event listener to strongest earthquake which zooms in on origin
            document.getElementById("XXX").addEventListener("click", (e) => {
                e.preventDefault();
                flyToStrongestEarthquake(viewer, strongestLon, strongestLat, 1000000)
            });


            for (let i = 0; i < results.features.length; i++) {

                // Extract longitude (x), latitude (y) and depth (z) from geometry
                const xyz = {
                    longitude: results.features[i].geometry.coordinates[0],
                    latitude: results.features[i].geometry.coordinates[1],
                    depth: results.features[i].geometry.coordinates[2]
                };

                // Extract magnitude and assign colour
                const magnitude = results.features[i].properties.mag;
                const magnitudeColour = calcMagnitudeColour(magnitude);

                // Using destructuring extract place, time, etc.
                const [place, time, usgsURL] = [
                    results.features[i].properties.place,
                    results.features[i].properties.time,
                    results.features[i].properties.url,
                ];

                // Add earthquakes to Cesium viewer
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(xyz.longitude, xyz.latitude, xyz.depth),
                    name: `${place}`,
                    description: entityPopupContent(magnitude, xyz.depth, xyz.longitude, xyz.latitude, time, place, usgsURL),
                    point: { 
                        show: true,
                        pixelSize: 12, 
                        color: Cesium.Color.fromCssColorString(magnitudeColour),
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 0.5,
                        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                    },
                });

                // Depending on magnitude, add one to magnitude count category
                magnitudeCategory = calcMagnitudeColour(magnitude, true);
                if (magnitudeCategory === "yellow") {
                    magYellowCount.push(magnitudeCategory);
                } else if (magnitudeCategory === "orange") {
                    magOrangeCount.push(magnitudeCategory);
                } else if (magnitudeCategory === "red") {
                    magRedCount.push(magnitudeCategory);
                } else {
                    console.log("Error in function - unexpected magnitude category:", magnitudeCategory);
                }
            };

            // Update magnitude category counts box on DOM
            magnitudeRedDOM.textContent = magRedCount.length;
            magnitudeOrangeDOM.textContent = magOrangeCount.length;
            magnitudeYellowDOM.textContent = magYellowCount.length;
            // console.log(magYellowCount, magOrangeCount, magRedCount);
            // console.log(magnitudeCategory);

            // Deactivate spinners
            spinner.forEach(spinner => spinner.style.display = "none");
        };

    } catch(error) {
        console.error(error);

        // Render an error message on the data retrieved box
        footerTimeDOM.textContent = "Error retrieving data – please try again later or check internet connection";
        footerTimeDOM.style.color = "var(--magnitude-red)";

        // Deactivate spinners
        spinner.forEach(spinner => spinner.style.display = "none");
    };
};