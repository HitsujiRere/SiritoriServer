
// 単語マップ Map< string, Map<string, Word> >
// 登場した単語は削除する
const wordsMap = new Map();

// 以前使用した単語たち
const backWords = new Set();

// 繋がった回数
let connectTime = 0;

// メッセージテキスト
let messageText = '';

// プレイ中かどうか
let isPlaying = true;

// 前の単語の繋がる文字
let backWordFoot = '';

// 繋がる文字として使えない文字
const NGBackWordFootChars = [
    'ゃ', 'ゅ', 'ょ', 'っ', 'ー', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ',
];

/*****/

// FROM: https://uxmilk.jp/11586
// 読み込んだCSVデータを単語マップに変換する
function convertWordsMap(wordsJson) {
    const words = JSON.parse(wordsJson);
    words.forEach(function (word, key) {
        if (!wordsMap.has(word.Read.slice(0, 1))) {
            wordsMap.set(word.Read.slice(0, 1), new Map());
        }
        wordsMap.get(word.Read.slice(0, 1)).set(word.Read, word);
    });
}

// 単語が正しいか確かめる
function checkWord(word) {
    if (checkHiragana(word) && checkViableWord(word) &&
        checkConnect(word) && checkNotUsed(word)) {
        connectTime++;

        if (checkContinue(word)) {
            console.log('OK!');

            setMessage('');
        }
        else {
            console.log('FINISH!');

            setMessage('「ん」が付いた！負け！');

            setIsPlaying(false);
        }

        return true;
    }
    else {
        console.log('NO!');

        return false;
    }
}

// 全てひらがなかどうか
function checkHiragana(word) {
    if (word === null) {
        setMessage('nullです');

        return false;
    }

    if (word.match(/^[ぁ-んー]*$/)) {
        return true;
    } else {
        setMessage('ひらがなではありません');

        return false;
    }
}

// 存在しうる単語かどうか
function checkViableWord(word) {
    // 2連続であるかどうか
    //console.log('([ゃゅょぁぃぅぇぉっー])\1+ = ' + word.match(/^.*([ゃゅょぁぃぅぇぉっー])\1+.*$/));
    // [ゃゅょぁぃぅぇぉ]が連続して使われているか
    console.log('[ゃゅょぁぃぅぇぉ]{2,} = ' + word.match(/^.*[ゃゅょぁぃぅぇぉ]{2,}.*$/));
    // [っー]が連続して使われているか
    console.log('([ーっ])\\1+ = ' + word.match(/^.*([っー])\1+.*$/));
    // [っー]→[ゃゅょぁぃぅぇぉ]という順番で使われているか
    console.log('[っー][ゃゅょぁぃぅぇぉ] = ' + word.match(/^.*[っー][ゃゅょぁぃぅぇぉ].*$/));
    // っ→ーという順番で使われているか
    console.log('(ー)(っ) = ' + word.match(/^.*(ー)(っ).*$/));

    if (word.match(/^.*[ゃゅょぁぃぅぇぉ]{2,}.*$/) ||
        word.match(/^.*([ーっ])\1+.*$/) ||
        word.match(/^.*[っー][ゃゅょぁぃぅぇぉ].*$/) ||
        word.match(/^.*(ー)(っ).*$/)
    ) {
        setMessage('存在しうる単語ではありません');
        return false;
    }
    return true;
}

// 前の単語と繋がっているか
function checkConnect(word) {

    if (backWordFoot === '') {
        return true;
    }

    console.log(backWordFoot + ' -> ' + word.slice(0, 1));

    if (backWordFoot == word.slice(0, 1)) {
        return true;
    } else {
        setMessage('前の単語と繋がりません');
        return false;
    }
}

// 使われていないか調べる
function checkNotUsed(word) {
    if (!backWords.has(word)) {
        return true;
    } else {
        setMessage('既に使用されています');
        return false;
    }
}

// 単語リストのなかに存在しているか調べる
function checkExist(word) {
    if (wordsMap.has(word.slice(0, 1)) &&
        wordsMap.get(word.slice(0, 1)).has(word)) {
        return true;
    }
    else {
        return false;
    }
}

// まだ続くかどうか
function checkContinue(word) {
    return word.slice(-1) != 'ん';
}

// 単語を追加する
function addWord(word) {
    updateBackWordFoot(word);

    addWordToBackWords(word);

    document.getElementById('backWord').innerHTML = word;
    document.getElementById('backWordFoot').innerHTML = backWordFoot;
    console.log(backWordFoot);

    backWords.add(word);
}

// 過去への単語の追加する
function addWordToBackWords(word) {
    const wordTextNode = document.createTextNode(
        word +
        (checkExist(word) && wordsMap.get(word.slice(0, 1)).get(word).Mean !== ''
            ? ' : ' + wordsMap.get(word.slice(0, 1)).get(word).Mean
            : '')
    );

    const wordLiElement = document.createElement('li');
    wordLiElement.appendChild(wordTextNode);

    const backWordsElement = document.getElementById('backWords');
    backWordsElement.insertBefore(wordLiElement, backWordsElement.firstChild);

    if (checkExist(word)) {
        wordsMap.get(word.slice(0, 1)).delete(word);
    }
}

// backWordFootを更新する
function updateBackWordFoot(word) {
    backWordFoot = word.slice(-1);

    let i = -2;
    while (NGBackWordFootChars.some(c => c == backWordFoot)) {
        backWordFoot = word.slice(i, i + 1);
        i--;
    }
}

// FROM: https://qiita.com/lovesaemi/items/d4f296b6b1d5158d2fea
// FIX : URLを任意のものに変更できない
function setTweetButton(text) {
    //既存のボタンを消去
    document.getElementById('tweetArea').textContent = null;
    // 新しいボタンの作成
    twttr.widgets.createShareButton(
        '',
        document.getElementById('tweetArea'),
        {
            size: 'large',
            text: text,
            //hashtags: '１人しりとり',
            //url: url,
        }
    );
}

function setMessage(txt) {
    messageText = txt;
    updateMessage();
}

function addMessage(txt) {
    messageText += txt;
    updateMessage();
}

// メッセージの更新
function updateMessage() {
    const messageEl = document.getElementById('message');
    messageEl.innerHTML = messageText;
}

function setIsPlaying(t) {
    isPlaying = t;

    if (!isPlaying) {
        document.getElementById('inputeeDiv').style.display = 'none';
    }
}