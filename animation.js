/* =========================================
   SUNRISEX
   ANIMATION.JS
   Sunrise / Sunset Simulation
========================================= */


/* =========================================
   ANIMATION VARIABLES
========================================= */

let simulationRunning = false;
let simulationSpeed = 0.003;

let sunriseSimulationAngle = 0;


/* =========================================
   START SIMULATION
========================================= */

function startSunriseSimulation() {

    simulationRunning = true;

    updateSimulationStatus(
        "Sunrise simulation running"
    );

    console.log(
        "Sunrise simulation started."
    );
}


/* =========================================
   PAUSE SIMULATION
========================================= */

function pauseSunriseSimulation() {

    simulationRunning = false;

    updateSimulationStatus(
        "Simulation paused"
    );
}


/* =========================================
   RESET SIMULATION
========================================= */

function resetSunriseSimulation() {

    simulationRunning = false;

    sunriseSimulationAngle = 0;

    if (earthMesh) {

        earthMesh.rotation.y = 0;

    }

    if (atmosphereMesh) {

        atmosphereMesh.rotation.y = 0;

    }

    updateSimulationStatus(
        "Simulation reset"
    );
}


/* =========================================
   UPDATE SIMULATION
========================================= */

function updateSunriseSimulation() {

    if (!simulationRunning) {
        return;
    }


    sunriseSimulationAngle +=
        simulationSpeed;


    /*
       Rotate Earth.

       Earth rotates from west to east.
    */

    if (earthMesh) {

        earthMesh.rotation.y +=
            simulationSpeed;

    }


    /*
       Clouds rotate slightly faster.
    */

    if (earthMesh) {

        const clouds =
            earthMesh.getObjectByName(
                "earthClouds"
            );

        if (clouds) {

            clouds.rotation.y +=
                simulationSpeed * 1.2;

        }

    }


    /*
       Atmosphere rotates with Earth.
    */

    if (atmosphereMesh) {

        atmosphereMesh.rotation.y +=
            simulationSpeed * 0.8;

    }


    updateSimulationDayNight();

}


/* =========================================
   DETERMINE DAY / NIGHT
========================================= */

function updateSimulationDayNight() {

    /*
       Use Earth rotation to create
       a simple educational day/night cycle.
    */

    const angle =
        sunriseSimulationAngle %
        (Math.PI * 2);


    const normalizedAngle =
        angle < 0
            ? angle + Math.PI * 2
            : angle;


    /*
       Bright half
       = facing the Sun

       Dark half
       = facing away from Sun
    */

    const isDay =
        normalizedAngle < Math.PI;


    const liveDayNight =
        document.getElementById(
            "liveDayNight"
        );

    const statusText =
        document.getElementById(
            "statusText"
        );

    const simulationStatus =
        document.getElementById(
            "simulationStatus"
        );


    if (isDay) {

        if (liveDayNight) {
            liveDayNight.textContent =
                "Day";
        }

        if (statusText) {
            statusText.textContent =
                "☀️ Day — Location facing sunlight";
        }

        if (simulationStatus) {
            simulationStatus.textContent =
                "Day — Earth facing Sun";
        }

    } else {

        if (liveDayNight) {
            liveDayNight.textContent =
                "Night";
        }

        if (statusText) {
            statusText.textContent =
                "🌙 Night — Location facing away from sunlight";
        }

        if (simulationStatus) {
            simulationStatus.textContent =
                "Night — Earth away from Sun";
        }

    }
}


/* =========================================
   SIMULATION LOOP
========================================= */

function sunriseAnimationLoop() {

    updateSunriseSimulation();

    requestAnimationFrame(
        sunriseAnimationLoop
    );
}


/* =========================================
   SIMULATION CONTROLS
========================================= */

function setupSunriseControls() {

    const startButton =
        document.getElementById(
            "rotateBtn"
        );

    const pauseButton =
        document.getElementById(
            "pauseBtn"
        );

    const resetButton =
        document.getElementById(
            "resetEarthBtn"
        );


    /* START */

    if (startButton) {

        startButton.addEventListener(
            "click",
            function () {

                startSunriseSimulation();

            }
        );

    }


    /* PAUSE */

    if (pauseButton) {

        pauseButton.addEventListener(
            "click",
            function () {

                pauseSunriseSimulation();

            }
        );

    }


    /* RESET */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                resetSunriseSimulation();

            }
        );

    }
}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupSunriseControls();

        sunriseAnimationLoop();

        console.log(
            "SunRiseX animation module loaded."
        );

    }
);