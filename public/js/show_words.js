
const xhr = new XMLHttpRequest();

// ワードを登録する
const submitedWord = () => {
    const inputedWord = document.getElementById('inputedWord').value;
    const inputedMean = document.getElementById('inputedMean').value;

    xhr.open('POST', '/siritori/used_word', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(EncodeHTMLForm({ word: inputedWord, mean: inputedMean }));

    document.getElementById('inputedWord').value = '';
    document.getElementById('inputedMean').value = '';
};

// 配列をHTMLフォームにエンコードする
const EncodeHTMLForm = (data) => {
    const params = [];

    for (const name in data) {
        const value = data[name];
        const param = encodeURIComponent(name) + '=' + encodeURIComponent(value);

        params.push(param);
    }

    return params.join('&').replace(/%20/g, '+');
};
