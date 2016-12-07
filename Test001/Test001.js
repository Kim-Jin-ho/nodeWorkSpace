var fs = require('fs');

// Sync
// 선행 되어야할 함수가 실행이 끝날때 까지
// 다음 행의 함수나 이벤트가 발생되지 않는다.
console.log(1);
var data = fs.readFileSync('data.txt', {encoding:'utf8'});
console.log(data);

//ASync
// 선행 되어야할 함수가 실행되고,
// 다음 행의 함수나 이벤트가 실행된다.
// 선행되어야할 함수나 이벤트가 딜레이가 있다면,
// 그 함수나 이벤트가 처리된 후 처리가 된다.
// 한마디로 하나의 일을 처리하는동안 다음의 일을
// 처리한다.
console.log(2);
fs.readFile('data.txt',{encoding:'utf8'},
function(err, data)
{
    console.log(3);
    console.log(data);
})
console.log(4);
