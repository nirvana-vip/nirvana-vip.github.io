// Fake Japanese candlestick chart for $FSIA stock

// Make chartData globally accessible for the trading system
let chartData = [];

document.addEventListener('DOMContentLoaded', function() {
    initStockChart();
});

function initStockChart() {
    const canvas = document.getElementById('stockChart');
    if (!canvas) return;
    
    // Set canvas display size to match CSS size
    const displayWidth = 800;
    const displayHeight = 400;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    
    // Set actual buffer size to match display size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    // Disable image smoothing for crisp rendering
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    chartData = generateChartData();
    let movingAverage = calculateMovingAverage(chartData, 5);
    
    // Initial render
    renderChart(ctx, chartData, movingAverage);
    
    // Update chart periodically
    setInterval(() => {
        // Add new data point
        const lastPrice = chartData[chartData.length - 1].close;
        const newPoint = generateNewDataPoint(lastPrice);
        chartData.push(newPoint);
        
        // Remove oldest data point to keep chart size consistent
        if (chartData.length > 100) {
            chartData.shift();
        }
        
        // Recalculate moving average
        movingAverage = calculateMovingAverage(chartData, 5);
        
        // Re-render chart
        renderChart(ctx, chartData, movingAverage);
    }, 2000); // Update every 2 seconds
}

function generateChartData() {
    const data = [];
    let price = 1000 + Math.random() * 500; // Starting price between 1000-1500 ¥
    
    // Generate initial 100 data points
    for (let i = 0; i < 100; i++) {
        const open = price;
        // Random price movement with slight upward bias
        const change = (Math.random() - 0.48) * 30;
        price += change;
        price = Math.max(price, 100); // Prevent price from going too low
        
        const close = price;
        const high = Math.max(open, close) + Math.random() * 10;
        const low = Math.min(open, close) - Math.random() * 10;
        
        data.push({
            open,
            close,
            high,
            low
        });
    }
    
    return data;
}

function generateNewDataPoint(lastPrice) {
    const open = lastPrice;
    // Random price movement with slight upward bias
    const change = (Math.random() - 0.48) * 30;
    let close = open + change;
    close = Math.max(close, 100); // Prevent price from going too low
    
    const high = Math.max(open, close) + Math.random() * 10;
    const low = Math.min(open, close) - Math.random() * 10;
    
    return {
        open,
        close,
        high,
        low
    };
}

function calculateMovingAverage(data, period) {
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(null); // Not enough data for MA yet
        } else {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            result.push(sum / period);
        }
    }
    
    return result;
}

function renderChart(ctx, data, movingAverage) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    drawGrid(ctx, width, height);
    
    // Find min and max prices for scaling
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    data.forEach(candle => {
        minPrice = Math.min(minPrice, candle.low);
        maxPrice = Math.max(maxPrice, candle.high);
    });
    
    // Add some padding
    const padding = (maxPrice - minPrice) * 0.1;
    minPrice -= padding;
    maxPrice += padding;
    
    const priceRange = maxPrice - minPrice;
    const candleWidth = width / data.length * 0.8;
    const spacing = width / data.length;
    
    // Draw price labels
    drawPriceLabels(ctx, minPrice, maxPrice, height);
    
    // Draw candlesticks
    data.forEach((candle, i) => {
        const x = i * spacing + spacing / 2;
        
        // Calculate y positions
        const openY = height - ((candle.open - minPrice) / priceRange * height);
        const closeY = height - ((candle.close - minPrice) / priceRange * height);
        const highY = height - ((candle.high - minPrice) / priceRange * height);
        const lowY = height - ((candle.low - minPrice) / priceRange * height);
        
        // Draw candle wick (high to low line)
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.strokeStyle = '#999';
        ctx.stroke();
        
        // Draw candle body
        const bodyHeight = Math.abs(closeY - openY);
        const bodyY = Math.min(openY, closeY);
        
        // Green for bullish (close > open), red for bearish (close < open)
        if (candle.close > candle.open) {
            ctx.fillStyle = '#41ff41'; // Green
        } else {
            ctx.fillStyle = '#ff4141'; // Red
        }
        
        // Draw candle body with minimum height of 1px
        ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, Math.max(1, bodyHeight));
    });
    
    // Draw moving average line
    drawMovingAverage(ctx, data, movingAverage, minPrice, maxPrice, height, spacing);
    
    // Draw current price
    drawCurrentPrice(ctx, data[data.length - 1].close, width, height, minPrice, maxPrice);
    
    // Draw stock name and info
    drawStockInfo(ctx, data[data.length - 1].close, width);
}

function drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    for (let i = 0; i < 5; i++) {
        const y = height / 5 * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i < 10; i++) {
        const x = width / 10 * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
}

function drawPriceLabels(ctx, minPrice, maxPrice, height) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px "宋体"';
    ctx.textAlign = 'left';
    
    // Draw price labels on the right
    for (let i = 0; i <= 5; i++) {
        const price = minPrice + (maxPrice - minPrice) / 5 * i;
        const y = height - (price - minPrice) / (maxPrice - minPrice) * height;
        
        ctx.fillText('¥' + Math.round(price), 5, y + 3);
    }
}

function drawMovingAverage(ctx, data, movingAverage, minPrice, maxPrice, height, spacing) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    const priceRange = maxPrice - minPrice;
    
    let firstPoint = true;
    movingAverage.forEach((ma, i) => {
        if (ma !== null) {
            const x = i * spacing + spacing / 2;
            const y = height - ((ma - minPrice) / priceRange * height);
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
    });
    
    ctx.stroke();
}

function drawCurrentPrice(ctx, price, width, height, minPrice, maxPrice) {
    const priceY = height - ((price - minPrice) / (maxPrice - minPrice) * height);
    
    // Draw price line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(0, priceY);
    ctx.lineTo(width, priceY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw price label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "宋体"';
    ctx.textAlign = 'right';
    ctx.fillText('¥' + Math.round(price), width - 5, priceY - 5);
}

function drawStockInfo(ctx, currentPrice, width) {
    // Calculate price change (random for fake data)
    const changePercent = ((Math.random() * 2) - 1).toFixed(2);
    const changeDirection = changePercent >= 0 ? '▲' : '▼';
    const changeColor = changePercent >= 0 ? '#41ff41' : '#ff4141';
    
    // Draw stock name and info
    ctx.font = 'bold 14px "宋体"';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('$FSIA', 10, 20);
    
    ctx.font = '12px "宋体"';
    ctx.fillText('¥' + Math.round(currentPrice), 10, 40);
    
    ctx.fillStyle = changeColor;
    ctx.fillText(changeDirection + ' ' + Math.abs(changePercent) + '%', 10, 60);
}