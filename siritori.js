'use strict';

const wordsJson = require('./public/data/words.json');
exports.wordsJson = wordsJson;

const wordsMap = new Map();
exports.wordsMap = wordsMap;

const makeWordsMap = () => {
    wordsJson.forEach(function (word, key) {
        if (!wordsMap.has(word.Read.slice(0, 1))) {
            wordsMap.set(word.Read.slice(0, 1), []);
        }
        wordsMap.get(word.Read.slice(0, 1)).push(word);
    });
    console.log('wordsMap maked!');
};
exports.makeWordsMap = makeWordsMap;
