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
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

const wordList = [];

// how the debuging is happening.
app.use(morgan('tiny'));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/login');
})

app.get('/key', (req, res) => {
    res.render('index', {wordList: wordList});
});

app.get('/key/:wmp?/:mistakes?/:accuracy?', (req, res, next) => {
    wordList.splice(0, wordList.length);
    for (let i = 0; i < wordsPerRound; i++) {
        wordList.push(`${randomWords()} `);
    }
    let _wpm = req.params.wmp;
    let _mistakes = req.params.mistakes;
    let _accuracy = req.params.accuracy;
    if (_wpm && _mistakes && _accuracy) {
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            const dbo = db.db('mydb');
            const typingInfo = { wpm: _wpm, mistakes: _mistakes, accuracy: _accuracy };
            dbo.collection('customers').insertOne(typingInfo, (err, res) => {
                if (err) throw err;
            });
            dbo.collection('customers').find({}).toArray((err, result) => {
                if (err) throw err;
                console.log(result);
                db.close();
            })
        });
    }
    res.redirect('/key');
});

app.get('/login', (req, res) => {
    res.render('home');
})

app.listen(3000, () => {
    console.log(`listening on port ${chalk.blue(port)}.`);
});
