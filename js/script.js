// COURSE: CRTY1033 Web Mapping
// PURPOSE: Assignment 4 - JavaScript Libraries for Web Mapping Applications (Mapbox)
// DEVELOPER: Carlyle Apps
// DATE: February 13, 2025 
// REVISED: February 18, 2025  

// Import the necessary Mapbox GL JS access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybHlsZWFwcHMtdzA1MTgxODkiLCJhIjoiY203MXpya3EwMDUxMDJrcHJyOWt0cmp5ciJ9.I8YPl1cY5WjjEOG9w10RvQ';

// Initialize the map with specified options
const map = new mapboxgl.Map({
    attributionControl: false, // Disable the default attribution control
    container: 'map', // Container ID for the map
    style: 'mapbox://styles/carlyleapps-w0518189/cm73wbjq1002301s3068qgt0q', // Style URL from Mapbox Studio
    center: [-84, 49], // Initial center position [lng, lat]
    zoom: 5 // Initial zoom level
});

// Add the geocoder control first so it appears above the legend
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});
map.addControl(geocoder, 'top-right');

// Add the legend control after the map style is fully loaded
map.on('load', function() {
    const targets = {
        'owlnestingsites': 'Owl Nesting Sites',
    };

    // Add legend control to the map
    map.addControl(new MapboxLegendControl(targets, { showDefault: true, title: 'Owl Nesting Sites in Ontario' }), 'top-right');
});

// Ensure the data layer is fully loaded before creating pop-ups
map.on('sourcedata', function(e) {
    if (e.isSourceLoaded && map.getLayer('owlnestingsites')) {
        console.log('Layer and source fully loaded!');

        // Event listener for clicking on the 'owlnestingsites' layer
        map.on('click', 'owlnestingsites', function(e) {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const owlType = e.features[0].properties.Owl_Type;
            console.log('Owl Type:', owlType); // Log the Owl_Type value

            const owlImages = { // All owl image links
                'Great Horned Owl': 'img/GreatHornedOwl.jpg',
                'Great Gray Owl': 'img/GreatGrayOwl.jpg',
                'Barred Owl': 'img/BarredOwl.jpg',
                'Eastern Screech-Owl': 'img/EasternScreech-Owl.jpg',
                'Long-eared Owl': 'img/Long-earedOwl.jpg',
                'Northern Saw-whet Owl': 'img/NorthernSaw-whet.jpg'
            };

            // Ensure the key is correct by trimming any extra spaces
            const trimmedOwlType = owlType.trim();
            console.log('Trimmed Owl Type:', trimmedOwlType);
            
            // Check if the owl type exists in the dictionary
            console.log('Available Owl Types:', Object.keys(owlImages));
            const imageSrc = owlImages[trimmedOwlType];
            console.log('Image Source Set To:', imageSrc); // Log the image src value

            // HTML content for the pop-up
            const description = `
                <img id="owlImage" src="${imageSrc}" alt="No image available for this owl type" />
                <h2>${owlType}</h2>
                <p><b>Status: </b>${e.features[0].properties.Nesting_Activity_Status}</p>
                <p><b>Location Accuracy: </b>${e.features[0].properties.Location_Accuracy}</p>
                <h4>Nest Placement: </h4>
                <ul>
                    <li><b>Type: </b>${e.features[0].properties.Nest_Support_Type}</li>
                    <li><b>Tree Condition: </b>${e.features[0].properties.Nest_Tree_Condition}</li>
                    <li><b>Tree Species: </b>${e.features[0].properties.Nest_Tree_Condition}</li>
                </ul>
                <h4>Nest Build: </h4>
                <ul>
                    <li><b>Width: </b>${e.features[0].properties.Nest_Width}</li>
                    <li><b>Depth: </b>${e.features[0].properties.Nest_Depth}</li>
                    <li><b>Stick Size: </b>${e.features[0].properties.Nest_Stick_Diameter}</li>
                    <li><b>Construction: </b>${e.features[0].properties.Nest_Construction_Category}</li>
                </ul>
                <p><b>Survey Notes: </b>${e.features[0].properties.Survey_Notes}</p>
            `;

            // Create a new pop-up with the feature's information
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);

        });

        map.on('mouseenter', 'owlnestingsites', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'owlnestingsites', function() {
            map.getCanvas().style.cursor = '';
        });
    }
});

// Add scale control to the map
const scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'metric'
});
map.addControl(scale);
scale.setUnit('metric');

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

// Add geolocate control to the top-left corner
const geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
});
map.addControl(geolocateControl, 'top-left');

// Add fullscreen control to the map
map.addControl(new mapboxgl.FullscreenControl({
    container: document.querySelector('body')
}), 'top-left');

// Add attribution control to the map
map.addControl(new mapboxgl.AttributionControl({
    customAttribution: 'Carlyle Apps, 2025 | Icon by <a class="link_pro" href="https://freeicons.io/profile/1">Read</a> on <a href="https://freeicons.io">freeicons.io</a>'
}));

