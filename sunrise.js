/* =========================================
   SUNRISEX
   SUNRISE.JS
   Solar Data + Dashboard
========================================= */


/* =========================================
   LOAD SOLAR DATA
========================================= */

async function loadSolarData(latitude, longitude, date = "today") {

    try {

        showSolarLoading();

        const solarData = await getSolarInformation(
            latitude,
            longitude,
            date
        );

        updateSolarDashboard(solarData);

        updateDayNightStatus(
            solarData.sunrise,
            solarData.sunset
        );

        console.log("Solar Data:", solarData);

    } catch (error) {

        console.error(
            "Solar Data Error:",
            error
        );

        showSolarError();

    }
}


/* =========================================
   UPDATE SOLAR DASHBOARD
========================================= */

function updateSolarDashboard(data) {

    const sunriseElement =
        document.getElementById("sunriseTime");

    const sunsetElement =
        document.getElementById("sunsetTime");

    const dayLengthElement =
        document.getElementById("dayLength");

    const solarNoonElement =
        document.getElementById("solarNoon");


    /* Sunrise */

    if (sunriseElement) {

        sunriseElement.textContent =
            formatTime(data.sunrise);

    }


    /* Sunset */

    if (sunsetElement) {

        sunsetElement.textContent =
            formatTime(data.sunset);

    }


    /* Day Length */

    if (dayLengthElement) {

        dayLengthElement.textContent =
            data.dayLength;

    }


    /* Solar Noon */

    if (solarNoonElement) {

        solarNoonElement.textContent =
            formatTime(data.solarNoon);

    }
}


/* =========================================
   DAY / NIGHT STATUS
========================================= */

function updateDayNightStatus(
    sunrise,
    sunset
) {

    const now = new Date();

    const sunriseDate =
        new Date(sunrise);

    const sunsetDate =
        new Date(sunset);


    const isDay =
        now >= sunriseDate &&
        now < sunsetDate;


    const statusElement =
        document.getElementById("statusText");

    const liveStatus =
        document.getElementById("liveDayNight");

    const simulationStatus =
        document.getElementById(
            "simulationStatus"
        );


    if (isDay) {

        if (statusElement) {
            statusElement.textContent =
                "☀️ It is Daytime";
        }

        if (liveStatus) {
            liveStatus.textContent =
                "Day";
        }

        if (simulationStatus) {
            simulationStatus.textContent =
                "Day";
        }

    } else {

        if (statusElement) {
            statusElement.textContent =
                "🌙 It is Nighttime";
        }

        if (liveStatus) {
            liveStatus.textContent =
                "Night";
        }

        if (simulationStatus) {
            simulationStatus.textContent =
                "Night";
        }
    }
}


/* =========================================
   LOADING STATE
========================================= */

function showSolarLoading() {

    const sunrise =
        document.getElementById("sunriseTime");

    const sunset =
        document.getElementById("sunsetTime");

    const dayLength =
        document.getElementById("dayLength");

    const solarNoon =
        document.getElementById("solarNoon");


    if (sunrise) {
        sunrise.textContent = "...";
    }

    if (sunset) {
        sunset.textContent = "...";
    }

    if (dayLength) {
        dayLength.textContent = "...";
    }

    if (solarNoon) {
        solarNoon.textContent = "...";
    }
}


/* =========================================
   ERROR STATE
========================================= */

function showSolarError() {

    const sunrise =
        document.getElementById("sunriseTime");

    const sunset =
        document.getElementById("sunsetTime");

    const dayLength =
        document.getElementById("dayLength");

    const solarNoon =
        document.getElementById("solarNoon");


    if (sunrise) {
        sunrise.textContent = "--";
    }

    if (sunset) {
        sunset.textContent = "--";
    }

    if (dayLength) {
        dayLength.textContent = "--";
    }

    if (solarNoon) {
        solarNoon.textContent = "--";
    }
}


/* =========================================
   INITIAL SOLAR DATA
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            typeof currentLocation !==
            "undefined"
        ) {

            loadSolarData(
                currentLocation.latitude,
                currentLocation.longitude
            );

        }

    }
);