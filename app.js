const express = require('express');
// colors text.
const chalk = require('chalk');
// debuging and understanding how the website is being created.
// Use 'DEBUG=node [file name]' to get the debug.
const debug = require('debug')('app');
const morgan = require('morgan');
// makes a path for a file.
const path = require('path');

const app = express();
const port = process.env.PORT || 3000

// how the debuging is happening.
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log(`listening on port ${chalk.green(port)}.`);
});