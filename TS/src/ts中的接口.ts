// 接口可以理解为一个约定，一个规范

interface AjaxOptions {
    // 给属性加上 ？之后代表这个属性是可选的
    url: string,
    type?: string,
    data?: object,
    success(data: object) : void
}

// option参数中 需要包含url， type, data, success
function ajax (option: AjaxOptions) {

}
ajax({
    url: 'https://www.baidu.com',
    type: 'get',
    data: {},
    success(data){

    }
})