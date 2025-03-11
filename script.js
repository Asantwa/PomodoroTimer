let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;
let workDuration = 25;
let shortBreakDuration = 5;
let longBreakDuration = 15;
let currentSession = 1;
let isWorkSession = true;
let totalSessions = 4; // Number of work sessions before long break

// Make sure the display is updated when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateSessionDisplay();
    updateDisplay();
});

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateSessionDisplay() {
    const sessionType = document.getElementById('sessionType');
    if (isWorkSession) {
        sessionType.textContent = `Work Session ${currentSession}`;
    } else {
        if (currentSession >= totalSessions) {
            sessionType.textContent = 'Long Break';
        } else {
            sessionType.textContent = 'Short Break';
        }
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        document.getElementById('startBtn').disabled = true;
        timerId = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timerId);
                isRunning = false;
                document.getElementById('startBtn').disabled = false;
                
                // Fire different confetti based on session type
                if (isWorkSession) {
                    fireWorkConfetti();
                } else {
                    fireBreakConfetti();
                }
                
                // Show completion message
                setTimeout(() => {
                    alert(`${document.getElementById('sessionType').textContent} completed!`);
                }, 500); // Slight delay to allow confetti to start
                
                // Switch to next session
                switchSession();
                return;
            }
            updateDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timerId);
        isRunning = false;
        document.getElementById('startBtn').disabled = false;
    }
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    isWorkSession = true;
    currentSession = 1;
    timeLeft = workDuration * 60;
    document.getElementById('startBtn').disabled = false;
    updateSessionDisplay();
    updateDisplay();
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function saveSettings() {
    workDuration = parseInt(document.getElementById('workDuration').value);
    shortBreakDuration = parseInt(document.getElementById('shortBreak').value);
    longBreakDuration = parseInt(document.getElementById('longBreak').value);
    
    // Update current timer if it's not running
    if (!isRunning) {
        timeLeft = workDuration * 60;
        updateDisplay();
    }
    
    toggleSettings();
}

function switchSession() {
    if (isWorkSession) {
        // Switch to break
        isWorkSession = false;
        if (currentSession >= totalSessions) {
            // Long break
            timeLeft = longBreakDuration * 60;
            currentSession = 1; // Reset sessions after long break
        } else {
            // Short break
            timeLeft = shortBreakDuration * 60;
            currentSession++;
        }
    } else {
        // Switch back to work
        isWorkSession = true;
        timeLeft = workDuration * 60;
    }
    updateSessionDisplay();
    updateDisplay();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Add these confetti functions
function fireConfetti() {
    // First burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Fire multiple bursts for a more dramatic effect
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 150);
}

function fireWorkConfetti() {
    // Green and gold for work completion
    confetti({
        particleCount: 100,
        spread: 70,
        colors: ['#FFD700', '#90EE90'], // Gold and light green
        origin: { y: 0.6 }
    });
}

function fireBreakConfetti() {
    // Blue and purple for break completion
    confetti({
        particleCount: 100,
        spread: 70,
        colors: ['#87CEEB', '#DDA0DD'], // Sky blue and plum
        origin: { y: 0.6 }
    });
}