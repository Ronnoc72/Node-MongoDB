const screen = document.getElementById('window');
const wpm = document.getElementById('wpm');
const missedLetter = document.getElementById('missed-letter');
const mistakes = document.getElementById('mistakes');

var started = false;

window.addEventListener('keydown', (e) => {
    if (!started) {
        var startTime = new Date().getTime();
        started = true;
    }
    
})
