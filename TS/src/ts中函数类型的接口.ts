interface SumInterface{
    //  指定了函数的参数类型和返回值类型
    (a: number, b: number): number
}

let sum: SumInterface = function (a: number, b: number) {
    return a + b;
}