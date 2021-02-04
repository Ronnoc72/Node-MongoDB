// colors
// d7fdec,a9fbd7,b2e4db,b0c6ce,938ba1

const express = require('express');
// colors text.
const chalk = require('chalk');
// gets random words for what the user has to type.
const randomWords = require('random-words');
const wordList = [];
for (let i = 0; i < 20; i++) {
    wordList.push(`${randomWords()} `);
}
// debuging and understanding how the website is being created.
// Use 'DEBUG=node [file name]' to get the debug.
const debug = require('debug')('app');
const morgan = require('morgan');
// makes a path for a file.
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// how the debuging is happening.
app.use(morgan('tiny'));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {wordList: wordList});
});

app.listen(3000, () => {
    console.log(`listening on port ${chalk.blue(port)}.`);
});