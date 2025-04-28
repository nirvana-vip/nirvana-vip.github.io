/**
 * Circular Text Animation
 * This script positions text elements in a perfect circle and animates them
 * to rotate around the center point while keeping the text upright.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        radius: 40,           // Distance from center in pixels
        rotationSpeed: 5,     // Seconds for a full rotation
        container: document.querySelector('.rotating-text-container'),
        elements: document.querySelectorAll('.text-element')
    };

    // Get the center point of the container
    const containerRect = config.container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2 + 50;

    // Set initial positions for the elements
    // Position elements evenly around the circle
    config.elements.forEach((element, index) => {
        // Calculate the angle for this element (in radians)
        const angleOffset = (2 * Math.PI / config.elements.length) * index;
        positionElement(element, angleOffset);
    });

    // Animation function
    let startTime = null;
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        
        // Calculate elapsed time and convert to rotation progress (0 to 2π)
        const elapsed = timestamp - startTime;
        const rotationProgress = (elapsed % (config.rotationSpeed * 1000)) / (config.rotationSpeed * 1000) * (2 * Math.PI);
        
        // Update position of each element
        config.elements.forEach((element, index) => {
            // Calculate the base angle for this element (in radians)
            const baseAngle = (2 * Math.PI / config.elements.length) * index;
            // Add the rotation progress to get the current angle
            const currentAngle = baseAngle + rotationProgress;
            
            positionElement(element, currentAngle);
        });
        
        // Continue animation
        requestAnimationFrame(animate);
    }

    // Function to position an element at a specific angle around the circle
    function positionElement(element, angle) {
        // Calculate x and y coordinates on the circle
        const x = centerX + Math.sin(angle) * config.radius;
        const y = centerY - Math.cos(angle) * config.radius;
        
        // Position the element
        // Subtract half the element's width and height to center it at the calculated point
        const elementRect = element.getBoundingClientRect();
        
        // Apply the transformation
        // 1. Translate to the calculated position
        // 2. Translate by -50% to center the element on that point
        element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }

    // Start the animation
    requestAnimationFrame(animate);
});