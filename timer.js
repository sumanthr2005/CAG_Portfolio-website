document.addEventListener('DOMContentLoaded', function() {
    // Timer state
    let startTime = null;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;

    // Get DOM elements
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startTimer');
    const stopButton = document.getElementById('stopTimer');
    const resetButton = document.getElementById('resetTimer');

    // Load saved state if exists
    const savedState = JSON.parse(sessionStorage.getItem('timerState') || '{}');
    if (savedState.elapsedTime) {
        elapsedTime = savedState.elapsedTime;
        if (savedState.isRunning) {
            startTimer();
        }
        updateDisplay();
    }

    // Format time as HH:MM:SS
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Update timer display
    function updateDisplay() {
        if (timerDisplay) {
            timerDisplay.textContent = formatTime(Math.floor(elapsedTime));
        }
    }

    // Start timer function
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startTime = Date.now() - (elapsedTime * 1000);
            timerInterval = setInterval(function() {
                elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                updateDisplay();
                saveState();
            }, 1000);
            updateButtonStates();
        }
    }

    // Stop timer function
    function stopTimer() {
        if (isRunning) {
            isRunning = false;
            clearInterval(timerInterval);
            saveState();
            updateButtonStates();
        }
    }

    // Reset timer function
    function resetTimer() {
        stopTimer();
        elapsedTime = 0;
        updateDisplay();
        saveState();
        updateButtonStates();
    }

    // Save timer state to sessionStorage
    function saveState() {
        sessionStorage.setItem('timerState', JSON.stringify({
            elapsedTime: elapsedTime,
            isRunning: isRunning
        }));
    }

    // Update button states based on timer state
    function updateButtonStates() {
        if (startButton && stopButton) {
            startButton.disabled = isRunning;
            stopButton.disabled = !isRunning;
        }
    }

    // Add event listeners to buttons
    if (startButton) {
        startButton.addEventListener('click', startTimer);
    }
    if (stopButton) {
        stopButton.addEventListener('click', stopTimer);
    }
    if (resetButton) {
        resetButton.addEventListener('click', resetTimer);
    }

    // Initial button states
    updateButtonStates();

    // Clear timer state when leaving the page
    window.addEventListener('beforeunload', function() {
        sessionStorage.removeItem('timerState');
    });
});