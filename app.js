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
function removeDatabase() {
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db('mydb');
        dbo.dropCollection('customers');
    });
}
function addUser(_user, _pass) {
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db('mydb');
        const typingAccount = {user: _user, pass: _pass, wpm: [], mistakes: [], accuracy: []};
        dbo.collection('customers').insertOne(typingAccount, (err, res) => {
            if (err) throw err;
        });
        db.close();
    });
}
function displayDB() {
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db('mydb');
        dbo.collection('customers').find({}).toArray((err, result) => {
            if (err) throw err;
            result.forEach(r => {
                console.log(r);
            });
        });
        db.close();
    });
}
// bodyparser
const bodyParser = require('body-parser');
// current user accessing the cite
var user = '';
var message = '';

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

const wordList = [];
for (let i = 0; i < wordsPerRound; i++) {
    wordList.push(`${randomWords()} `);
}

// how the debuging is happening.
app.use(morgan('tiny'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', {message: message});
    displayDB();
});

app.post('/login', (req, res) => {
    console.log(req.body.user);
    console.log(req.body.pass);
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db('mydb');
        dbo.collection('customers').find({'user': req.body.user, 'pass': req.body.pass})
        .toArray((err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                message = 'Account doesn\'t exists.';
                res.redirect('/');
            } else {
                user = result[0];
                message = '';
                res.redirect('/key');
            }
        });
        db.close();
    });
});

app.post('/register', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db('mydb');
        dbo.collection('customers').find({'user': req.body.user, 'pass': req.body.pass})
        .toArray((err, result) => {
            if (err) throw err;
            if (result.length >= 1) {
                message = 'Account already exist.';
                res.redirect('/');
            } else {
                message = '';
                if (req.body.pass === req.body.pass2) {
                    if (req.body.user && req.body.pass) {
                        addUser(req.body.user, req.body.pass);
                        res.redirect('/key');
                    }
                }
            }
        });
        db.close();
    });
});

app.get('/key', (req, res) => {
    res.render('index', {wordList: wordList, user: user.user});
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
            dbo.collection('customers').findOne(user, (err, result) => {
                if (err) throw err;
                result.wpm.push(_wpm);
                result.mistakes.push(_mistakes);
                result.accuracy.push(_accuracy);
            });
        });
    }
    res.redirect('/key');
});

app.get('/info', (req, res) => {
    res.render('info');
});

app.listen(3000, () => {
    console.log(`listening on port ${chalk.blue(port)}.`);
});
