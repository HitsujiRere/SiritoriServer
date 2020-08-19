'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const siritori = require('./siritori');

const PORT = process.env.PORT || 8000;

const app = express();
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

app.get('/hello', async (req, res) => {
    res.render('hello.ejs');
});

app.get('/siritori/vs_cpu', async (req, res) => {
    res.render('siritori_vs_cpu.ejs', {
        standardWords: siritori.standardWordsJson,
        standardWordsMap: siritori.standardWordsMap,
    });
});

app.get('/siritori/vs_cpu_beta', async (req, res) => {
    res.render('siritori_vs_cpu_beta.ejs', {
        standardWords: siritori.standardWordsJson,
        standardWordsMap: siritori.standardWordsMap,
        userWords: siritori.userWordsJson,
        userWordsMap: siritori.userWordsMap,
    });
});

app.post('/siritori/used_word', async (req, res) => {
    const read = req.body.word;
    res.status(200);
    res.end();

    if (!siritori.existsWordInStandardWordsMap(read) &&
        !siritori.existsWordInUserWordsMap(read)) {
        siritori.pushWordToUserWordsMap(read);
        console.log(`add '${read}' to user words!`);
    }
});

app.use(async (req, res, next) => {
    res.status(404);
    res.render('err404.ejs');
});

app.use(async (err, req, res, next) => {
    res.status(500);
    res.render('err500.ejs');
    console.log(err);
});

app.listen(PORT, async (req, res) => {
    console.log('Server is up!');
});
