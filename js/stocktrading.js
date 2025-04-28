// Stock Trading System for bhop.monster

let stockPosition = {
    active: false,
    shares: 0,
    entryPrice: 0,
    leverage: 2, // Default leverage
    investedAmount: 0
};

// Available leverage options
const LEVERAGE_OPTIONS = [1, 2, 5, 10, 25, 50, 100];
let currentLeverageIndex = 0;

// Available amount options
const AMOUNT_OPTIONS = [5, 10, 20, 50, 100, 500, 1000];
let currentAmountIndex = 1; // Start with 10 as default

// Initialize trading UI when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTradingUI();
});

function initTradingUI() {
    // Create trading panel elements if they don't exist
    if (!document.getElementById('trading-panel')) {
        createTradingPanel();
    }
    
    // Update trading UI with initial values
    updateTradingUI();
}

function createTradingPanel() {
    const tradingPanel = document.createElement('div');
    tradingPanel.id = 'trading-panel';
    tradingPanel.className = 'trading-panel';
    tradingPanel.innerHTML = `
        <style>
        .amount-control {
            display: flex;
            align-items: center;
            gap: 0px;
        }
        .trade-amount-display {
            font-family: 'MS Gothic', monospace;
            font-size: 1.2em;
            min-width: 80px;
            text-align: right;
        }
        .amount-buttons {
            display: flex;
            flex-direction: column;
        }
        </style>
        <div class="trading-header">
            <h3 class="ms-gothic-font-light">$FSIA</h3>
        </div>
        <div class="trading-controls">
            <div class="trading-info">
                <div class="info-row">
                    <div class="info-label">POSITION</div>
                    <span id="position-value" class="info-value">0〠</span>
                </div>
                <div class="info-row">
                    <div class="info-label">PROFIT/LOSS</div>
                    <span id="profit-loss" class="info-value">0〠</span>
                </div>
                <div class="info-row">
                    <div class="info-label">LEVERAGE</div>
                    <span id="leverage-value" class="info-value">2x</span>
                    <div class="leverage-buttons">
                        <div class="bet-button leverage-up" onmousedown="increaseLeverage()">▲</div>
                        <div class="bet-button leverage-down" onmousedown="decreaseLeverage()">▼</div>
                    </div>
                </div>
            </div>
            <div class="trading-actions">
                <div class="trade-amount">
                    <div class="info-label">AMOUNT</div>
                    <div class="amount-control">
                        <span id="trade-amount" class="trade-amount-display">10〠</span>
                        <div class="amount-buttons">
                            <div class="bet-button amount-up" onmousedown="increaseAmount()">▲</div>
                            <div class="bet-button amount-down" onmousedown="decreaseAmount()">▼</div>
                        </div>
                    </div>
                </div>
                <div class="trade-buttons">
                    <button id="buy-button" class="trade-button buy-button" onmousedown="buyStock()">BUY</button>
                    <button id="sell-button" class="trade-button sell-button" onclick="sellStock()" disabled>SELL</button>
                </div>
            </div>
        </div>
    `;
    
    // Insert trading panel after stock chart container
    const stockChartContainer = document.querySelector('.stock-chart-container');
    stockChartContainer.parentNode.insertBefore(tradingPanel, stockChartContainer.nextSibling);
    tradingPanel.style.marginTop = "80px";
}

function updateTradingUI() {
    // Update leverage display
    document.getElementById('leverage-value').textContent = LEVERAGE_OPTIONS[currentLeverageIndex] + 'x';
    
    // Update position status
    if (stockPosition.active) {
        // Calculate current position value and profit/loss
        const currentPrice = getCurrentStockPrice();
        const positionValue = calculatePositionValue(currentPrice);
        const profitLoss = positionValue - stockPosition.investedAmount;
        
        // Update UI elements
        document.getElementById('position-value').textContent = Math.round(positionValue) + '〠';
        
        const profitLossElement = document.getElementById('profit-loss');
        profitLossElement.textContent = (profitLoss >= 0 ? '+' : '') + Math.round(profitLoss) + '〠';
        profitLossElement.style.color = profitLoss >= 0 ? '#41ff41' : '#ff4141';
        
        // Enable sell button
        document.getElementById('sell-button').disabled = false;
    } else {
        // Reset UI for no position
        document.getElementById('position-value').textContent = '0〠';
        document.getElementById('profit-loss').textContent = '0〠';
        document.getElementById('profit-loss').style.color = '';
        
        // Disable sell button
        document.getElementById('sell-button').disabled = true;
    }
}

