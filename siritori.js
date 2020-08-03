'use strict';

const standardWordsJson = require('./public/data/standard_words.json');
exports.standardWordsJson = standardWordsJson;

const userWordsJson = require('./public/data/user_words.json');
exports.userWordsJson = userWordsJson;

const standardWordsMap = new Map();
exports.standardWordsMap = standardWordsMap;

const userWordsMap = new Map();
exports.userWordsMap = userWordsMap;

const makeStandardWordsMap = async () => {
    await standardWordsJson.forEach(async (word, key) => {
        const wordHead = word.Read.slice(0, 1);
        if (!standardWordsMap.has(wordHead)) {
            standardWordsMap.set(wordHead, new Map());
        }
        standardWordsMap.get(wordHead).set(word.Read, word);
    });
    console.log('standardWordsMap maked!');
};

const makeUserWordsMap = async () => {
    await userWordsJson.forEach(async (word, key) => {
        const wordHead = word.Read.slice(0, 1);
        if (!userWordsMap.has(wordHead)) {
            userWordsMap.set(wordHead, new Map());
        }
        userWordsMap.get(wordHead).set(word.Read, word);
    });
    console.log('userWordsMap maked!');
};

const makeWordsMap = async () => {
    makeStandardWordsMap();
    makeUserWordsMap();
};
exports.makeWordsMap = makeWordsMap;

const existsWordInStandardWordsMap = (word) => {
    const wordHead = word.slice(0, 1);

    return standardWordsMap.has(wordHead) &&
        standardWordsMap.get(wordHead).has(word);
}
exports.existsWordInStandardWordsMap = existsWordInStandardWordsMap;

const pushWordToUserWordsMap = (word) => {
    const wordHead = word.slice(0, 1);

    if (!userWordsMap.has(wordHead)) {
        userWordsMap.set(wordHead, new Map());
    }
    userWordsMap.get(wordHead).set(word, { Read: word, Mean: '' });
}
exports.pushWordToUserWordsMap = pushWordToUserWordsMap;
