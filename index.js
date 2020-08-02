'use strict';

const express = require('express');

const PORT = process.env.PORT || 8000;

const app = express();

app.get('/', (req, res) => {
    res.render('hello.ejs');
});

app.listen(PORT, (req, res) => {
    console.log('Server is up!');
});
