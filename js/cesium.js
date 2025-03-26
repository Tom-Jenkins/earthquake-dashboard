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

// Fly to strongest earthquake
export function flyToStrongestEarthquake (viewer, lon, lat, zoom) {
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
            <p>Origin: <a class="usgs-link" data-url="${usgsUrl}" style="color: #aef; text-decoration: none; cursor: pointer;">${place}&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                        <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                    </svg>
                </a>
            </p>
            <p>Coordinates: ${lat.toFixed(2)}, ${lon.toFixed(2)} (Lat, Lon)</p>
            <p>Datetime: ${formatDateTime(time)}</p>
        </div>
    `;
    return(html);
};
