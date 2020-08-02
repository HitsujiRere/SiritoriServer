'use strict';

const express = require('express');

const siritori = require('./siritori');

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('hello.ejs');
});

app.get('/siritori_vs_cpu', (req, res) => {
    res.render('siritori_vs_cpu.ejs', {
        words: siritori.wordsJson,
        wordsMap: siritori.wordsMap,
    }
    );
});

app.use(function (req, res, next) {
    res.status(404);
    res.render('err404.ejs');
});

app.use(function (err, req, res, next) {
    res.status(500);
    res.render('err500.ejs');
    console.log(err);
});

app.listen(PORT, (req, res) => {
    console.log('Server is up!');

    siritori.makeWordsMap();
});
