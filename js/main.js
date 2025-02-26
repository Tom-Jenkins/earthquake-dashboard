"use strict";

// Initialise variable
let map;

// Available tiles
const OpenStreetMap_Mapnik = WE.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
const OpenTopoMap = WE.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: \u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: \u00A9 <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
const Esri_WorldStreetMap = WE.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: `Tiles \u00A9 Esri – Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012`
});
const Esri_WorldTopoMap = WE.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles \u00A9 Esri – Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});
const Esri_WorldImagery = WE.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles \u00A9 Esri – Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
const Esri_NatGeoWorldMap = WE.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles \u00A9 Esri – National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
});
const Esri_WorldGrayCanvas = WE.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles \u00A9 Esri – Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});
var USGS_USTopo = WE.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});
var USGS_USImagery = WE.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});
var USGS_USImageryTopo = WE.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

// Function to render Earth map
function initialiseMap () {
    map = new WE.map("earthmap", {
        zoom: 2,
        maxZoom: 15,
    });
    OpenStreetMap_Mapnik.addTo(map); // add tiles to map
    // earth.setView([51,0], 2) // set view and zoom

    // marker = WE.marker([51.5, -0.09]).addTo(earth);
    // marker.bindPopup("<b>Hello world!</b><br>I am a popup.<br /><span style='font-size:10px;color:#999'>Tip: Another popup is hidden in Cairo..</span>", {maxWidth: 150, closeButton: true}).openPopup();
}

// ---------- //
// Actions on Load
// ---------- //

// Initialise Earth map on window load
window.addEventListener("load", initialiseMap);


// ---------- //
// FETCH EARTHQUAKE DATA FROM API
// ---------- //

// API parameters
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
const format = "geojson";
const minMagnitude = 1;
const orderBy = "time"

// Base URL
let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=${format}&minmagnitude=${minMagnitude}&orderby=${orderBy}&eventtype=earthquake`;

// Fetch 
async function fetchEarthQuakes() {

    try {

        // Compute the date and time seven days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Convert date and time to the format required
        const startTime = sevenDaysAgo.toISOString(); // Format: YYYY-MM-DD
        console.log(startTime);

        // Update URL
        url = `${url}&starttime=${startTime}`;
    
        // API fetch response
        const response = await fetch(url);
        console.log(response);

        // API results
        if (response.ok) {
            const results = await response.json();
            console.log(results);

            // const first = results.features[0];
            // console.log(first);

            for (let i = 0; i < results.features.length; i++) {
                // Extract latitude (y) and longitude (x)
                const yx = [results.features[i].geometry.coordinates[1], results.features[i].geometry.coordinates[0]];

                // Add points to earth map
                const circle = WE.marker(yx, "../img/circle-solid.svg", 10, 10).addTo(map);
            };

        };

    } catch(err) {
        console.error(err);
    };
};
// fetchEarthQuakes()


// Set zoom level
import { getZoomLevel,setZoom } from "./leaflet.js";
document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    // setZoom(map, 10);
    console.log(getZoomLevel(map));
});

// ---------- //
// STAR ANIMATION
// ---------- //

// function createStar() {
//     const starContainer = document.getElementById("back");
//     const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     const size = Math.random() * 15 + 5; // Random size between 5 and 20px
//     const duration = Math.random() * 5 + 3; // Random animation duration between 3s and 8s

//     star.setAttribute("class", "star");
//     star.setAttribute("width", size);
//     star.setAttribute("height", size);
//     star.setAttribute("viewBox", "0 0 20 20");
//     star.style.left = `${Math.random() * window.innerWidth}px`; // Random horizontal position
//     star.style.animationDuration = `${duration}s`;

//     // Use the defined symbol
//     const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
//     use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#icon-star");
//     star.appendChild(use);

//     starContainer.appendChild(star);

//     // Remove star when animation ends
//     setTimeout(() => {
//         star.remove();
//     }, duration * 1000);
// }

// // Generate new stars at intervals
// setInterval(createStar, 300);