// Initialize variables
let startTime = null;
let lastInputTime = null;
let charCount = 0;
let backspaces = 0;
let lastLength = 0;
let totalIdle = 0;
let mousePositions = [];
let lastMouseTime = null;
let distractedFrames = 0;
let totalFrames = 0;
let videoStream = null;
let currentTask = 'reading';

// DOM Elements
const typingArea = document.getElementById('typing-area');
const generateReportBtn = document.getElementById('generate-report');
const reportResults = document.getElementById('report-results');
const webcam = document.getElementById('webcam');
const overlay = document.getElementById('overlay');
const attentionScoreSpan = document.getElementById('attention-score');
const taskSelect = document.getElementById('task-type');

// Start session when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupWebcam();
    setupEventListeners();
});

// Start a new task
async function startTask() {
    currentTask = taskSelect.value;
    try {
        const response = await fetch('/start_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task_type: currentTask })
        });
        const data = await response.json();
        if (data.status === 'success') {
            startTime = Date.now() / 1000;
            lastInputTime = startTime;
            // Reset all metrics
            charCount = 0;
            backspaces = 0;
            lastLength = 0;
            totalIdle = 0;
            mousePositions = [];
            distractedFrames = 0;
            totalFrames = 0;
            // Clear typing area
            typingArea.value = '';
            // Hide previous report
            reportResults.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error starting task:', error);
    }
}

// Setup webcam
async function setupWebcam() {
    try {
        const constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user",
                aspectRatio: 16/9
            }
        };
        
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        webcam.srcObject = videoStream;
        
        // Wait for video to be ready
        webcam.onloadedmetadata = () => {
            webcam.play();
            // Start processing frames
            processVideoFrame();
        };
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

// Process video frames
async function processVideoFrame() {
    if (!videoStream) return;

    const canvas = document.createElement('canvas');
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(webcam, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');

    try {
        const response = await fetch('/process_frame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });
        
        const data = await response.json();
        if (data.status === 'success') {
            attentionScoreSpan.textContent = data.attention_score.toFixed(1) + '%';
            
            // Display the annotated image
            const overlayCtx = overlay.getContext('2d');
            const img = new Image();
            img.onload = () => {
                overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
                overlayCtx.drawImage(img, 0, 0, overlay.width, overlay.height);
            };
            img.src = data.annotated_image;
        }
    } catch (error) {
        console.error('Error processing frame:', error);
    }

    requestAnimationFrame(processVideoFrame);
}

// Setup event listeners
function setupEventListeners() {
    // Task selection: start a new task when dropdown changes
    taskSelect.addEventListener('change', startTask);

    // Typing events
    typingArea.addEventListener('input', async () => {
        const currentTime = Date.now() / 1000;
        const textLen = typingArea.value.length;
        
        if (textLen < lastLength) {
            backspaces++;
        } else if (textLen > lastLength) {
            charCount += textLen - lastLength;
            const idleTime = currentTime - lastInputTime;
            if (idleTime > 2) {
                totalIdle += idleTime;
            }
            lastInputTime = currentTime;
        }
        
        lastLength = textLen;
        
        try {
            await fetch('/update_typing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: typingArea.value })
            });
        } catch (error) {
            console.error('Error updating typing:', error);
        }
    });

    // Mouse events
    document.addEventListener('mousemove', async (e) => {
        const currentTime = Date.now() / 1000;
        mousePositions.push([currentTime, e.pageX, e.pageY]);
        
        try {
            await fetch('/update_mouse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ x: e.pageX, y: e.pageY })
            });
        } catch (error) {
            console.error('Error updating mouse:', error);
        }
    });

    // Generate report
    generateReportBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/generate_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Update metrics
                document.getElementById('typing-speed').textContent = data.metrics.typing_speed.toFixed(2);
                document.getElementById('backspace-rate').textContent = data.metrics.backspace_rate.toFixed(2);
                document.getElementById('idle-time-ratio').textContent = data.metrics.idle_time_ratio.toFixed(2);
                document.getElementById('mouse-speed').textContent = data.metrics.mouse_speed.toFixed(2);
                document.getElementById('click-frequency').textContent = data.metrics.click_frequency.toFixed(2);
                document.getElementById('attention-score-value').textContent = data.metrics.attention_score.toFixed(1);
                
                // Update LLM report
                document.getElementById('llm-report').textContent = data.llm_analysis;
                
                // Show results
                reportResults.classList.remove('hidden');
            } else {
                // Show error message
                alert(data.message || 'Error generating report. Please try again.');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Error generating report. Please try again.');
        }
    });
}

// Cleanup when page is unloaded
window.addEventListener('beforeunload', () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
}); 