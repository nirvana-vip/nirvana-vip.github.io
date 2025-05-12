


var icons = [
    'diamond', 'diamond', 
    'diamond', 'diamond', 
    'diamond', 'diamond', 
    'diamond', 'diamond', 
    'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold',
    'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold',
    'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold',
    'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold', 'gold',
    'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 
    'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 
    'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 
    'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 
    'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 
    'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 
    'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 
    'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 
    'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 
    'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 
    'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 
    'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 
    'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 
    'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 
    'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 
    'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 'bronze', 
    'box', 'box', 'box', 'box', 
    'luckybox', 

];

var slots;
var cols;

// Cookie functions for balance persistence
function saveBalanceToCookie() {
    document.cookie = `balance=${balance};path=/;max-age=31536000;SameSite=Lax`; // Store for 1 year
}

function getBalanceFromCookie() {
    const match = document.cookie.match(/balance=([^;]+)/);
    return match ? parseInt(match[1]) : 45; // Default to 45 if no cookie found
}

// Initialize balance from cookie
let balance = getBalanceFromCookie();
updateBalance(0); // show right balance when page loads

// Save balance when page is closed/refreshed
window.addEventListener('beforeunload', saveBalanceToCookie);

// passive income (1 credit every 20 seconds)
setInterval(() => {
    updateBalance(1);
    saveBalanceToCookie(); // Save after each update
}, 20000);

function updateLastWin(amount) {
    const el = document.getElementById('last-win');
    el.textContent = amount + '〠';
}

function updateBalance(amount) {
    const el = document.getElementById('balance');
    const from = balance;
    balance += amount;
    const start = performance.now();
    
    (function animate() {
        const progress = Math.min(1, (performance.now() - start) / 120);
        el.textContent = Math.round(from + (amount * progress)) + '〠';
        progress < 1 && requestAnimationFrame(animate);
    })();
}

// Make updateBalance and balance available globally
window.updateBalance = updateBalance;
Object.defineProperty(window, 'balance', {
    get: function() { return balance; }
});

// media list with scale and position { src: 'images/beheading.webm', size: '1050px', x: '50%', y: '50%' },
const media = {
    lose: [
        
        { src: 'images/hellistic33.webm', size: '2050px', x: '50%', y: '30%'},
        { src: 'images/beheading.webm', size: '1050px', x: '50%', y: '40%' },
    ],
    win: [
        { src: 'images/jackpot1.gif', size: '15%', x: '40%', y: '75%', duration: 2000 },
        { src: 'images/jackpot2.gif', size: '35%', x: '25%', y: '55%', duration: 3000 },
        { src: 'images/ladybug.gif', size: '95%', x: '70%', y: '75%', duration: 3000 },
        { src: 'images/ladybug.gif', size: '35%', x: '60%', y: '35%', duration: 3000 },
        { src: 'images/doggy.gif', size: '35%', x: '80%', y: '55%', duration: 2500 },
    ],
    spin: [
        //{ src: 'images/good_luck.gif', size: '25%', x: '30%', y: '45%', duration: 1200 },
       // { src: 'images/luckyYoutest.gif', size: '25%', x: '75%', y: '35%', duration: 4000 },

    ],
    silverBonus1: [
        { src: 'images/silverbonus1.webm', size: '700px', x: '50%', y: '40%' }
    ],
    silverBonus2: [
        { src: 'images/silverbonus2.webm', size: '1300px', x: '50%', y: '40%' }
    ],
    silverBonus3: [
        { src: 'images/silverbonus3.webm', size: '1300px', x: '50%', y: '50%' }
    ]
};


// bet levels and multipliers
const BET_LEVELS = {
    5: 1,    // 5 = 1x
    10: 2,   // 10 = 2x
    15: 3,   // 15 = 3x
    20: 5,   // 20 = 5x
    50: 10,  // 50 = 10x
    100: 20, // 100 = 20x
    500: 50  // 500 = 50x
};
let currentBet = 5;
let betLocked = false;

// error sound function - exposed globally for other modules
function playError() {
    const errorSound = new Audio('audio/ui_error.mp3');
    errorSound.volume = 0.3;
    errorSound.play();
}

// Make playError available globally
window.playError = playError;

// increase bet function
function increaseBet() {
    if (betLocked) {
        playError();
        return;
    }
    const bets = Object.keys(BET_LEVELS).map(Number);
    const currentIndex = bets.indexOf(currentBet);
    if (currentIndex < bets.length - 1) {
        const nextBet = bets[currentIndex + 1];
        if (nextBet <= balance) {
            currentBet = nextBet;
            updateBetDisplay();
        } else {
            playError();
        }
    }
}

