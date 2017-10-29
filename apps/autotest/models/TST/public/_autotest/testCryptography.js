ar s1 = 'very short string';
var a = [];
for (var i=0; i< 100000; i++){a.push(s1)};
var s2 = a.join('');

function test() {
    var str;

    str = ((new Date() - 1) % 2 === 0) ? s1 : s2;
    $App.connection.channelEncryptor.encryptToArray(str, false, false).then(function (arr) {
        return $App.connection.channelEncryptor.decryptArr(arr, false, false);
    }).done(function (res) {
        if (res !== str) {console.error('Wrong result') }else{ console.log('ok')};
    })
}
for (var i=0; i < 1; i++){test()}