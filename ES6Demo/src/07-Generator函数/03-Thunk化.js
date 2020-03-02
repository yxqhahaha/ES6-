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

let readFileThunk = Thunk(file1)

readFileThunk(function(err, data){
    console.log(String(data));
})
