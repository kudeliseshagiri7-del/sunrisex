/* =========================================
   SUNRISEX
   UI.JS
   User Interface + Navigation
========================================= */


/* =========================================
   GET ELEMENT
========================================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================================
   SMOOTH SCROLL
========================================= */

function scrollToSection(sectionId) {

    const section =
        document.getElementById(sectionId);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
}


/* =========================================
   START EXPLORING BUTTON
========================================= */

function setupExploreButton() {

    const button =
        getElement("startExploringBtn");

    if (button) {

        button.addEventListener(
            "click",
            function () {

                scrollToSection(
                    "explore"
                );

            }
        );

    }
}


/* =========================================
   LEARN SCIENCE BUTTON
========================================= */

function setupScienceButton() {

    const button =
        getElement("learnScienceBtn");

    if (button) {

        button.addEventListener(
            "click",
            function () {

                scrollToSection(
                    "science"
                );

            }
        );

    }
}


/* =========================================
   NAVIGATION LINKS
========================================= */

function setupNavigation() {

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );

    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const href =
                    link.getAttribute("href");

                if (
                    href &&
                    href.startsWith("#")
                ) {

                    event.preventDefault();

                    const targetId =
                        href.substring(1);

                    scrollToSection(
                        targetId
                    );

                }

            }
        );

    });
}


/* =========================================
   MOBILE MENU
========================================= */

function setupMobileMenu() {

    const menuButton =
        getElement("menuBtn");

    const nav =
        document.querySelector(
            ".nav-links"
        );


    if (!menuButton || !nav) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            nav.classList.toggle(
                "mobile-active"
            );

        }
    );


    /* Close menu after clicking */

    const links =
        nav.querySelectorAll("a");

    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                nav.classList.remove(
                    "mobile-active"
                );

            }
        );

    });
}


/* =========================================
   LIVE CLOCK
========================================= */

function updateLiveClock() {

    const clock =
        getElement("localTime");

    if (!clock) {
        return;
    }


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    clock.textContent = time;
}


/* =========================================
   START CLOCK
========================================= */

function startLiveClock() {

    updateLiveClock();

    setInterval(
        updateLiveClock,
        1000
    );
}


/* =========================================
   ACTIVE NAVIGATION
========================================= */

function setupActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const links =
        document.querySelectorAll(
            ".nav-links a"
        );


    window.addEventListener(
        "scroll",
        function () {

            let currentSection = "";


            sections.forEach(
                function (section) {

                    const sectionTop =
                        section.offsetTop;

                    if (
                        window.scrollY >=
                        sectionTop - 200
                    ) {

                        currentSection =
                            section.getAttribute(
                                "id"
                            );

                    }

                }
            );


            links.forEach(
                function (link) {

                    link.classList.remove(
                        "active"
                    );

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        href ===
                        "#" + currentSection
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );
}


/* =========================================
   CURRENT YEAR
========================================= */

function setCurrentYear() {

    const yearElement =
        getElement("currentYear");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }
}


/* =========================================
   FADE-IN ANIMATION
========================================= */

function setupScrollAnimation() {

    const elements =
        document.querySelectorAll(
            ".fade-in"
        );


    if (!("IntersectionObserver" in window)) {
        return;
    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    elements.forEach(
        function (element) {

            observer.observe(element);

        }
    );
}


/* =========================================
   UPDATE PAGE TITLE
========================================= */

function updatePageTitle() {

    document.title =
        "SunRiseX | The Science Behind Sunrise & Sunset";

}


/* =========================================
   INITIALIZE UI
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupExploreButton();

        setupScienceButton();

        setupNavigation();

        setupMobileMenu();

        setupActiveNavigation();

        setupScrollAnimation();

        startLiveClock();

        setCurrentYear();

        updatePageTitle();

        console.log(
            "SunRiseX UI module loaded successfully."
        );

    }
);