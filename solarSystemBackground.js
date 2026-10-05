/* =========================================
   SUNRISEX
   SOLAR SYSTEM BACKGROUND
   Three.js Solar System
========================================= */

let solarScene;
let solarCamera;
let solarRenderer;

let solarSystem;
let solarAnimationId;

const solarPlanets = [];


/* =========================================
   INITIALIZE
========================================= */

function initializeSolarSystemBackground() {

    const container =
        document.getElementById(
            "solarSystemBackground"
        );

    if (!container) {
        console.error(
            "Solar system background container not found."
        );
        return;
    }

    /* Scene */

    solarScene = new THREE.Scene();

    solarScene.background =
        new THREE.Color(0x01030a);


    /* Camera */

    solarCamera =
        new THREE.PerspectiveCamera(
            55,
            window.innerWidth /
            window.innerHeight,
            0.1,
            2000
        );

    solarCamera.position.set(
        0,
        35,
        55
    );


    /* Renderer */

    solarRenderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    solarRenderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    solarRenderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    solarRenderer.outputEncoding =
        THREE.sRGBEncoding;

    container.appendChild(
        solarRenderer.domElement
    );


    /* Lights */

    createSolarLights();


    /* Stars */

    createSolarStars();


    /* Solar System */

    solarSystem =
        new THREE.Group();

    solarScene.add(
        solarSystem
    );


    /* Sun */

    createSun();


    /* Planets */

    createPlanet(
        "Mercury",
        0.35,
        5,
        0xaaaaaa,
        0.035
    );

    createPlanet(
        "Venus",
        0.55,
        8,
        0xd8b27c,
        0.025
    );

    createPlanet(
        "Earth",
        0.60,
        11,
        0x3976d2,
        0.020
    );

    createPlanet(
        "Mars",
        0.45,
        14,
        0xb94d32,
        0.017
    );

    createPlanet(
        "Jupiter",
        1.35,
        19,
        0xc98c62,
        0.009
    );

    createPlanet(
        "Saturn",
        1.10,
        25,
        0xd6bd83,
        0.007
    );

    createPlanet(
        "Uranus",
        0.75,
        31,
        0x75c9d6,
        0.005
    );

    createPlanet(
        "Neptune",
        0.72,
        37,
        0x4169e1,
        0.004
    );


    /* Asteroid Belt */

    createAsteroidBelt();


    /* Camera movement */

    window.addEventListener(
        "resize",
        resizeSolarSystem
    );


    /* Start animation */

    animateSolarSystem();

    console.log(
        "SunRiseX Solar System Background initialized."
    );
}


/* =========================================
   LIGHTS
========================================= */

function createSolarLights() {

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            0.15
        );

    solarScene.add(
        ambientLight
    );


    const sunLight =
        new THREE.PointLight(
            0xffffff,
            5,
            200
        );

    sunLight.position.set(
        0,
        0,
        0
    );

    solarScene.add(
        sunLight
    );
}


/* =========================================
   SUN
========================================= */

function createSun() {

    const geometry =
        new THREE.SphereGeometry(
            2.5,
            48,
            48
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0xffcc33
        });

    const sun =
        new THREE.Mesh(
            geometry,
            material
        );

    solarSystem.add(
        sun
    );


    /* Sun glow */

    const glowGeometry =
        new THREE.SphereGeometry(
            4,
            32,
            32
        );

    const glowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffaa22,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide
        });

    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    solarSystem.add(
        glow
    );
}


/* =========================================
   PLANET
========================================= */

function createPlanet(
    name,
    size,
    distance,
    color,
    speed
) {

    const orbitGroup =
        new THREE.Group();

    solarSystem.add(
        orbitGroup
    );


    /* Planet */

    const geometry =
        new THREE.SphereGeometry(
            size,
            32,
            32
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0
        });

    const planet =
        new THREE.Mesh(
            geometry,
            material
        );

    planet.position.x =
        distance;

    orbitGroup.add(
        planet
    );


    /* Orbit */

    const orbitGeometry =
        new THREE.RingGeometry(
            distance - 0.01,
            distance + 0.01,
            128
        );

    const orbitMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x64748b,
            transparent: true,
            opacity: 0.22,
            side: THREE.DoubleSide
        });

    const orbit =
        new THREE.Mesh(
            orbitGeometry,
            orbitMaterial
        );

    orbit.rotation.x =
        Math.PI / 2;

    solarSystem.add(
        orbit
    );


    /* Saturn rings */

    if (name === "Saturn") {

        const ringGeometry =
            new THREE.RingGeometry(
                1.5,
                2.3,
                64
            );

        const ringMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xc8b27c,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });

        const rings =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            );

        rings.rotation.x =
            Math.PI / 2.5;

        planet.add(
            rings
        );
    }


    /* Planet information */

    solarPlanets.push({
        planet: planet,
        orbitGroup: orbitGroup,
        distance: distance,
        speed: speed,
        angle:
            Math.random() *
            Math.PI *
            2
    });
}


/* =========================================
   ASTEROID BELT
========================================= */

function createAsteroidBelt() {

    const asteroidGeometry =
        new THREE.SphereGeometry(
            0.06,
            8,
            8
        );

    const asteroidMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x888888
        });

    const asteroidCount = 700;

    for (
        let i = 0;
        i < asteroidCount;
        i++
    ) {

        const asteroid =
            new THREE.Mesh(
                asteroidGeometry,
                asteroidMaterial
            );

        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            15.5 +
            Math.random() * 2.5;

        asteroid.position.x =
            Math.cos(angle) *
            radius;

        asteroid.position.z =
            Math.sin(angle) *
            radius;

        asteroid.position.y =
            (Math.random() - 0.5) *
            0.5;

        solarSystem.add(
            asteroid
        );
    }
}


/* =========================================
   STARS
========================================= */

function createSolarStars() {

    const geometry =
        new THREE.BufferGeometry();

    const starCount = 5000;

    const positions =
        new Float32Array(
            starCount * 3
        );

    for (
        let i = 0;
        i < starCount * 3;
        i += 3
    ) {

        const radius =
            120 +
            Math.random() * 250;

        const theta =
            Math.random() *
            Math.PI *
            2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );

        positions[i] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[i + 1] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        positions[i + 2] =
            radius *
            Math.cos(phi);
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.35,
            sizeAttenuation: true
        });


    const stars =
        new THREE.Points(
            geometry,
            material
        );

    solarScene.add(
        stars
    );
}


/* =========================================
   ANIMATION
========================================= */

function animateSolarSystem() {

    solarAnimationId =
        requestAnimationFrame(
            animateSolarSystem
        );


    /* Planet orbit */

    solarPlanets.forEach(
        function (item) {

            item.angle +=
                item.speed;

            item.planet.position.x =
                Math.cos(
                    item.angle
                ) *
                item.distance;

            item.planet.position.z =
                Math.sin(
                    item.angle
                ) *
                item.distance;


            /* Planet rotation */

            item.planet.rotation.y +=
                0.01;
        }
    );


    /* Whole system slow rotation */

    if (solarSystem) {

        solarSystem.rotation.y +=
            0.00025;
    }


    /* Camera */

    solarCamera.lookAt(
        0,
        0,
        0
    );


    /* Render */

    solarRenderer.render(
        solarScene,
        solarCamera
    );
}


/* =========================================
   RESIZE
========================================= */

function resizeSolarSystem() {

    if (
        !solarCamera ||
        !solarRenderer
    ) {
        return;
    }

    solarCamera.aspect =
        window.innerWidth /
        window.innerHeight;

    solarCamera.updateProjectionMatrix();

    solarRenderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeSolarSystemBackground();

    }
);