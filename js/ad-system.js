// List of ad videos with their settings
const adVideos = [
    { src: 'images/ad_vyarth.webm', maxWidth: 250, link: 'https://youtu.be/syNEvQdLmAk' },
    { src: 'images/ad_babelairlines.webm', maxWidth: 300, link: 'https://youtu.be/6GpWZhC8tKA?si=EkLa651yglCKHaY0' },
    { src: 'images/ad_artefacts.webm', maxWidth: 300, link: 'https://youtu.be/6wu0hzVyQFQ?si=hmVNQ_OOv7c6O_B2' },
    { src: 'images/ad_cygnetryl.webm', maxWidth: 600, link: 'https://youtu.be/0Y4avgkNLSw?si=lzgoSOrB6q0Q7gp9' },
    { src: 'images/ad_upgradeyogunz.webm', maxWidth: 250, link: 'https://youtu.be/Hp_wLg50lUo?si=Y781pl9n0fhzE2gO' },
    { src: 'images/ad_orgone.webm', maxWidth: 300, link: 'https://youtu.be/ekz0tf8chJE?si=wyrJ_dtrQqw8CMQw' },
    { src: 'images/ad_minerva.webm', maxWidth: 350, link: 'https://youtu.be/kI3UwBadZwM?si=fmoXBOnLm4hAZR4F' },
    { src: 'images/ad_exodus.webm', maxWidth: 330, link: 'https://youtu.be/fQZCCbB_zyM?si=Q40T_mO_gEKKOQn0' },
    { src: 'images/ad_templenight.webm', maxWidth: 330, link: 'https://youtu.be/khCTLdbMrZM?si=dXPz6epi4y0lpUsq' },
    { src: 'images/ad_responsibility.webm', maxWidth: 330, link: 'https://youtu.be/WQlLgkAIkiI?si=MN-SG-3cnMx3rFYf' },
    { src: 'images/ad_security.webm', maxWidth: 330, link: 'https://youtu.be/miF0FcaPfns?si=7e-bsD4tfyW1gCUf' },

];

// Function to get random position within viewport
function getRandomPosition() {
    const padding = 20; // Padding from viewport edges
    const rightMargin = 150; // Extra margin for right side to ensure close button accessibility
    const selectedAd = adVideos[Math.floor(Math.random() * adVideos.length)];
    const maxWidth = window.innerWidth - selectedAd.maxWidth - padding - rightMargin;
    const maxHeight = window.innerHeight - 200 - padding;
    
    return {
        x: Math.max(padding, Math.floor(Math.random() * maxWidth)),
        y: Math.max(padding, Math.floor(Math.random() * maxHeight))
    };
}

// Function to create and show ad
function createAd() {
    // Create container
    const adContainer = document.createElement('div');
    adContainer.className = 'ad-container';
    const pos = getRandomPosition();
    adContainer.style.left = pos.x + 'px';
    adContainer.style.top = pos.y + 'px';

    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'ad-close-button';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => adContainer.remove();


    // Get random ad with its specific link
    const selectedAd = adVideos[Math.floor(Math.random() * adVideos.length)];
    

    // Create link with selected ad's specific URL
    const link = document.createElement('a');
    link.href = selectedAd.link;
    link.target = '_blank';
    link.onclick = () => {
        setTimeout(() => adContainer.remove(), 100); // Small delay to ensure link opens before removal
    };
    
    // Create video element
    const video = document.createElement('video');
    video.autoplay = true;
    video.loop = true;
    video.src = selectedAd.src;
    video.style.maxWidth = selectedAd.maxWidth + 'px';
    video.style.cursor = 'none';

    // Append elements
    adContainer.appendChild(closeButton);
    link.appendChild(video);
    adContainer.appendChild(link);
    document.body.appendChild(adContainer);
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .ad-container {
        position: fixed;
        z-index: 9999;
        background: transparent;
        border-radius: 0px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .ad-close-button {
        position: absolute;
        top: 5px;
        right: 5px;
        font-family: '宋体';
        width: 24px;
        height: 18px;
        background: white;
        border: none;
        color: black;
        font-size: 12px;
        line-height: 1;
        cursor: none;
        z-index: 10000;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ad-close-button:hover {
        background: #f0f0f0;
    }

    .ad-container video {
        display: block;
    }
`;
document.head.appendChild(style);

// Start showing ads every 20 seconds
setInterval(createAd, 20000);