function increaseLeverage() {
    if (stockPosition.active) {
        // Use the error sound function from slotmachine.js
        window.playError ? window.playError() : console.error('Error sound function not available');
        return;
    }
    
    if (currentLeverageIndex < LEVERAGE_OPTIONS.length - 1) {
        currentLeverageIndex++;
        stockPosition.leverage = LEVERAGE_OPTIONS[currentLeverageIndex];
        // Play UI sound
        const clickSound = new Audio('audio/ui_click.mp3');
        clickSound.volume = 0.3;
        clickSound.play();
        updateTradingUI();
    } else {
        window.playError ? window.playError() : console.error('Error sound function not available');
    }
}

function decreaseLeverage() {
    if (stockPosition.active) {
        // Use the error sound function from slotmachine.js
        window.playError ? window.playError() : console.error('Error sound function not available');
        return;
    }
    
    if (currentLeverageIndex > 0) {
        currentLeverageIndex--;
        stockPosition.leverage = LEVERAGE_OPTIONS[currentLeverageIndex];
        // Play UI sound
        const clickSound = new Audio('audio/ui_click.mp3');
        clickSound.volume = 0.3;
        clickSound.play();
        updateTradingUI();
    } else {
        window.playError ? window.playError() : console.error('Error sound function not available');
    }
}

function buyStock() {
    if (stockPosition.active) {
        window.playError ? window.playError() : console.error('Error sound function not available');
        return;
    }
    
    // Get amount from current selection
    const amount = AMOUNT_OPTIONS[currentAmountIndex];
    
    // Check if user has enough balance
    if (amount > window.balance) {
        window.playError ? window.playError() : console.error('Error sound function not available');
        return;
    }
    
    // Get current stock price
    const currentPrice = getCurrentStockPrice();
    
    // Calculate shares based on amount (without leverage)
    const shares = amount / currentPrice;
    
    // Update balance using the function from slotmachine.js
    window.updateBalance ? window.updateBalance(-amount) : console.error('Update balance function not available');
    
    // Update stock position
    stockPosition.active = true;
    stockPosition.shares = shares;
    stockPosition.entryPrice = currentPrice;
    stockPosition.investedAmount = amount;
    
    // Play buy sound
    const buySound = new Audio('audio/ui_confirm.mp3');
    buySound.volume = 0.3;
    buySound.play();
    
    // Update UI
    updateTradingUI();
}

function sellStock() {
    if (!stockPosition.active) {
        window.playError ? window.playError() : console.error('Error sound function not available');
        return;
    }
    
    // Get current stock price
    const currentPrice = getCurrentStockPrice();
    
    // Calculate position value and profit/loss
    const positionValue = calculatePositionValue(currentPrice);
    
    // Update balance with position value using the function from slotmachine.js
    window.updateBalance ? window.updateBalance(positionValue) : console.error('Update balance function not available');
    
    // Play appropriate sound based on profit/loss
    const profitLoss = positionValue - stockPosition.investedAmount;
    if (profitLoss >= 0) {
        const winSound = new Audio('audio/ui_confirm.mp3');
        winSound.volume = 0.3;
        winSound.play();
    } else {
        const loseSound = new Audio('audio/ui_error.mp3');
        loseSound.volume = 0.3;
        loseSound.play();
    }
    
    // Reset position
    stockPosition.active = false;
    stockPosition.shares = 0;
    stockPosition.entryPrice = 0;
    stockPosition.investedAmount = 0;
    
    // Update UI
    updateTradingUI();
}

function calculatePositionValue(currentPrice) {
    const baseValue = stockPosition.shares * currentPrice;
    const profitLoss = baseValue - stockPosition.investedAmount;
    return stockPosition.investedAmount + (profitLoss * stockPosition.leverage);
}

function getCurrentStockPrice() {
    // Get the current price from the stock chart data
    // This function assumes the stock chart module exposes the latest price
    if (typeof chartData !== 'undefined' && chartData.length > 0) {
        return chartData[chartData.length - 1].close;
    }
    
    // Fallback to a default value if chart data is not available
    return 1000;
}

function increaseAmount() {
    if (stockPosition.active) {
        window.playError ? window.playError() : console.error('Error sound function not available');
        return;
    }
    
    if (currentAmountIndex < AMOUNT_OPTIONS.length - 1) {
        currentAmountIndex++;
        document.getElementById('trade-amount').textContent = AMOUNT_OPTIONS[currentAmountIndex] + '〠';
    } else {
        window.playError ? window.playError() : console.error('Error sound function not available');
    }
}

function decreaseAmount() {
    if (stockPosition.active) {
        window.playError ? window.playError() : console.error('Error sound function not available');
        return;
    }
    
    if (currentAmountIndex > 0) {
        currentAmountIndex--;
        document.getElementById('trade-amount').textContent = AMOUNT_OPTIONS[currentAmountIndex] + '〠';
    } else {
        window.playError ? window.playError() : console.error('Error sound function not available');
    }
}

// Update position value periodically
setInterval(() => {
    if (stockPosition.active) {
        updateTradingUI();
    }
}, 2000); // Update every 2 seconds to match chart updates