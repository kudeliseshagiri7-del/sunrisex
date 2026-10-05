/* =========================================
   SUNRISEX
   API.JS
   Sunrise & Sunset API
========================================= */

const SUNRISE_API = "https://api.sunrise-sunset.org/json";


/* =========================================
   GET SUNRISE / SUNSET DATA
========================================= */

async function getSunriseSunset(latitude, longitude, date = "today") {

    try {

        const url =
            `${SUNRISE_API}?lat=${latitude}&lng=${longitude}&date=${date}&formatted=0`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to connect to Sunrise/Sunset API");
        }

        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error("Invalid location data");
        }

        return data.results;

    } catch (error) {

        console.error("Sunrise API Error:", error);

        throw error;
    }
}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(dateString) {

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}


/* =========================================
   CALCULATE DAY LENGTH
========================================= */

function calculateDayLength(sunrise, sunset) {

    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);

    const difference =
        sunsetDate.getTime() - sunriseDate.getTime();

    const totalSeconds =
        Math.floor(difference / 1000);

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
}


/* =========================================
   CALCULATE SOLAR NOON
========================================= */

function calculateSolarNoon(sunrise, sunset) {

    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);

    const middleTime =
        (sunriseDate.getTime() + sunsetDate.getTime()) / 2;

    return new Date(middleTime);
}


/* =========================================
   GET COMPLETE SOLAR INFORMATION
========================================= */

async function getSolarInformation(
    latitude,
    longitude,
    date = "today"
) {

    const data =
        await getSunriseSunset(
            latitude,
            longitude,
            date
        );

    const solarNoon =
        calculateSolarNoon(
            data.sunrise,
            data.sunset
        );

    return {

        sunrise: data.sunrise,

        sunset: data.sunset,

        solarNoon: solarNoon,

        dayLength:
            calculateDayLength(
                data.sunrise,
                data.sunset
            ),

        civilTwilightBegin:
            data.civil_twilight_begin,

        civilTwilightEnd:
            data.civil_twilight_end,

        nauticalTwilightBegin:
            data.nautical_twilight_begin,

        nauticalTwilightEnd:
            data.nautical_twilight_end,

        astronomicalTwilightBegin:
            data.astronomical_twilight_begin,

        astronomicalTwilightEnd:
            data.astronomical_twilight_end
    };
}


/* =========================================
   TEST API
========================================= */

console.log("SunRiseX API module loaded successfully.");