// decrease bet function
function decreaseBet() {
    if (betLocked) {
        playError();
        return;
    }
    const bets = Object.keys(BET_LEVELS).map(Number);
    const currentIndex = bets.indexOf(currentBet);
    if (currentIndex > 0) {
        currentBet = bets[currentIndex - 1];
        updateBetDisplay();
    } else {
        playError(); // Play error sound if trying to go below minimum bet
    }
}

// update bet display function
function updateBetDisplay() {
    document.getElementById('current-bet').textContent = currentBet + '〠';
}

// slot machine setup
window.addEventListener('DOMContentLoaded', function(event) {
    slots = document.querySelector('.slot-container');
    cols = document.querySelectorAll('.col');

    let i = 0;
    for (let col of cols) {
        let str = '';
        let firstThree = '';
        for (let x = 0; x < 40 + (i * 3); x++) {
            let icon = icons[Math.floor(Math.random() * icons.length)];
            let part = '<div class="icon" data-item="' + icon + '"><img src="images/' + icon + '.png"></div>';
            str += part
            if (x < 3) firstThree += part;
        }
        col.innerHTML = str + firstThree;

        ++i;
    }

    document.querySelector('.start-button').focus();
});

/**
 * @param elem The button itself
 */
// Global variable to track if spin is in progress
let isSpinning = false;

// Add keyboard event listener for spacebar
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isSpinning) {
        event.preventDefault(); // Prevent page scrolling
        const startButton = document.querySelector('.start-button');
        if (startButton) {
            spin(startButton);
        }
    }
});

function spin(elem) {
    if (elem.hasAttribute('disabled') || isSpinning) {
        playError();
        return;
    }
    if (balance < currentBet) {
        playError();
        return;
    }
    
    updateBalance(-currentBet);
    saveBalanceToCookie(); // Save balance after bet
    
    // Play slot machine sound and show spin video
    const spinSound = new Audio('audio/slotmachine_mainsfx2.mp3');
    spinSound.volume = 1;
    spinSound.play();
    
    playRandomVideo('spin');
    
    let baseDuration = 2.7 + randomDuration();
    let incrementingEachStep = 0.35;
    let totalDuration = baseDuration;

    // bg shake for each column stop
    cols.forEach((col, index) => {
        baseDuration += incrementingEachStep + randomDuration();
        col.style.animationDuration = baseDuration + "s";
        totalDuration = baseDuration;

        // delayed shake for each column
        setTimeout(() => {
            backgroundShake.shake();
        }, (baseDuration - 0.1) * 1000);
    });

    elem.setAttribute('disabled', '');
    elem.style.pointerEvents = 'none';
    elem.style.opacity = '0.5';
    
    isSpinning = true;
    slots.classList.toggle('spinning', true);
    window.setTimeout(setResult, 1500);

    window.setTimeout(function () {
        slots.classList.toggle('spinning', false);
        elem.removeAttribute('disabled');
        elem.style.pointerEvents = '';
        isSpinning = false;
        elem.style.opacity = '';
        elem.focus();
        checkJackpot();
    }.bind(elem), (totalDuration + 0.01) * 1000);

    betLocked = true;
    setTimeout(() => betLocked = false, 5000);
}

/**
 * Sets the result items at the beginning and the end of the columns
 */
function setResult() {
    for (let col of cols) {
        let results = [
            icons[Math.floor(Math.random() * icons.length)],
            icons[Math.floor(Math.random() * icons.length)],
            icons[Math.floor(Math.random() * icons.length)]
        ];
        let icon = col.querySelectorAll('.icon img');
        // Always set PNG initially
        for (let x = 0; x < 3; x++) {
            icon[x].setAttribute('src', 'images/' + results[x] + '.png');
            icon[(icon.length - 3) + x].setAttribute('src', 'images/' + results[x] + '.png');
        }
    }
}

function playRandomVideo(type) {
    const mediaList = media[type];
    if (!mediaList || mediaList.length === 0) return;
    
    const randomMedia = mediaList[Math.floor(Math.random() * mediaList.length)];
    const isVideo = randomMedia.src.endsWith('.webm');
    
    const element = document.createElement(isVideo ? 'video' : 'img');
    element.src = randomMedia.src;
    element.style.cssText = `
        position: fixed;
        left: ${randomMedia.x};
        top: ${randomMedia.y};
        transform: translate(-50%, -50%);
        width: ${randomMedia.size};
        height: auto;
        z-index: 99;
        pointer-events: none;
    `;

    if (isVideo) {
        element.autoplay = true;
        element.muted = false;
        element.volume = 0.5;
        element.onended = () => element.remove();
    } else {
        // For GIFs and WebPs, remove after duration
        setTimeout(() => {
            element.remove();
        }, randomMedia.duration);
    }

    document.body.appendChild(element);
}

