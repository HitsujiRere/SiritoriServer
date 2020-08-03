
const xhr = new XMLHttpRequest();

/*****/

window.onload = () => {
    // 最初の単語
    const firstWord = 'しりとり';
    addWord(firstWord);

    // ツイートボタンの初期化
    updateTweetText();
};

// 単語の入力を感知する
function submitedMyWord() {
    const myWord = document.getElementById('myWordInputee').value;

    // 単語が入力されていないなら終わる
    if (myWord == '' || !isPlaying) {
        return;
    }

    // 入力した単語が正しいか調べる
    if (checkWord(myWord)) {

        // 入力した単語を送信する
        xhr.open('POST', '/siritori/used_word', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(EncodeHTMLForm({ word: myWord }));

        // 単語の追加
        addWord(myWord);
        // ツイートする文の更新
        updateTweetText();
        // 入力フォームを空にする
        document.getElementById('myWordInputee').value = '';

        if (isPlaying) {
            const enemyWordHead = backWordFoot;
            console.log(enemyWordHead);

            if (wordsMap.has(enemyWordHead) && wordsMap.get(enemyWordHead).size > 0) {
                let rnd = Math.floor(Math.random() * wordsMap.get(enemyWordHead).size);
                console.log(rnd);

                let enemyWord = '*****';
                let cnt = 0;
                for (const [word, wordE] of wordsMap.get(enemyWordHead)) {
                    if (cnt == rnd) {
                        enemyWord = word;
                        break;
                    }
                    cnt++;
                }
                console.log(enemyWord);

                if (enemyWord == '*****') {
                    console.log('Error!');
                }

                // 単語の追加
                addWord(enemyWord);

                addMessage(`CPUは「${enemyWord}」と返した！`);

                if (!checkContinue(enemyWord)) {
                    addMessage('勝利！');
                    setIsPlaying(false);
                }
            }
            else {
                addMessage('CPUはなにも返せない！勝利！');
                setIsPlaying(false);
            }
        }
    }
}

// ツイートするテキストの変更
function updateTweetText() {
    setTweetButton(
        `CPU対戦しりとりで${connectTime}回続きました！`
    );
}

function EncodeHTMLForm(data) {
    var params = [];

    for (var name in data) {
        var value = data[name];
        var param = encodeURIComponent(name) + '=' + encodeURIComponent(value);

        params.push(param);
    }

    return params.join('&').replace(/%20/g, '+');
}
