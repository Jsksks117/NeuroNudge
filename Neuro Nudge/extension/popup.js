document.addEventListener('DOMContentLoaded', function() {
    // Handle the "Visit Assessment Website" button click
    document.getElementById('visitWebsite').addEventListener('click', function() {
        chrome.tabs.create({ url: 'http://localhost:5000' });
    });

    // Get the current tab to check if monitoring is active
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        
        // Send message to content script to get current status
        chrome.tabs.sendMessage(currentTab.id, {type: 'GET_STATUS'}, function(response) {
            if (response && response.monitoring) {
                updateStatus('Monitoring active');
            } else {
                updateStatus('Monitoring not active on this page');
            }
        });
    });
});

function updateStatus(message) {
    const statusDiv = document.querySelector('.status p');
    if (statusDiv) {
        statusDiv.textContent = message;
    }
} 