function checkJackpot() {
    let allRows = [[], [], []];
    let allVisibleIcons = [];
    let hasJackpot = false;
    let hasGoldBonus = false;
    let hasSilverBonus = false;
    let totalWin = 0;
    
    // Get all visible icons and separate into rows
    cols.forEach(col => {
        let icons = col.querySelectorAll('.icon img');
        for (let i = 0; i < 3; i++) {
            let iconSrc = icons[i].getAttribute('src');
            let iconName = iconSrc.split('/').pop().split('.')[0];
            allRows[i].push(iconName);
            allVisibleIcons.push(iconName);
        }
    });

    const diamondCount = allVisibleIcons.filter(icon => icon === 'diamond').length;
    const silverCount = allVisibleIcons.filter(icon => icon === 'silver').length;

    // Check jackpots
    allRows.forEach(row => {
        if (row.every(icon => icon === row[0])) {
            const winAmount = {
                'diamond': 1000,
                'gold': 500,
                'silver': 250,
                'bronze': 100
            }[row[0]] || 0;
            
            if (winAmount > 0) {
                hasJackpot = true;
                totalWin += winAmount * BET_LEVELS[currentBet];
            }
        }
    });

    // Check gold bonus
    allRows.forEach(row => {
        for (let i = 0; i <= row.length - 3; i++) {
            if (row[i] === 'gold' && row[i+1] === 'gold' && row[i+2] === 'gold') {
                hasGoldBonus = true;
                totalWin += currentBet * 2;
                break;
            }
        }
    });

    /* 1$ per gold idk about this
    const goldCount = allVisibleIcons.filter(icon => icon === 'gold').length;
    if (goldCount > 0) {
        totalWin += goldCount * BET_LEVELS[currentBet];
    }
     */
    
    // Check silver bonus
    if (diamondCount > 0 && silverCount > 0) {
        hasSilverBonus = true;
        let bonus = silverCount;
        let videoType;
        
        if (diamondCount >= 3) {
            bonus *= 3;
            videoType = 'silverBonus3';
        } else if (diamondCount === 2) {
            bonus *= 2;
            videoType = 'silverBonus2';
        } else {
            videoType = 'silverBonus1';
        }
        
        totalWin += bonus * BET_LEVELS[currentBet];
        playRandomVideo(videoType);
        
        // Convert silver PNGs to GIFs when bonus hits
        document.querySelectorAll('.icon img[src*="silver.png"]').forEach(icon => {
            icon.setAttribute('src', 'images/silver.gif');
        });
        
        const silverSound = new Audio('audio/bonuswin1.mp3');
        silverSound.volume = 0.3;
        silverSound.play();
    }

    // Play appropriate sounds based on win types
    if (totalWin > 0) {
        saveBalanceToCookie(); // Save balance after win
        if (hasJackpot) {
            const jackpotSound = new Audio('audio/jackpot5.mp3');
            jackpotSound.volume = 0.3;
            jackpotSound.play();
        }
        if (hasGoldBonus) {
            const goldSound = new Audio('audio/jackpot3.mp3');
            goldSound.volume = 0.3;
            goldSound.play();
        }
        if (hasSilverBonus) {
            const silverSound = new Audio('audio/bonuswin1.mp3');
            silverSound.volume = 0.3;
            silverSound.play();
        }

        // Show win animation
        const winText = document.createElement('div');
        winText.style.cssText = `
            position: fixed;
            left: 50%;
            top: 45%;
            transform: translate(-50%, -50%);
            color: #ffd700;
            font-size: 48px;
            font-weight: bold;
            text-shadow: 0 0 10px #000;
            z-index: 99999;
        `;
        document.body.appendChild(winText);
        
        const start = performance.now();
        
        (function animate() {
            const progress = Math.min(1, (performance.now() - start) / 3000);
            winText.textContent = `WIN: ${Math.round(totalWin * progress)}〠`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    winText.remove();
                    updateBalance(totalWin);
                    updateLastWin(totalWin);
                }, 500);
            }
        })();

        playRandomVideo('win');
    } else {
        playRandomVideo('lose');
    }
}

/**
 * @returns {number} 0.00 to 0.09 inclusive
 */
function randomDuration() {
    return Math.floor(Math.random() * 10) / 100;
}
