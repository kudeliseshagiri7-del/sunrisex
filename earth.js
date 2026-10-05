/* =========================================
   SUNRISEX
   EARTH.JS
   Realistic 3D Earth Simulator
========================================= */


/* =========================================
   THREE.JS VARIABLES
========================================= */

let earthScene;
let earthCamera;
let earthRenderer;

let earthMesh;
let atmosphereMesh;
let sunMesh;
let starField;

let earthAnimationId;

let isEarthRotating = true;


/* =========================================
   INITIALIZE EARTH
========================================= */

function initializeEarth() {

    const container =
        document.getElementById("earthContainer");

    if (!container) {
        console.error("Earth container not found.");
        return;
    }

    /* -----------------------------------------
       SCENE
    ----------------------------------------- */

    earthScene = new THREE.Scene();

    earthScene.background =
        new THREE.Color(0x020617);


    /* -----------------------------------------
       CAMERA
    ----------------------------------------- */

    earthCamera =
        new THREE.PerspectiveCamera(
            45,
            container.clientWidth /
            container.clientHeight,
            0.1,
            1000
        );

    earthCamera.position.set(
        0,
        0.5,
        5.5
    );


    /* -----------------------------------------
       RENDERER
    ----------------------------------------- */

    earthRenderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    earthRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    earthRenderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    earthRenderer.outputEncoding =
        THREE.sRGBEncoding;

    container.appendChild(
        earthRenderer.domElement
    );


    /* -----------------------------------------
       AMBIENT LIGHT
    ----------------------------------------- */

    const ambientLight =
        new THREE.AmbientLight(
            0x222222,
            0.25
        );

    earthScene.add(
        ambientLight
    );


    /* -----------------------------------------
       SUN LIGHT
    ----------------------------------------- */

    const sunLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.8
        );

    sunLight.position.set(
        5,
        2,
        5
    );

    earthScene.add(
        sunLight
    );


    /* -----------------------------------------
       CREATE REAL EARTH
    ----------------------------------------- */

    createEarth();


    /* -----------------------------------------
       ATMOSPHERE
    ----------------------------------------- */

    createAtmosphere();


    /* -----------------------------------------
       SUN
    ----------------------------------------- */

    createSun();


    /* -----------------------------------------
       STARS
    ----------------------------------------- */

    createStars();


    /* -----------------------------------------
       LOCATION MARKER
    ----------------------------------------- */

    createLocationMarker();


    /* -----------------------------------------
       HIDE LOADING
    ----------------------------------------- */

    const loading =
        document.getElementById(
            "earthLoading"
        );

    if (loading) {
        loading.classList.add("hidden");
    }


    /* -----------------------------------------
       START RENDERING
    ----------------------------------------- */

    animateEarth();


    /* -----------------------------------------
       RESIZE
    ----------------------------------------- */

    window.addEventListener(
        "resize",
        resizeEarth
    );


    console.log(
        "Realistic 3D Earth initialized."
    );
}


/* =========================================
   CREATE REALISTIC EARTH
========================================= */

function createEarth() {

    const geometry =
        new THREE.SphereGeometry(
            1.5,
            64,
            64
        );


    /* -----------------------------------------
       TEXTURE LOADER
    ----------------------------------------- */

    const textureLoader =
        new THREE.TextureLoader();


    /* -----------------------------------------
       REAL EARTH TEXTURE
    ----------------------------------------- */

    const earthTexture =
        textureLoader.load(

            "https://threejs.org/examples/" +
            "textures/planets/earth_atmos_2048.jpg",

            function () {

                console.log(
                    "Earth texture loaded."
                );

            },

            undefined,

            function (error) {

                console.error(
                    "Earth texture failed:",
                    error
                );

            }
        );


    /* -----------------------------------------
       EARTH MATERIAL
    ----------------------------------------- */

    const earthMaterial =
        new THREE.MeshPhongMaterial({

            map: earthTexture,

            shininess: 12,

            specular:
                new THREE.Color(
                    0x222222
                )

        });


    /* -----------------------------------------
       EARTH MESH
    ----------------------------------------- */

    earthMesh =
        new THREE.Mesh(
            geometry,
            earthMaterial
        );


    earthScene.add(
        earthMesh
    );


    /* -----------------------------------------
       CLOUD LAYER
    ----------------------------------------- */

    const cloudGeometry =
        new THREE.SphereGeometry(
            1.515,
            64,
            64
        );


    const cloudTexture =
        textureLoader.load(

            "https://threejs.org/examples/" +
            "textures/planets/earth_clouds_1024.png",

            function () {

                console.log(
                    "Cloud texture loaded."
                );

            },

            undefined,

            function (error) {

                console.error(
                    "Cloud texture failed:",
                    error
                );

            }
        );


    const cloudMaterial =
        new THREE.MeshPhongMaterial({

            map: cloudTexture,

            transparent: true,

            opacity: 0.75,

            depthWrite: false

        });


    const clouds =
        new THREE.Mesh(
            cloudGeometry,
            cloudMaterial
        );


    clouds.name =
        "earthClouds";


    earthMesh.add(
        clouds
    );
}


/* =========================================
   ATMOSPHERE
========================================= */

function createAtmosphere() {

    const geometry =
        new THREE.SphereGeometry(
            1.58,
            64,
            64
        );


    const material =
        new THREE.MeshBasicMaterial({

            color: 0x4da6ff,

            transparent: true,

            opacity: 0.18,

            side: THREE.BackSide

        });


    atmosphereMesh =
        new THREE.Mesh(
            geometry,
            material
        );


    earthScene.add(
        atmosphereMesh
    );
}


