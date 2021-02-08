const screen = document.getElementById('window');
const wpm = document.getElementById('wpm');
const mistakes = document.getElementById('mistakes');
const accuracyElement = document.getElementById('accuracy');
const wordList = [];
const startingLink = 'http://localhost:3000/key/';
var index = 0;
var startTime = 0;
var mistakeCount = 0;
var pastLetter = '';
var missed = false;
const words = document.getElementById('words');

if (!localStorage.getItem('wmp') && !localStorage.getItem('mistakes') && !localStorage.getItem('accuracy')) {
    localStorage.setItem('wmp', '0');
    localStorage.setItem('mistakes', '0');
    localStorage.setItem('accuracy', '0%')
} else {
    wpm.innerHTML = `WMP: ${localStorage.getItem('wmp')}`;
    mistakes.innerHTML = `Mistakes: ${localStorage.getItem('mistakes')}`;
    accuracyElement.innerHTML = `Accuracy: ${localStorage.getItem('accuracy')}%`;
}

var started = false;
for (let i = 0; i < words.children.length; i++) {
    wordList.push(words.children[i].innerHTML);
}
const mainStr = wordList.join('');
words.innerHTML = '';
for (let i = 0; i < mainStr.length; i++) {
    let span = document.createElement('span');
    span.innerHTML = mainStr[i];
    words.appendChild(span);
}

window.addEventListener('keydown', (e) => {
    if (!started) {
        startTime = new Date().getTime() / 1000;
    }
    const key = e.key;
    if (words.children[index].innerHTML == key) {
        started = true;
        words.children[index].classList.remove('border');
        index++;
        words.children[index].classList.add('border');
        missed = false;
    } else {
        if (!missed) {
            mistakeCount++; 
        }
        missed = true;
    }
    if (index + 1 === words.children.length) {
        index = 0;
        var endTime = new Date().getTime() / 1000;
        const minutes = (endTime - startTime) / 60;
        const grossWMP = Math.round((mainStr.length / 5) / minutes);
        const accuracy = 100 - Math.floor((mainStr.length - mistakeCount) / 10);
        wpm.innerHTML = `WPM: ${localStorage.getItem('wmp')}`;
        mistakes.innerHTML = `Mistakes: ${localStorage.getItem('mistakes')}`;
        accuracyElement.innerHTML = `Accuracy: ${localStorage.getItem('accuracy')}%`;
        localStorage.setItem('wmp', grossWMP.toString());
        localStorage.setItem('mistakes', mistakeCount.toString());
        localStorage.setItem('accuracy', accuracy.toString());
        document.location.href = `${startingLink}${grossWMP}/${mistakeCount}/${accuracy}`;
        started = false;
    }
});

document.getElementById('info').addEventListener('click', () => {
    document.location.href = `http://localhost:3000/info`;
});
