class People {
    // name: string = ''
    // 属性的存储器
    private _name:string = ''
    get name ():string{
        return this._name
    }   
    set name(value: string){
        // 可以设置相关的校验逻辑
        if(value.length < 2 || value.length > 10) {
            throw new Error('name不合法！')
        }
        this._name = value
    }
}
var p = new People();
p.name = 'cnyanx'
console.log(p.name);
