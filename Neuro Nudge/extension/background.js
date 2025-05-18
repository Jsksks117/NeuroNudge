// Track if we've shown the notification recently
let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

// Listen for behavior alerts from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'BEHAVIOR_ALERT') {
        const currentTime = Date.now();
        
        // Check if we should show a notification (not shown in last 24 hours)
        if (currentTime - lastNotificationTime > NOTIFICATION_COOLDOWN) {
            showNotification(message.data);
            lastNotificationTime = currentTime;
        }
    }
});

function showNotification(data) {
    // Create notification content
    const adhdCount = Object.values(data.adhdIndicators).filter(Boolean).length;
    const dyslexiaCount = Object.values(data.dyslexiaIndicators).filter(Boolean).length;
    
    let message = '';
    if (adhdCount >= 2 && dyslexiaCount >= 2) {
        message = 'We noticed some patterns that might indicate potential ADHD and dyslexia.';
    } else if (adhdCount >= 2) {
        message = 'We noticed some patterns that might indicate potential ADHD.';
    } else if (dyslexiaCount >= 2) {
        message = 'We noticed some patterns that might indicate potential dyslexia.';
    }
    
    // Show notification
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Learning Behavior Monitor',
        message: message + ' Would you like to learn more?',
        buttons: [
            { title: 'Learn More' },
            { title: 'Not Now' }
        ],
        priority: 2
    });
}

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) { // "Learn More" button
        chrome.tabs.create({
            url: 'http://localhost:5000'
        });
    }
    chrome.notifications.clear(notificationId);
}); 