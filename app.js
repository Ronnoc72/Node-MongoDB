// colors
// d7fdec,a9fbd7,b2e4db,b0c6ce,938ba1
const wordsPerRound = 22;
const express = require('express');
// colors text.
const chalk = require('chalk');
// gets random words for what the user has to type.
const randomWords = require('random-words');
// debuging and understanding how the website is being created.
// Use 'DEBUG=node [file name]' to get the debug.
const debug = require('debug')('app');
const morgan = require('morgan');
// makes a path for a file.
const path = require('path');
// mongodb imports.
const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

const wordList = [];

// how the debuging is happening.
app.use(morgan('tiny'));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/key', (req, res) => {
    res.render('index', {wordList: wordList});
});

app.get('/:wmp?/:mistakes?/:accuracy?', (req, res, next) => {
    wordList.splice(0, wordList.length);
    for (let i = 0; i < wordsPerRound; i++) {
        wordList.push(`${randomWords()} `);
    }
    let wmp = req.params.wmp;
    let mistakes = req.params.mistakes;
    let accuracy = req.params.accuracy;
    console.log(wmp, mistakes, accuracy);
    res.redirect('/key');
});

app.listen(3000, () => {
    console.log(`listening on port ${chalk.blue(port)}.`);
});