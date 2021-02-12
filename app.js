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
const dbName = 'mydb';
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
function createDatabase() {
    // creates the database if it doesn't exist.
    MongoClient.connect(url + dbName, { useUnifiedTopology: true }, (err, db) => {
        if (db.db.length >= 1) {
            console.log('database connected');
            return;
        }
        if (err) throw err;
        console.log('database created.');
        db.close();
    });
}
function removeDatabase() {
    // removes the information in the database (testing perposes)
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db(dbName);
        dbo.dropCollection('customers');
    });
}
function addUser(_user, _pass) {
    // adds a new user to the database using the '/register'
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db(dbName);
        const typingAccount = {user: _user, pass: _pass, wpm: [], mistakes: [], accuracy: []};
        dbo.collection('customers').insertOne(typingAccount, (err, res) => {
            if (err) throw err;
        });
        dbo.collection('customers').find(typingAccount).toArray((err, result) => {
            if (err) throw err;
            user = result[0];
        })
        db.close();
    });
}
function displayDB() {
    // displays the database, for testing
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db(dbName);
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

// login page
app.get('/', (req, res) => {
    // createDatabase();
    res.render('home', {message: message});
});
// getting the users login info and fetching their data.
app.post('/login', (req, res) => {
    console.log(req.body.user);
    console.log(req.body.pass);
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db(dbName);
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
// the function that creates accounts if they don't exist.
app.post('/register', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db(dbName);
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
// main app page
app.get('/key', (req, res) => {
    res.render('index', {wordList: wordList, user: user.user});
});
// getting the data from the user and putting it into the database.
app.get('/key/:wmp?/:mistakes?/:accuracy?', (req, res, next) => {
    wordList.splice(0, wordList.length);
    for (let i = 0; i < wordsPerRound; i++) {
        wordList.push(`${randomWords()} `);
    }
    var _wpm = req.params.wmp;
    var _mistakes = req.params.mistakes;
    var _accuracy = req.params.accuracy;
    if (_wpm && _mistakes && _accuracy) {
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            const dbo = db.db(dbName);
            dbo.collection('customers').find({user: user.user, pass: user.pass}).toArray((err, result) => {
                const wpmReplace = result[0].wpm;
                wpmReplace.push(_wpm);
                const mistakesReplace = result[0].mistakes;
                mistakesReplace.push(_mistakes);
                const accuracyReplace = result[0].accuracy;
                accuracyReplace.push(_accuracy);
                dbo.collection('customers').updateOne({user: user.user, pass: user.pass}, 
                    {$set: {wpm: wpmReplace, mistakes: mistakesReplace, accuracy: accuracyReplace}});
            });
            dbo.collection('customers').findOne(user, (err, result) => {
                if (err) throw err;
                result.wpm.push(_wpm);
                result.mistakes.push(_mistakes);
                result.accuracy.push(_accuracy);
                user = result;
            });
        });
    }
    res.redirect('/key');
});
// where the user can go to look at the data.
app.get('/info', (req, res) => {
    if (user === '') {
        res.redirect('/key');
    }
    MongoClient.connect(url, (err, db) => {
        const dbo = db.db('mydb');
        dbo.collection('customers').find({user: user.user, pass: user.pass}).toArray((err, result) => {
            if (err) throw err;
            const userInfo = result[0];
            var _wpm = userInfo.wpm;
            var _mistakes = userInfo.mistakes;
            var _accuracy = userInfo.accuracy;
            var averageWpm = 0;
            var averageMis = 0;
            var averageAcc = 0;
            _wpm.forEach(elem => averageWpm += Number(elem));
            averageWpm /= _wpm.length;
            _mistakes.forEach(elem => averageMis += Number(elem));
            averageMis /= _mistakes.length;
            _accuracy.forEach(elem => averageAcc += Number(elem));
            averageAcc /= _accuracy.length;
            res.render('info', {averageWpm: Math.floor(averageWpm), averageMis: Math.floor(averageMis),
                averageAcc: Math.floor(averageAcc), total: _wpm.length});
        });
        db.close();
    });
});
// logout of the main home and user is redefined.
app.get('/logout', (req, res) => {
    user = undefined;
    res.redirect('/');
});

app.listen(3000, () => {
    console.log(`listening on port ${chalk.blue(port)}.`);
});
