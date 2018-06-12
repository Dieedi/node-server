const express = require('express');
const pug = require('pug');
const fs = require('fs');

const _MAINTENANCE = false;

var app = express();
var currentYear = new Date().getFullYear();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now} : ${req.method} ${req.url}`;

    fs.appendFileSync('server.log', log + '\n', (err) => {
        if (err) {
            console.log('unable to append to server.log');
        }
    });
    next();
});

if (_MAINTENANCE) {
    app.use((req, res, next) => {
        res.render('maintenance.pug');
    });
}

app.get('/', (req, res) => {
    res.render('index.pug');
});

app.get('/about', (req, res) => {
    res.render('about.pug', {
        pageTitle: 'About page',
        currentYear: new Date().getFullYear()
    });
});

app.get('/*',(req, res) => {
    res.send(`page does not exist`);
});

app.listen(3000);
