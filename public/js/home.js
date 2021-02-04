const screen = document.getElementById('window');
const wpm = document.getElementById('wpm');
const missedLetter = document.getElementById('missed-letter');
const mistakes = document.getElementById('mistakes');
var index = 0;
var startTime = 0;

const words = document.getElementById('words');
const wordList = [];
for (let i = 0; i < words.children.length; i++) {
    wordList.push(words.children[i].innerHTML);
}
const mainStr = wordList.join("");

console.log(wordList);

var started = false;

window.addEventListener('keydown', (e) => {
    if (!started) {
        startTime = new Date().getTime();
        started = true;
    }
    const key = e.key;
    if (mainStr[index] == key) {
        index++;
    } else {
        console.log("mistake");
    }
    if (index + 1 === mainStr.length) {
        var endTime = new Date().getTime()
        console.log(endTime - startTime);
    }
});
