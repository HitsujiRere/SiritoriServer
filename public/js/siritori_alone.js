
const xhr = new XMLHttpRequest();

let isSendWord = true;

/*****/

window.onload = () => {
    const confirmationText = document.getElementById('confirmationText');
    const confirmationOK = document.getElementById('confirmationOK');
    const confirmationNG = document.getElementById('confirmationNG');
    const myWordInputee = document.getElementById('myWordInputee');
    const myWordSubmitButton = document.getElementById('myWordSubmitButton');
    confirmationOK.addEventListener('click', (ev) => {
        confirmationText.innerHTML = "ありがとうございます。";
        confirmationOK.style.setProperty('display', 'none');
        confirmationNG.style.setProperty('display', 'none');
        myWordInputee.disabled = false;
        myWordSubmitButton.disabled = false;
        isSendWord = true;
    });
    confirmationNG.addEventListener('click', (ev) => {
        confirmationText.innerHTML = "ユーザが使用した単語を送信しません。";
        confirmationOK.style.setProperty('display', 'none');
        confirmationNG.style.setProperty('display', 'none');
        myWordInputee.disabled = false;
        myWordSubmitButton.disabled = false;
        isSendWord = false;
    });

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

        if (isSendWord) {
            // 入力した単語を送信する
            xhr.open('POST', '/siritori/used_word', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(EncodeHTMLForm({ word: myWord }));
        }

        // 単語の追加
        addWord(myWord);
        // ツイートする文の更新
        updateTweetText();
        // 入力フォームを空にする
        document.getElementById('myWordInputee').value = '';

        addMessage(`${connectTime}個目！`);
    }
}

// ツイートするテキストの変更
function updateTweetText() {
    setTweetButton(
        `1人しりとりで${connectTime}回続きました！`
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
