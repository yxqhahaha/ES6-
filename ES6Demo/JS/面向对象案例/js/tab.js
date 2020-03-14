/* 
    点击tab栏 有切换效果
    点击 +  添加新的tab选项
    点击 x  删除当天tab和内容项
    点击可以修改内容
*/
class Tab {
    constructor(id){
        // 获取元素
        this.main = document.querySelector(id); // 拿到大盒子
        this.lis = this.main.querySelectorAll('li');
        this.sections = this.main.querySelectorAll('section');
        // 调用初始化函数
        this.init();
    }
    // init 
    init(){
        //初始化操作，让相关的元素绑定事件
        for(var i = 0; i < this.lis.length; i++){
            this.lis[i].index = i;
            this.lis[i].onclick = function(){
                console.log(this.index);

            }
        }

    }

    // 1 - 切换
    toggleTab(){

    } 

    // 2 - add
    addTab(){

    }

    // 3 - delete
    removeTab(){

    }

    // 4 - alter
    aditTab(){

    }
}

var tab = new Tab('#tab');
// tab.init();