/* 
    点击tab栏 有切换效果
    点击 +  添加新的tab选项
    点击 x  删除当天tab和内容项
    点击可以修改内容
*/

var that;
class Tab {
    constructor(id){
        // 获取元素
        that = this;
        this.main = document.querySelector(id); // 拿到大盒子
        this.add = this.main.querySelector('.tabadd');
        // li 的父元素
        this.ul = this.main.querySelector('.fisrstnav ul:first-child');
        this.fathersection = this.main.querySelector('.tabscon');
        // 调用初始化函数
        this.init();
    }
    // init 
    init(){
        this.updateNode();
        // 初始化操作，让相关的元素绑定事件
        this.add.onclick = this.addTab;
        for(var i = 0; i < this.lis.length; i++){
            this.lis[i].index = i;
            this.lis[i].onclick = this.toggleTab;
            this.remove[i].onclick = this.removeTab;
            this.spans[i].ondblclick = this.aditTab;
            this.sections[i].ondblclick = this.aditTab;
        }
    }
    
    // 更新DOM
    // 获取所有li section
    updateNode(){
        this.lis = this.main.querySelectorAll('li');
        this.sections = this.main.querySelectorAll('section');
        this.remove = this.main.querySelectorAll('.icon-guanbi');
        this.spans = this.main.querySelectorAll('.fisrstnav li span:first-child');
    }

    // 1 - 切换
    toggleTab(){
        // console.log(this.index);
        // 当前tab添加 liactive  其它的清除样式
        that.clearClass();
        this.className = 'liactive';
        that.sections[this.index].className = 'conactive'
    } 

    // 清除样式
    clearClass(){
        for (let i = 0; i < this.lis.length; i++) {
           this.lis[i].className = ''
           this.sections[i].className = ''
        }
    }

    // 2 - add
    addTab(){
        // 1 - 创建新的li 和section 
        // 2 - 追加到相应的父元素
        // alert('tips')
        // 生成一个随机数
        that.clearClass();
        let random = Math.random();
        let li = '<li class="liactive"><span>测试' + random + '</span><span class="iconfont icon-guanbi"></span></li>';
        let section = '<section class="conactive">测试'+ random +'</section>';
        that.ul.insertAdjacentHTML('beforeend', li)
        that.fathersection.insertAdjacentHTML('beforeend', section);
        that.init();
    }

    // 3 - delete
    removeTab(e){
        e.stopPropagation();
        // 点击 x 可以删除li index对应的li和section
        let index = this.parentNode.index;
        console.log(index);
        // 根据索引号删除对应的li和section  remove() 可以删除指定的元素
        that.lis[index].remove();
        that.sections[index].remove();
        that.init();
        // 当删除的li不是被选定的  让原来的li状态不变
        if(document.querySelector('.liactive')) return;
        // 当删除选定状态的li时，让li前面的节点处于选定状态
        index--;
        // 做点击操作
        that.lis[index] && that.lis[index].click();
    }

    // 4 - 修改功能
    aditTab(){
        let str = this.innerHTML;
        // 双击li 或 section 可以编辑
        // 双击事件 ondbclick();
        // 双击禁止选中文字
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        // alert('tios');
        this.innerHTML = '<input type="text" />';
        var input = this.children[0];
        input.value = str;
        input.select(); // 文本框里面的文字处于选定状态
        // 当离开文本框 就把文本框里面的值给span
        input.onblur = function(){
            this.parentNode.innerHTML = this.value;
        }
        // 按下回车把值给span
        input.onkeyup = function(e){
            if(e.keyCode === 13){
                // 手动调用失去焦点事件
                this.blur();
            }
        }
    }
}

var tab = new Tab('#tab');
// tab.init();