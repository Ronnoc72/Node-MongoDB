const screen = document.getElementById('window');
const wpm = document.getElementById('wpm');
const mistakes = document.getElementById('mistakes');
const accuracyElement = document.getElementById('accuracy');
const wordList = [];
const startingLink = 'http://localhost:3000/';
var index = 0;
var startTime = 0;
var mistakeCount = 0;
var pastLetter = '';
var misssed = false;
const words = document.getElementById('words');

const xhr = new XMLHttpRequest();
xhr.open('GET', startingLink, true);
xhr.send('hello there');

if (!localStorage.getItem('wmp') && !localStorage.getItem('mistakes') && !localStorage.getItem('accuracy')) {
    localStorage.setItem('wmp', '0');
    localStorage.setItem('mistakes', '0');
    localStorage.setItem('accuracy', '0%')
} else {
    wpm.innerHTML = `WMP: ${localStorage.getItem('wmp')}`;
    mistakes.innerHTML = `Mistakes: ${localStorage.getItem('mistakes')}`;
    accuracyElement.innerHTML = `Accuracy: ${localStorage.getItem('accuracy')}`;
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
        startTime = new Date().getTime() / 100000;
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
        console.log(mistakeCount);
        missed = true;
    }
    if (index + 1 === words.children.length) {
        index = 0;
        var endTime = new Date().getTime() / 100000;
        const grossWMP = (mainStr.length / 5) / (endTime - startTime);
        const average = Math.round(grossWMP - (mistakeCount / (endTime - startTime)));
        const accuracy = Math.floor((100 - ((mainStr.length / mistakeCount) / 10)));
        wpm.innerHTML = `WPM: ${localStorage.getItem('wmp')}`;
        mistakes.innerHTML = `Mistakes: ${localStorage.getItem('mistakes')}`;
        accuracyElement.innerHTML = `Accuracy: ${localStorage.getItem('accuracy')}%`;
        localStorage.setItem('wmp', average.toString());
        localStorage.setItem('mistakes', mistakeCount.toString());
        localStorage.setItem('accuracy', accuracy.toString());
        document.location.href = `${startingLink}${average}/${mistakeCount}/${accuracy}`;
        started = false;
    }
});
