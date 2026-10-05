/* =========================================
   SUNRISEX
   LOCATION.JS
   Location + Geolocation
========================================= */


/* =========================================
   DEFAULT LOCATION
========================================= */

let currentLocation = {
    name: "Hyderabad, India",
    latitude: 17.3850,
    longitude: 78.4867
};


/* =========================================
   UPDATE LOCATION ON SCREEN
========================================= */

function updateLocationUI(location) {

    const locationName =
        document.getElementById("locationName");

    const latitude =
        document.getElementById("latitude");

    const longitude =
        document.getElementById("longitude");

    if (locationName) {
        locationName.textContent = location.name;
    }

    if (latitude) {
        latitude.textContent =
            location.latitude.toFixed(4);
    }

    if (longitude) {
        longitude.textContent =
            location.longitude.toFixed(4);
    }
}


/* =========================================
   SET CURRENT LOCATION
========================================= */

function setCurrentLocation(
    name,
    latitude,
    longitude
) {

    currentLocation = {
        name: name,
        latitude: Number(latitude),
        longitude: Number(longitude)
    };

    updateLocationUI(currentLocation);

    console.log(
        "Current Location:",
        currentLocation
    );

    if (typeof loadSolarData === "function") {
        loadSolarData(
            currentLocation.latitude,
            currentLocation.longitude
        );
    }
}


/* =========================================
   GET USER'S CURRENT LOCATION
========================================= */

function getMyLocation() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;
    }

    const button =
        document.getElementById("myLocationBtn");

    if (button) {
        button.textContent = "Getting Location...";
        button.disabled = true;
    }


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            setCurrentLocation(
                "My Current Location",
                latitude,
                longitude
            );

            if (button) {
                button.textContent = "📍 My Location";
                button.disabled = false;
            }
        },

        function (error) {

            console.error(
                "Geolocation Error:",
                error
            );

            let message =
                "Unable to get your location.";

            if (error.code === 1) {
                message =
                    "Location permission was denied.";
            }

            if (error.code === 2) {
                message =
                    "Your location could not be determined.";
            }

            if (error.code === 3) {
                message =
                    "Location request timed out.";
            }

            alert(message);

            if (button) {
                button.textContent = "📍 My Location";
                button.disabled = false;
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


/* =========================================
   SEARCH LOCATION
========================================= */

async function searchLocation(locationText) {

    if (!locationText || locationText.trim() === "") {

        alert("Please enter a location.");

        return;
    }

    try {

        /*
         OpenStreetMap Nominatim
         Free geocoding service
        */

        const url =
            `https://nominatim.openstreetmap.org/search` +
            `?q=${encodeURIComponent(locationText)}` +
            `&format=json` +
            `&limit=1`;

        const response =
            await fetch(url, {
                headers: {
                    "Accept": "application/json"
                }
            });

        if (!response.ok) {
            throw new Error(
                "Location search failed"
            );
        }

        const results =
            await response.json();

        if (results.length === 0) {

            alert(
                "Location not found. Please try another location."
            );

            return;
        }

        const result = results[0];

        const latitude =
            Number(result.lat);

        const longitude =
            Number(result.lon);

        const name =
            result.display_name;

        setCurrentLocation(
            name,
            latitude,
            longitude
        );

    } catch (error) {

        console.error(
            "Location Search Error:",
            error
        );

        alert(
            "Unable to search this location."
        );
    }
}


/* =========================================
   SEARCH BUTTON
========================================= */

function setupLocationSearch() {

    const searchButton =
        document.getElementById("searchBtn");

    const input =
        document.getElementById("locationInput");

    const myLocationButton =
        document.getElementById("myLocationBtn");


    /* SEARCH */

    if (searchButton && input) {

        searchButton.addEventListener(
            "click",
            function () {

                searchLocation(
                    input.value
                );

            }
        );


        /* ENTER KEY */

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    searchLocation(
                        input.value
                    );

                }

            }
        );
    }


    /* MY LOCATION */

    if (myLocationButton) {

        myLocationButton.addEventListener(
            "click",
            getMyLocation
        );

    }
}


/* =========================================
   INITIALIZE LOCATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateLocationUI(
            currentLocation
        );

        setupLocationSearch();

        console.log(
            "SunRiseX Location module loaded."
        );

    }
);