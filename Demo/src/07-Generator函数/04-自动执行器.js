// Thunk版本的ReadFile（单参数版本）
const {readFile} = require('fs');
const path = require('path')

const file1 = path.join(__dirname, './txt/1.txt')
const file2 = path.join(__dirname, './txt/2.txt')

let Thunk = function(fileName) {
    return function (callback) {
        return readFile(fileName, callback);
    };
};

/* 没搞懂 */
function* foo(){
    let data1 = yield Thunk(file1)
    console.log('data1 : ' + data1)
    let data2 = yield Thunk(file2)
    console.log('data2 : ' + data2)
}

function run(foo) {
    let it = foo();
    function  nextStep(err, data) {
        var result = it.next(data);
        console.log(result)
        if(result.done) return ;
        result.value(nextStep)  // 执行readFile，并且把nextStep作为回调传入
    }
}
