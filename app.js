/* =========================================
   SUNRISEX
   APP.JS
   Main Application Controller
========================================= */


/* =========================================
   APPLICATION STATE
========================================= */

const SunRiseX = {

    name: "SunRiseX",

    version: "1.0.0",

    initialized: false,

    currentDate: "today"

};


/* =========================================
   INITIALIZE APPLICATION
========================================= */

function initializeSunRiseX() {

    console.log(
        "================================="
    );

    console.log(
        "SunRiseX Application Starting..."
    );

    console.log(
        "================================="
    );


    /* -----------------------------------------
       CHECK THREE.JS
    ----------------------------------------- */

    if (typeof THREE === "undefined") {

        console.error(
            "Three.js is not loaded."
        );

        return;

    }


    console.log(
        "✓ Three.js loaded"
    );


    /* -----------------------------------------
       CHECK LOCATION MODULE
    ----------------------------------------- */

    if (
        typeof currentLocation !==
        "undefined"
    ) {

        console.log(
            "✓ Location module loaded"
        );

    }


    /* -----------------------------------------
       CHECK API MODULE
    ----------------------------------------- */

    if (
        typeof getSolarInformation ===
        "function"
    ) {

        console.log(
            "✓ Solar API module loaded"
        );

    }


    /* -----------------------------------------
       CHECK EARTH MODULE
    ----------------------------------------- */

    if (
        typeof initializeEarth ===
        "function"
    ) {

        console.log(
            "✓ Earth module loaded"
        );

    }


    /* -----------------------------------------
       APPLICATION READY
    ----------------------------------------- */

    SunRiseX.initialized = true;


    console.log(
        "================================="
    );

    console.log(
        "SunRiseX is ready!"
    );

    console.log(
        "================================="
    );
}


/* =========================================
   REFRESH SOLAR INFORMATION
========================================= */

async function refreshSolarInformation() {

    if (
        typeof currentLocation ===
        "undefined"
    ) {

        console.error(
            "Current location is unavailable."
        );

        return;

    }


    try {

        await loadSolarData(

            currentLocation.latitude,

            currentLocation.longitude,

            SunRiseX.currentDate

        );


        /* -----------------------------------------
           UPDATE EARTH MARKER
        ----------------------------------------- */

        if (
            typeof updateEarthLocationMarker ===
            "function"
        ) {

            updateEarthLocationMarker(

                currentLocation.latitude,

                currentLocation.longitude

            );

        }

    } catch (error) {

        console.error(
            "Unable to refresh solar data:",
            error
        );

    }
}


/* =========================================
   UPDATE LOCATION
========================================= */

function handleLocationChange() {

    if (
        typeof currentLocation ===
        "undefined"
    ) {

        return;

    }


    console.log(
        "Location changed:"
    );

    console.log(
        currentLocation
    );


    refreshSolarInformation();


    /* -----------------------------------------
       UPDATE 3D MARKER
    ----------------------------------------- */

    if (
        typeof updateEarthLocationMarker ===
        "function"
    ) {

        updateEarthLocationMarker(

            currentLocation.latitude,

            currentLocation.longitude

        );

    }
}


/* =========================================
   PERIODIC SOLAR STATUS UPDATE
========================================= */

function startSolarStatusUpdater() {

    /*
       Check current day/night status
       every minute.
    */

    setInterval(
        function () {

            if (
                typeof currentLocation ===
                "undefined"
            ) {

                return;

            }


            refreshSolarInformation();

        },
        60000
    );
}


/* =========================================
   API CONNECTION CHECK
========================================= */

async function checkSolarAPI() {

    if (
        typeof currentLocation ===
        "undefined"
    ) {

        return;

    }


    try {

        const data =
            await getSolarInformation(

                currentLocation.latitude,

                currentLocation.longitude

            );


        if (data) {

            console.log(
                "✓ Sunrise/Sunset API connected"
            );

        }

    } catch (error) {

        console.error(
            "Solar API connection failed:",
            error
        );

    }
}


/* =========================================
   PAGE VISIBILITY
========================================= */

function setupVisibilityHandler() {

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "visible"
            ) {

                console.log(
                    "SunRiseX page active."
                );


                /*
                   Refresh data when the
                   user returns to the page.
                */

                refreshSolarInformation();

            }

        }
    );
}


/* =========================================
   GLOBAL ERROR HANDLER
========================================= */

function setupErrorHandler() {

    window.addEventListener(
        "error",
        function (event) {

            console.error(
                "SunRiseX Error:",
                event.error ||
                event.message
            );

        }
    );
}


/* =========================================
   APPLICATION START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        initializeSunRiseX();


        /* -----------------------------------------
           WAIT FOR OTHER MODULES
        ----------------------------------------- */

        setTimeout(
            async function () {

                await checkSolarAPI();

                startSolarStatusUpdater();

            },
            1000
        );


        setupVisibilityHandler();

        setupErrorHandler();

    }
);