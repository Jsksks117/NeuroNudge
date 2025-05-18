// Behavior monitoring variables
let typingData = {
    totalChars: 0,
    backspaces: 0,
    lastLength: 0,
    idleTime: 0,
    lastInputTime: Date.now()
};

let mouseData = {
    positions: [],
    clicks: 0,
    lastPosition: null,
    lastTime: Date.now()
};

let attentionData = {
    distractedFrames: 0,
    totalFrames: 0,
    lastCheck: Date.now()
};

// Monitor typing behavior
document.addEventListener('input', (e) => {
    const currentTime = Date.now();
    const textLength = e.target.value.length;
    
    if (textLength < typingData.lastLength) {
        typingData.backspaces++;
    } else if (textLength > typingData.lastLength) {
        typingData.totalChars += textLength - typingData.lastLength;
        const idleTime = currentTime - typingData.lastInputTime;
        if (idleTime > 2000) {
            typingData.idleTime += idleTime;
        }
        typingData.lastInputTime = currentTime;
    }
    
    typingData.lastLength = textLength;
});

// Monitor mouse behavior
document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    const currentPosition = { x: e.clientX, y: e.clientY };
    
    if (mouseData.lastPosition) {
        const dx = currentPosition.x - mouseData.lastPosition.x;
        const dy = currentPosition.y - mouseData.lastPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeDiff = currentTime - mouseData.lastTime;
        
        if (timeDiff > 0) {
            mouseData.positions.push({
                time: currentTime,
                speed: distance / timeDiff
            });
        }
    }
    
    mouseData.lastPosition = currentPosition;
    mouseData.lastTime = currentTime;
});

document.addEventListener('click', () => {
    mouseData.clicks++;
});

// Monitor attention (tab visibility)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        attentionData.distractedFrames++;
    }
    attentionData.totalFrames++;
});

// Analyze behavior and send data
function analyzeBehavior() {
    const currentTime = Date.now();
    const sessionDuration = (currentTime - mouseData.lastTime) / 1000;
    
    // Calculate metrics
    const typingSpeed = typingData.totalChars / sessionDuration;
    const backspaceRate = typingData.backspaces / (typingData.totalChars || 1);
    const idleTimeRatio = typingData.idleTime / (currentTime - mouseData.lastTime);
    
    // Calculate mouse metrics
    const mouseSpeeds = mouseData.positions.map(p => p.speed);
    const avgMouseSpeed = mouseSpeeds.reduce((a, b) => a + b, 0) / (mouseSpeeds.length || 1);
    const clickFrequency = mouseData.clicks / sessionDuration;
    
    // Calculate attention score
    const attentionScore = 100 * (1 - attentionData.distractedFrames / (attentionData.totalFrames || 1));
    
    // Check for potential indicators
    const adhdIndicators = {
        highMouseSpeed: avgMouseSpeed > 1000,
        highClickFrequency: clickFrequency > 5,
        lowAttention: attentionScore < 70,
        highIdleTime: idleTimeRatio > 0.3
    };
    
    const dyslexiaIndicators = {
        slowTyping: typingSpeed < 3,
        highErrorRate: backspaceRate > 0.15,
        frequentCorrections: typingData.backspaces > 10
    };
    
    // Count indicators
    const adhdCount = Object.values(adhdIndicators).filter(Boolean).length;
    const dyslexiaCount = Object.values(dyslexiaIndicators).filter(Boolean).length;
    
    // If enough indicators are present, suggest visiting the website
    if (adhdCount >= 2 || dyslexiaCount >= 2) {
        chrome.runtime.sendMessage({
            type: 'BEHAVIOR_ALERT',
            data: {
                adhdIndicators,
                dyslexiaIndicators,
                metrics: {
                    typingSpeed,
                    backspaceRate,
                    idleTimeRatio,
                    avgMouseSpeed,
                    clickFrequency,
                    attentionScore
                }
            }
        });
    }
    
    // Reset data for next session
    resetData();
}

function resetData() {
    typingData = {
        totalChars: 0,
        backspaces: 0,
        lastLength: 0,
        idleTime: 0,
        lastInputTime: Date.now()
    };
    
    mouseData = {
        positions: [],
        clicks: 0,
        lastPosition: null,
        lastTime: Date.now()
    };
    
    attentionData = {
        distractedFrames: 0,
        totalFrames: 0,
        lastCheck: Date.now()
    };
}

// Run analysis every 5 minutes
setInterval(analyzeBehavior, 5 * 60 * 1000); 