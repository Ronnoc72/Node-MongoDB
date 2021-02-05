const screen = document.getElementById('window');
const wpm = document.getElementById('wpm');
const missedLetter = document.getElementById('missed-letter');
const mistakes = document.getElementById('mistakes');
const wordList = [];
var index = 0;
var startTime = 0;
const words = document.getElementById('words');

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

console.log(document.location);

window.addEventListener('keydown', (e) => {
    if (!started) {
        startTime = new Date().getTime();
        started = true;
    }
    const key = e.key;
    if (words.children[index].innerHTML == key) {
        words.children[index].classList.remove('border');
        index++;
        words.children[index].classList.add('border');
    } else {
        console.log("mistake");
    }
    if (index + 1 === words.children.length) {
        index = 0;
        var endTime = new Date().getTime();
        console.log(endTime - startTime);
        const oldLink = document.location.href;
        const newLink = oldLink + 'ref';
    }
});
