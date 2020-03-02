const {readFile} = require('fs');
const { promisify} = require('util')
const path = require('path')

const file1 = path.join(__dirname, './text/1.txt')
const file2 = path.join(__dirname, './text/2.txt')
const readFileP = promisify(readFile)

// function* foo(){
//     let data1 = yield Thunk(file1)
//     console.log('data1 : ' + data1)
//     let data2 = yield Thunk(file2)
//     console.log('data2 : ' + data2)
// }

async function foo(){
    let data1 = await readFileP(file1)
    console.log('data1 : ' + data1)
    let data2 = await readFileP(file2)
    console.log('data2 : ' + data2)
}
foo()
