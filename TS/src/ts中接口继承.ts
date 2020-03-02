// 接口继承接口
interface TwoDPoint {
    x: number,
    y: number
}

interface ThreeDPoint extends TwoDPoint {
    z: number
}
interface FourDPoint extends ThreeDPoint, TwoDPoint {
    time: Date
}

let poi2: TwoDPoint = {
    x: 123,
    y: 23
}