/* =========================================
   CREATE SUN
========================================= */

function createSun() {

    const geometry =
        new THREE.SphereGeometry(
            0.45,
            32,
            32
        );


    const material =
        new THREE.MeshBasicMaterial({
            color: 0xffcc33
        });


    sunMesh =
        new THREE.Mesh(
            geometry,
            material
        );


    sunMesh.position.set(
        4.5,
        1.5,
        3
    );


    earthScene.add(
        sunMesh
    );


    /* -----------------------------------------
       SUN GLOW
    ----------------------------------------- */

    const glowGeometry =
        new THREE.SphereGeometry(
            0.7,
            32,
            32
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0xffaa00,

            transparent: true,

            opacity: 0.15

        });


    const sunGlow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    sunMesh.add(
        sunGlow
    );
}


/* =========================================
   CREATE STARS
========================================= */

function createStars() {

    const starGeometry =
        new THREE.BufferGeometry();


    const starCount = 2500;


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
            25 +
            Math.random() * 35;


        const theta =
            Math.random() *
            Math.PI * 2;


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


    starGeometry.setAttribute(
        "position",

        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const starMaterial =
        new THREE.PointsMaterial({

            color: 0xffffff,

            size: 0.06,

            sizeAttenuation: true

        });


    starField =
        new THREE.Points(
            starGeometry,
            starMaterial
        );


    earthScene.add(
        starField
    );
}


/* =========================================
   LOCATION MARKER
========================================= */

function createLocationMarker() {

    if (!earthMesh) {
        return;
    }


    const markerGeometry =
        new THREE.SphereGeometry(
            0.07,
            16,
            16
        );


    const markerMaterial =
        new THREE.MeshBasicMaterial({

            color: 0xff3333

        });


    const marker =
        new THREE.Mesh(
            markerGeometry,
            markerMaterial
        );


    marker.position.set(
        0.8,
        0.5,
        1.25
    );


    marker.name =
        "locationMarker";


    earthMesh.add(
        marker
    );
}


/* =========================================
   UPDATE LOCATION MARKER
========================================= */

function updateEarthLocationMarker(
    latitude,
    longitude
) {

    if (!earthMesh) {
        return;
    }


    const marker =
        earthMesh.getObjectByName(
            "locationMarker"
        );


    if (!marker) {
        return;
    }


    const lat =
        THREE.MathUtils.degToRad(
            latitude
        );


    const lon =
        THREE.MathUtils.degToRad(
            longitude
        );


    const radius = 1.55;


    marker.position.x =
        radius *
        Math.cos(lat) *
        Math.sin(lon);


    marker.position.y =
        radius *
        Math.sin(lat);


    marker.position.z =
        radius *
        Math.cos(lat) *
        Math.cos(lon);
}


/* =========================================
   EARTH ANIMATION
========================================= */

function animateEarth() {

    earthAnimationId =
        requestAnimationFrame(
            animateEarth
        );


    /* -----------------------------------------
       EARTH ROTATION
    ----------------------------------------- */

    if (
        earthMesh &&
        isEarthRotating
    ) {

        earthMesh.rotation.y +=
            0.002;

    }


    /* -----------------------------------------
       CLOUD ROTATION
    ----------------------------------------- */

    if (
        earthMesh &&
        isEarthRotating
    ) {

        const clouds =
            earthMesh.getObjectByName(
                "earthClouds"
            );


        if (clouds) {

            clouds.rotation.y +=
                0.0022;

        }

    }


    /* -----------------------------------------
       ATMOSPHERE
    ----------------------------------------- */

    if (
        atmosphereMesh &&
        isEarthRotating
    ) {

        atmosphereMesh.rotation.y +=
            0.0015;

    }


    /* -----------------------------------------
       STARS
    ----------------------------------------- */

    if (starField) {

        starField.rotation.y +=
            0.0001;

    }


    /* -----------------------------------------
       RENDER
    ----------------------------------------- */

    if (
        earthRenderer &&
        earthScene &&
        earthCamera
    ) {

        earthRenderer.render(
            earthScene,
            earthCamera
        );

    }
}


/* =========================================
   START EARTH ROTATION
========================================= */

function startEarthRotation() {

    isEarthRotating = true;

    updateSimulationStatus(
        "Earth rotating"
    );
}


/* =========================================
   PAUSE EARTH ROTATION
========================================= */

function pauseEarthRotation() {

    isEarthRotating = false;

    updateSimulationStatus(
        "Earth rotation paused"
    );
}


/* =========================================
   RESET EARTH
========================================= */

function resetEarthRotation() {

    if (earthMesh) {

        earthMesh.rotation.set(
            0,
            0,
            0
        );

    }


    if (atmosphereMesh) {

        atmosphereMesh.rotation.set(
            0,
            0,
            0
        );

    }


    updateSimulationStatus(
        "Earth reset"
    );
}


/* =========================================
   SIMULATION STATUS
========================================= */

function updateSimulationStatus(
    message
) {

    const element =
        document.getElementById(
            "simulationStatus"
        );


    if (element) {

        element.textContent =
            message;

    }
}


/* =========================================
   RESIZE
========================================= */

function resizeEarth() {

    const container =
        document.getElementById(
            "earthContainer"
        );


    if (
        !container ||
        !earthCamera ||
        !earthRenderer
    ) {

        return;

    }


    earthCamera.aspect =
        container.clientWidth /
        container.clientHeight;


    earthCamera.updateProjectionMatrix();


    earthRenderer.setSize(
        container.clientWidth,
        container.clientHeight
    );
}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeEarth();

        console.log(
            "SunRiseX Earth module loaded."
        );

    }
);