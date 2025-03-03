document.addEventListener('DOMContentLoaded', () => {
    // ====================
    // Loader Functionality
    // ====================
    const loaderOverlay = document.getElementById('loader-overlay');
    const mainContent = document.getElementById('main-content');

    function hideLoader() {
        loaderOverlay.classList.add('loader-fade-out');
        loaderOverlay.addEventListener('transitionend', function () {
            loaderOverlay.style.display = 'none';
            mainContent.classList.add('visible');
            document.body.style.overflow = 'auto';
            setTimeout(type, 500); // Start typing effect after a slight delay
        }, { once: true });
    }

    setTimeout(hideLoader, 1500);
    document.body.style.overflow = 'hidden';

    // ====================
    // Typing Effect
    // ====================
    const typingText = document.getElementById("typing-text");
    const texts = [
        "I am a Problem Solver.",
        "I am a Data Scientist.",
        "I am a Geospatial Developer."
    ];

    let currentIndex = 0;
    let charIndex = 0;
    let isErasing = false;
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const delayBetweenTexts = 1500;

    function type() {
        const currentText = texts[currentIndex];
        if (!isErasing) {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                isErasing = true;
                setTimeout(type, delayBetweenTexts);
            } else {
                setTimeout(type, typingSpeed);
            }
        } else {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isErasing = false;
                currentIndex = (currentIndex + 1) % texts.length;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(type, erasingSpeed);
            }
        }
    }

    // ====================
    // Top Navigation Visibility
    // ====================
    const topNav = document.getElementById('top-nav');
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 150) {
            topNav.classList.add('show');
        } else {
            topNav.classList.remove('show');
        }
    });

    // ====================
    // Modal Functionality
    // ====================
    const readMoreLinks = document.querySelectorAll('.read-more');
    const closeButtons = document.querySelectorAll('.close-button');

    readMoreLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                modal.setAttribute('tabindex', '-1');
                modal.focus();
            }
        });
    });

    closeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(function (modal) {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });

    // ====================
    // Animation Queue System with Reset
    // ====================
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-bottom');
    const animationQueue = [];
    let isProcessing = false;
    const queueDelay = 200; // Delay between each animation in milliseconds

    // Function to calculate visibility based on user-provided code
    function checkVisibility() {
        const navBar = document.getElementById('top-nav');
        const navHeight = navBar.offsetHeight; // Get the height of the navigation bar
        const windowHeight = window.innerHeight;

        // Check if the navigation bar is in its initial hidden state
        const isNavVisible = navBar.classList.contains('show');
        const additionalTopBuffer = isNavVisible ? navHeight : -150; // Add a 150px buffer when nav is hidden
        const windowTop = window.scrollY + additionalTopBuffer;
        const windowBottom = window.scrollY + windowHeight;

        animatedElements.forEach(item => {
            const rect = item.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementBottom = elementTop + rect.height;

            // Adjust visibility check to handle both cases
            const isVisible =
                (elementBottom > windowTop && elementTop < windowBottom);

            if (isVisible) {
                // If element is in view and not already visible or queued
                if (!item.classList.contains('visible') && !animationQueue.includes(item)) {
                    animationQueue.push(item);
                    if (!isProcessing) {
                        processQueue();
                    }
                }
            } else {
                // If element is out of view and currently visible, reset it
                if (item.classList.contains('visible')) {
                    item.classList.remove('visible');
                }
                // Remove from queue if it's there
                const index = animationQueue.indexOf(item);
                if (index > -1) {
                    animationQueue.splice(index, 1);
                }
            }
        });
    }

    // Function to process the animation queue
    function processQueue() {
        if (animationQueue.length === 0) {
            isProcessing = false;
            return;
        }
        isProcessing = true;
        const element = animationQueue.shift();
        element.classList.add('visible');
        setTimeout(() => {
            processQueue();
        }, queueDelay);
    }

    // Initial visibility check after a slight delay to ensure all elements are loaded
    setTimeout(checkVisibility, 1000);

    // Attach scroll and resize listeners
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);

    // ====================
    // Dynamic Image Scaling and Positioning for All Project Images Using Data Attributes
    // ====================

    // Define default scaling and positioning parameters
    const defaultScalingParams = {
        baseScale: 1.0,
        scaleFactorPerPx: 0.0015,
        minScale: 1.0,
        maxScale: 1.5
    };

    const defaultPositioningParams = {
        baseLeft: '5%', // Default base left position
        scaleFactorLeftPerPx: '-0.005%', // Default scale factor per pixel for left
        minLeft: '3%', // Default min left
        maxLeft: '7%', // Default max left
        baseTop: '-10%', // Default base top position
        scaleFactorTopPerPx: '0.002%', // Default scale factor per pixel for top
        minTop: '-12%', // Default min top
        maxTop: '-8%' // Default max top
    };

    // Function to adjust scaling and positioning for all project images
    function adjustAllProjectImagesScaleAndPosition() {
        const images = document.querySelectorAll('.project-image');
        const viewportWidth = window.innerWidth; // Current viewport width in pixels

        images.forEach(img => {
            // ====================
            // Scaling Adjustment
            // ====================
            // Retrieve scaling parameters from data attributes
            const baseScale = parseFloat(img.getAttribute('data-base-scale')) || defaultScalingParams.baseScale;
            const scaleFactorPerPx = parseFloat(img.getAttribute('data-scale-factor-per-px')) || defaultScalingParams.scaleFactorPerPx;
            const minScale = parseFloat(img.getAttribute('data-min-scale')) || defaultScalingParams.minScale;
            const maxScale = parseFloat(img.getAttribute('data-max-scale')) || defaultScalingParams.maxScale;

            let scale;
            if (viewportWidth <= 900) {
                const pixelsBelow900 = 900 - viewportWidth;
                scale = baseScale + (pixelsBelow900 * scaleFactorPerPx);
                // Clamp the scale between minScale and maxScale
                scale = Math.max(minScale, Math.min(scale, maxScale));
            } else {
                // Above 900px, maintain baseScale
                scale = baseScale;
            }

            // Apply the scale to the image
            img.style.transform = `scale(${scale})`;

            // ====================
            // Positioning Adjustment
            // ====================
            // Retrieve positioning parameters from data attributes
            const baseLeft = img.getAttribute('data-left-base') || defaultPositioningParams.baseLeft;
            const scaleFactorLeftPerPx = img.getAttribute('data-left-scale-per-px') || defaultPositioningParams.scaleFactorLeftPerPx;
            const minLeft = img.getAttribute('data-left-min') || defaultPositioningParams.minLeft;
            const maxLeft = img.getAttribute('data-left-max') || defaultPositioningParams.maxLeft;

            const baseTop = img.getAttribute('data-top-base') || defaultPositioningParams.baseTop;
            const scaleFactorTopPerPx = img.getAttribute('data-top-scale-per-px') || defaultPositioningParams.scaleFactorTopPerPx;
            const minTop = img.getAttribute('data-top-min') || defaultPositioningParams.minTop;
            const maxTop = img.getAttribute('data-top-max') || defaultPositioningParams.maxTop;

            let left, top;

            // Calculate new left position if viewportWidth <= 900px
            if (viewportWidth <= 900) {
                const pixelsBelow900 = 900 - viewportWidth;
                // Convert baseLeft and scaleFactorLeftPerPx from percentage to float
                const baseLeftValue = parseFloat(baseLeft.replace('%', ''));
                const scaleFactorLeftValue = parseFloat(scaleFactorLeftPerPx.replace('%', ''));
                left = baseLeftValue + (pixelsBelow900 * scaleFactorLeftValue);
                // Clamp the left position
                left = Math.max(parseFloat(minLeft.replace('%', '')), Math.min(left, parseFloat(maxLeft.replace('%', ''))));
                left = `${left}%`;
            } else {
                left = baseLeft;
            }

            // Calculate new top position if viewportWidth <= 900px
            if (viewportWidth <= 900) {
                const pixelsBelow900 = 900 - viewportWidth;
                // Convert baseTop and scaleFactorTopPerPx from percentage to float
                const baseTopValue = parseFloat(baseTop.replace('%', ''));
                const scaleFactorTopValue = parseFloat(scaleFactorTopPerPx.replace('%', ''));
                top = baseTopValue + (pixelsBelow900 * scaleFactorTopValue);
                // Clamp the top position
                top = Math.max(parseFloat(minTop.replace('%', '')), Math.min(top, parseFloat(maxTop.replace('%', ''))));
                top = `${top}%`;
            } else {
                top = baseTop;
            }

            // Apply the left and top positions to the image
            img.style.left = left;
            img.style.top = top;

            // ====================
            // Logging for Debugging
            // ====================
            // Determine the specific class for logging
            let specificClass = 'unknown';
            for (const cls of img.classList) {
                if (cls !== 'project-image') {
                    specificClass = cls;
                    break;
                }
            }

            // Log the current scale and positions to the console
            console.log(`Current scale for .${specificClass}: ${scale.toFixed(3)}`);
            console.log(`Current left for .${specificClass}: ${left}`);
            console.log(`Current top for .${specificClass}: ${top}`);
        });
    }

    // Initialize scaling and positioning on page load
    window.addEventListener('load', adjustAllProjectImagesScaleAndPosition);

    // Adjust scaling and positioning on window resize, with debounce for performance
    let resizeTimeoutAllImages;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeoutAllImages);
        resizeTimeoutAllImages = setTimeout(adjustAllProjectImagesScaleAndPosition, 100); // Adjust delay as needed
    });

    // Optionally, call adjustAllProjectImagesScaleAndPosition immediately
    adjustAllProjectImagesScaleAndPosition();
});
