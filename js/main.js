"use strict";

// Import objects from modules
import { fetchEarthQuakes } from "./fetchEarthquakeData.js";
import { flyToContinent } from "./cesium.js";
import { token } from "./cesiumAPI.js";

// ---------- //
// Load Cesium Viewer from API
// ---------- //

let viewer;

try {
    // Access token
    Cesium.Ion.defaultAccessToken = token;

    // Initialize Cesium Viewer
    viewer = new Cesium.Viewer("cesiumContainer", {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        fullscreenButton: false,
        animation: false,
        timeline: false,
        navigationInstructionsInitiallyVisible: false,
        // sceneModePicker: false,
        // creditContainer: document.createElement("div")
        // navigationHelpButton: false,
        // homeButton: false,
        // geocoder: false,
        // baseLayerPicker: false,
        selectionIndicator : false,
    });

    // Define the default view rectangle (min/max longitude & latitude)
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
        -170.0,  // minimum longitude
        -30.0,  // minimum latitude
        -60.0,  // maximum longitude
        80.0    // maximum latitude
    );

    // Change mouse to pointer
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
        const pickedObject = viewer.scene.pick(movement.endPosition);
        
        if (Cesium.defined(pickedObject) && pickedObject.id) {
            // Change the cursor to a pointer when hovering over an entity
            document.body.style.cursor = "pointer";
        } else {
            // Reset to default cursor when not hovering over an entity
            document.body.style.cursor = "default";
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Ensure points to not disappear or become distorted when zooming in
    viewer.scene.globe.depthTestAgainstTerrain = false;

    // Set viewer zoom limits (in metres)
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1000000000;


} catch (error) {
    console.error("Error initialising Cesium:", error);
    alert("An error occured while initialising the Cesium viewer. Please check internet connection and try again later.");
};


// ---------- //
// Fetch Earthquake Data from API
// ---------- //

// Fetch earthquake data and add to Cesium map if tiles were rendered
if (viewer) {
    fetchEarthQuakes(viewer);
};

// Re-fetch earthquakes when user clicks fetch data button
if (viewer) {
    const fetchDataBtn = document.getElementById("btn-fetch-data");
    fetchDataBtn.addEventListener("click", () => {
        // Remove all points previously on viewer
        viewer.entities.removeAll();
        // Fetch data and add to viewer
        fetchEarthQuakes(viewer);
    });
};

// Workaround to Cesium iframe blocking hyperlinks in entity popups
// Handle link clicks on popups from parent page
if (viewer) {
    viewer.selectedEntityChanged.addEventListener((entity) => {
        if (entity) {
            setTimeout(() => {
                let infoBoxDocument = viewer.infoBox.frame.contentDocument;
                let links = infoBoxDocument.querySelectorAll(".usgs-link");
    
                links.forEach(link => {
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        let url = link.getAttribute("data-url");

                        // Open in a new tab from parent window
                        window.open(url, "_blank", "noopener,noreferrer"); 
                    });
                });
            }, 500); // short delay to ensure InfoBox content loads
        }
    });
};


// ---------- //
// Dropdown Menu Functionality
// ---------- //

// Toggle Dropdown Menu
const iconMenu = document.querySelector(".icon-menu");
const dropdown = document.querySelector(".dropdown");
iconMenu.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle("dropdown-open");
});

// Close dropdown menu when button clicked
const btnDropdown = document.getElementById("btn-close-dropdown");
btnDropdown.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.remove("dropdown-open");
});

// Close dropdown menu when clicking outside of it
document.addEventListener("click", (e) => {
    if (dropdown.classList.contains("dropdown-open")) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("dropdown-open");
        };
    };
});


// ---------- //
// Contintent Camera Views
// ---------- //

// Add event listeners to all zoom buttons in dropdown
const btnsContinentZoom = document.querySelectorAll(".btn-continent-zoom button");
btnsContinentZoom.forEach(button => {
    const continent = button.textContent;
    button.addEventListener("click", (e) => {
        e.preventDefault();
        if (viewer) flyToContinent(viewer, continent);
    });
});


// ---------- //
// Window Load
// ---------- //

// Run these functions on window load
window.addEventListener("load", () => {
    
});

// ---------- //
// Window Resize
// ---------- //

// Run these functions on window resize
window.addEventListener("resize", () => {

});
