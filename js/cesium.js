"use strict";

// ---------- //
// Cesium Utility Functions
// ---------- //

// Earthquake magnitude colour palette
const yellow = "#ffc107"; // M1+
const orange = "#ff9800"; // M2.5+
const red = "#dc3545"; // M4.5+

// Return a colour or the category based on the earthquake magnitude
export function calcMagnitudeColour (num, returnCategory = false) {
    if (!returnCategory) {
        return num >= 1 && num < 2.5 ? yellow
         : num >= 2.5 && num < 4.5 ? orange
         : num >= 4.5 ? red
         : "black"; 
    };
    if (returnCategory) {
        return num >= 1 && num < 2.5 ? "yellow"
         : num >= 2.5 && num < 4.5 ? "orange"
         : num >= 4.5 ? "red"
         : "black"; 
    };        
};

// Return a date-time formatted
export function formatDateTime (datetime) {
    const timestamp = new Date(datetime);
    const formatDateTime = timestamp.toUTCString();
    return(formatDateTime);
};

// Fly camera to a continent
export function flyToContinent (viewer, continent) {
    // Define continent views
    const continentViews = {
        "North America": { lon: -100, lat: 40, zoom: 20000000 },
        "South America": { lon: -58, lat: -15, zoom: 28000000 },
        "Europe": { lon: 10, lat: 50, zoom: 18000000 },
        "Africa": { lon: 20, lat: 0, zoom: 25000000 },
        "Asia": { lon: 100, lat: 40, zoom: 28000000 },
        "Oceania": { lon: 135, lat: -25, zoom: 20000000 },
    };

    // Get values for continent using destructuring
    const {lon, lat, zoom} = continentViews[continent];

    // Change camera view to continent
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, zoom)
    });
};

// Cesium popup HTML content for each entity
export const entityPopupContent = function (mag, depth, lon, lat, time, place, usgsUrl) {
    const html = `
        <div>
            <p>Magnitude: ${mag}</p>
            <p>Depth: ${depth.toFixed(0)} km</p>
            <p>Origin: <a href="#" class="usgs-link" data-url="${usgsUrl}" style="color: #aef; text-decoration: none;">${place}</a></p>
            <p>Coordinates: ${lat.toFixed(2)}, ${lon.toFixed(2)} (Lat, Lon)</p>
            <p>Datetime: ${formatDateTime(time)}</p>
        </div>
    `;
    return(html);
};



// viewer.scene.globe.translucency.enabled = true;

// // Get the Cesium toolbar container
// const toolbar = viewer.container.querySelector(".cesium-viewer-toolbar");

// // Create a new button element
// const zoomInButton = document.createElement("button");
// zoomInButton.className = "cesium-button cesium-toolbar-button"; // Matches Cesium's button styles
// zoomInButton.innerHTML = "+"; // Plus sign for zoom in
// zoomInButton.style.fontSize = "20px"; // Increase font size
// zoomInButton.style.fontWeight = "bold";

// // Add click event to zoom in
// zoomInButton.addEventListener("click", () => {
//     // viewer.camera.setView(1000); // Zoom in by 1000 meters
//     viewer.camera.setView({
//         destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000) // Centered at the equator
//     });
// });

// // Append the button to the toolbar
// toolbar.appendChild(zoomInButton);

// // Get Cesium toolbar
// const toolbar = viewer.container.querySelector(".cesium-viewer-toolbar");

// // Create container div for the dropdown
// const dropdownContainer = document.createElement("div");
// dropdownContainer.style.display = "none"; // Hidden by default
// dropdownContainer.style.position = "absolute";
// dropdownContainer.style.top = "40px";
// dropdownContainer.style.right = "5px";
// dropdownContainer.style.background = "rgba(38, 38, 38, 0.9)";
// dropdownContainer.style.padding = "10px";
// dropdownContainer.style.borderRadius = "5px";
// dropdownContainer.style.color = "white";
// dropdownContainer.style.fontFamily = "sans-serif";
// dropdownContainer.style.zIndex = "1000";

// // Create button for opening the dropdown
// const continentButton = document.createElement("button");
// continentButton.className = "cesium-button cesium-toolbar-button"; // Match Cesium's buttons
// continentButton.innerHTML = "🌍"; // Globe icon (you can change this)
// continentButton.style.fontSize = "18px";
// // continentButton.style.marginLeft = "5px";

// // Toggle dropdown visibility when button is clicked
// continentButton.addEventListener("click", () => {
//     dropdownContainer.style.display = dropdownContainer.style.display === "none" ? "block" : "none";
// });

// // Append button to Cesium toolbar
// toolbar.appendChild(continentButton);
// toolbar.appendChild(dropdownContainer);

// // Define continent views
// const continentViews = {
//     "North America": { lon: -100, lat: 40, zoom: 25000000 },
//     "South America": { lon: -58, lat: -15, zoom: 28000000 },
//     "Europe": { lon: 10, lat: 50, zoom: 18000000 },
//     "Africa": { lon: 20, lat: 0, zoom: 25000000 },
//     "Asia": { lon: 100, lat: 40, zoom: 28000000 },
//     "Australia": { lon: 135, lat: -25, zoom: 20000000 },
// };

// // Create dropdown items for each continent
// for (const continent in continentViews) {
//     const item = document.createElement("div");
//     item.innerText = continent;
//     item.style.padding = "5px";
//     item.style.cursor = "pointer";

//     // Hover effect
//     item.addEventListener("mouseover", () => (item.style.background = "rgba(255, 255, 255, 0.2)"));
//     item.addEventListener("mouseout", () => (item.style.background = "transparent"));

//     // On click, move camera to continent
//     item.addEventListener("click", () => {
//         const view = continentViews[continent];
//         // viewer.camera.setView({
//         viewer.camera.flyTo({
//             destination: Cesium.Cartesian3.fromDegrees(view.lon, view.lat, view.zoom)
//         });

//         // Hide dropdown after selection
//         dropdownContainer.style.display = "none";
//     });

//     dropdownContainer.appendChild(item);
// }

// // Assuming `results` is your GeoJSON data
// const geoJsonDataSource = new Cesium.GeoJsonDataSource();

// // Add GeoJSON data to the dataSource
// geoJsonDataSource.load(results);

// // Format the points
// console.log(geoJsonDataSource);

// // Add the dataSource to the viewer
// viewer.dataSources.add(geoJsonDataSource);

// Initial view
// const initialView = {
//     destination: Cesium.Cartesian3.fromDegrees(-0.118092, 51.509865, 15000000),
// };

// Set initial view when the scene loads
// viewer.scene.camera.setView(initialView);

// // Set view to inital view when home button clicked
// viewer.homeButton.viewModel.command.beforeExecute.addEventListener("click", (e) => {
//     e.cancel = true; // prevent default behavior

//     // Change back to initial view
//     viewer.camera.flyTo({
//         initialView,
//         duration: 2, // Smooth transition time in seconds
//         easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT
//     });
// });