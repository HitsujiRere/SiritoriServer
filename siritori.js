'use strict';

const { getPostgresClient } = require('./postgres');

require('dotenv').config();

const standardWordsJson = require('./public/data/standard_words.json');
exports.standardWordsJson = standardWordsJson;

let userWordsJson = [];
//exports.userWordsJson = userWordsJson;

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

const loadUserWordsJSON = async () => {
    const db = await getPostgresClient();

    try {
        const sql = `SELECT json_agg(user_words) FROM user_words;`;

        await db.begin();
        const ret = await db.execute(sql);
        const retText = JSON.stringify(ret[0].json_agg)
            .replace(/read/g, 'Read')
            .replace(/mean/g, 'Mean')
            .replace(/null/g, '""');
        const userWords = JSON.parse(retText);
        userWordsJson = userWords;
        exports.userWordsJson = userWordsJson;

        await db.commit();

    } catch (e) {
        await db.rollback();
        throw e;
    } finally {
        await db.release();
    }

    console.log('userWordsJSON loaded!');
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
    await loadUserWordsJSON();
    makeUserWordsMap();
};
makeWordsMap();

const existsWordInStandardWordsMap = (word) => {
    const wordHead = word.slice(0, 1);

    return standardWordsMap.has(wordHead) &&
        standardWordsMap.get(wordHead).has(word);
}
exports.existsWordInStandardWordsMap = existsWordInStandardWordsMap;

const existsWordInUserWordsMap = (word) => {
    const wordHead = word.slice(0, 1);

    return userWordsMap.has(wordHead) &&
        userWordsMap.get(wordHead).has(word);
}
exports.existsWordInUserWordsMap = existsWordInUserWordsMap;

const pushWordToUserWordsMap = async (word, mean) => {
    const wordHead = word.slice(0, 1);

    if (!userWordsMap.has(wordHead)) {
        userWordsMap.set(wordHead, new Map());
    }
    userWordsMap.get(wordHead).set(word, { Read: word, Mean: mean });

    await userWordsJson.push({ Read: word, Mean: '' });

    const db = await getPostgresClient();

    try {
        const sql = `INSERT INTO user_words (read, mean) VALUES ($1, $2);`;
        const params = [word, mean];

        await db.begin();
        await db.execute(sql, params);
        await db.commit();

    } catch (e) {
        await db.rollback();
        throw e;
    } finally {
        await db.release();
    }
}
exports.pushWordToUserWordsMap = pushWordToUserWordsMap;
