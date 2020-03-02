### JS（ES5）基础知识回顾：

**1 - 六种基本数据类型**

```js
undefined
null
Boolean
string  
Number
Object
```



## 1、Symbol

#### 1.1 - 概述

ES6引入了一种新的原始数据类型symbol，表示**独一无二的值。**

直接调用Symbol函数即可生成一个Symbol，注意 Symbol 函数前不能使用new命 令，否则会报错。

Symbol函数可以接收一个字符串作为参数，表示对Symbol的描述，主要是为了再控制台显示，或者转化为字符串时，比较容易区分。

```js
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1	// Symbol(foo)
s2	// Symbol(bar)
```

注意： Symbol 函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的 Symbol 函数的返回值时不等的。



```js
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

let s5 = Symbol('yangx');
let s6 = Symbol('yangx');
/* 
	Symbol每次生成都是一个独一无二的值
*/
console.log(s5 === s6);     // false 
```

#### 1.2 - Symbol作为属性

Symbol值可以作为标识符，用于对象的属性名，由于每一个Symbol值都是不相等的，这意味着就能保证不会出现同名的属性，能防止某一个键被不小心改写或者覆盖的请情况。

注意，再对象的内部，使用Symbol值定义属性时Symbol值必须放在方括号之中。

```js
let mySymbol = 'yangx';

// 第一种写法
let a = {};
a[mySymbol] = 'cnyangx';

// 第二种写法
let b = {
    [mySymbol]: 'cnyangx'
}

// 第三种写法
let c = {};
Object.defineProperty(c, mySymbol, {value: 'cnyangx'});

// 以上写法都得到同样的结果
console.log(a[mySymbol]);   // cnyangx
console.log(b[mySymbol]);   // cnyangx
console.log(c[mySymbol]);   // cnyangx
```

Symbol作为属性名，该属性不会出现在`for...in`、`for...of` 循环中，也不会被`object.keys()`、`Object.getOenPropertyNames()`、 `JSON.stringfu()` 返回。 

但是有一个`Object.getOenPropertySymbols()` 方法，可以**获取指定对象的所有Symbol属性名**。



#### 1.3 - Symbol.for

有时，我们希望重新使用同一个Symbol值，symbol.for 方法可以做到这一点，它接受一个字符串作为参数，然后搜索有没有该参数作为名称的值Symbol值。 如果有，就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。

```js
<script>
    let s1 = Symbol.for('foo')  // 注册
    let s2 = Symbol.for('foo')
    console.log(s1 === s2); // true

    let s3 = Symbol('foo')  // 这样没有注册
    let s4 = Symbol('foo')
    console.log(s3 === s4); // false
</script>
```

Symbol.for() 与 Symbol()这两种写法，都会生成新的Symbol。他们的区别是，前者会被登记在全局环境中提供搜索，后者不会。 Symbol.for()不会没词条用就返回一个新的Symbol类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。比如，如果你调用Symbol.for("cat") 30次，每次都会返回同一个Symbol值，但是调用Symbol.for("cat") 30次，会返回30个不同的Symbol值。

#### 1.4 内置Symbol

除了定义自己使用的Symbol 值以外，ES6还提供了11个内置的Symbol值，指向语言内部使用方法。

```js
Symbol.hasInstance
Symbol.isConcatSpreadable
Symbol.species
Symbol.match
Symbol.replace
Symbol.split
Symbol.toPrimitive
Symbol.toStringTag
Symbol.unscopables
Symbol.iterator 对象的 Symbol.iterator属性，指向该对象的默认生成遍历器的方法。
```

#### 1.5 实例

##### 	1.5.1 消除魔术字符串

```js
  <script>
      const shapeOption = {
          // 保证值是独一无二的
          triangle : Symbol('Triangle'),
          rectangle: Symbol('Rectangle')
      }

    function getArea(shape, options){
        let area = 0;

        switch( shape ) {
            case 'Triangle':// 魔术字符串
                area = .5 * options.width * options.height;
                break;
                /* .... */
        }
        return area;
    }

    getArea( shapeOption.triangle, {width: 100, height: 100}) // 魔术字符串
</script>
```

##### 	1.5.2 实现私有属性

第一种方式： 用一个字符串或者下划线的方式

```js
<script>
    var Person = (function () {
        let _name = '_name'
        // 或者 let name = '****'
        function Person(name){
            this[_name] = name;
        }

        Person.prototype.getName = function(){
            return this[_name]
        }

        return Person
    })
</script>
```

缺点明显，不是真正的私有，依然可以遍历。

第二种方式：**闭包**

```js
 <script>
        var Person = (function () {
            function Person(name) {
                this.getName = function () {
                    return name;
                }
            }
            return Person
        }())
    </script>
```

真的私有了，但是任然存在缺点，实例之间无法共享方法（需要挂载原型链上），浪费内存空间

第三种方式： **Symbol**

```js
<script>
    var Person = (function(){
        var nameSymbol = Symbol('name');

        function Person(name){
            this[nameSymbol] = name;
        }

        Person.prototype.getName = function(){
            return this[nameSymbol]
        }

        return Person
    }())

    let a = new Person('cnyangx');
    console.log(a);
</script>
```

缺陷： 任然会被Object.getOwnPropertySymbols获取到属性，进而修改该属性对应的值

![1582666833270](E:\前端从入门到入坟教程\笔记\resouce\ES6\1582666833270.png)



## 2、Set和WeakSet

#### 2.1 - Set

​	ES6提供了**新的数据结构Set**，它类似于数组，但是成员的**值**都是**唯一的**，**没有重复的值**。需要记录不同成员的同时又不希望重复记录的情况下可以用到Set。



Set的实例属性：

```js
Set.prototype.size: 返回Set实例的成员总数
```

Set实例的方法分为两大类： 操作方法（用于操作数据）和遍历方法（用于遍历成员）

四个操作方法：

```js
Set.prototype.add(value): 添加某个值，返回Set结构本身，
Set.prototype.delete(value):删除某个值，返回一个布尔值，表示删除是否成功。
Set.prototype.has(value): 返回一个布尔值，表示该值是否为Set的成员。
Set.prototype.clear(value): 清楚所有成员，没有返回值。
```

```js
<script>
    // size 
    let a = new Set();	// 可以传入一个数组
    console.log(a.size);    // 0

    // add 
    a.add(1);
    console.log(a.size);    // 1
    a.add(1);
    console.log(a.size);    // 1

    a.add(2)
    a.add(3)

    console.log(a); // 1 2 3

    // delete
    a.delete(2);
    console.log(a); // 1 3

    // has 
    console.log(a.has(1));  // true

    // clear
    a.clear();
    console.log(a); // 
</script>
```

**由于Set中值不会重复，可以用Set来数组去重，**

```js
<script>
        console.log(NaN === NaN);
        
        // 使用indexOf缺点： 时间复杂度O(n^2) NaN 要做特殊处理
        function deduplication(arr) {
            let temp = [];
            for(let i = 0; i < arr.length; i++){
                if(temp.indexOf(arr[i]) === -1){
                    temp.push(arr[i])
                }
            }
            return temp;
        }

        let result = deduplication([NaN, NaN, 1, 2,2,1]);
        console.log(result);        // [NaN, NaN, 1, 2]


        // 使用对象解决性能问题 时间复杂度为O(n) 但是数组里不能又对象，也无法区分字符串和数字
        function deduplication2(arr) {
            let temp = {};
            for(let i = 0; i< arr.length; i++) {
                if(!temp[arr[i]]){
                    temp[arr[i]] = true;
                }
            }
            return Object.keys(temp)
        }
        let result2 = deduplication2([NaN, NaN, 1, 2,2,1]);
        console.log(result2);        // ["1", "2", "NaN"]

        // 使用set去重
        function deduplication3(arr) {
            let temp = [...(new Set(arr))];
            return temp;
        }
        let result3 = deduplication3([NaN, NaN, 1, 2,2,1]);
        console.log(result3);   // [NaN, 1, 2] 
    </script>
```



四个遍历方法：

```js
Set.prototype.keys()	: 	返回键名的遍历器
Set.prototype.values()	： 	返回键值的遍历器
Set.prototype.entries()		： 	返回键值对的遍历器
Set.prototype.forEach()		： 	使用回调函数遍历每个成员
```

注意： Set实例中key和value是一样的，所以 keyts() 和 values() 这两个方法的结果是一样的。

Set中查找某个值是否已经存在的时间复杂度是O(1), 而数组的indexof方法时间复杂度是O(n)， 又由于Set中值不会重复，所以可以使用Set做数组去重。

```js
<script>
        /* Set里面’数组‘没有索引概念  */
        var a = new Set([1,2,3,4]);
        a.add(5).add(3).add(7);

        // .keys()  返回键名 
        for(let key of a.keys()){
            console.log(key);
        }

        // .values()  返回键值
        for(let key2 of a.values()){
            console.log(key2);
        }
        
        // .entries()  返回键值对的遍历器
        for(let key3 of a.entries()){
            console.log(key3);  // [1, 1]  [2, 2] [3, 3]....
        }

        // .forEach()  使用函数回调遍历每个成员
       a.forEach((key4, value) => {
           console.log(key4, value);    // 1 1  2 2   3 3.....
       })
    </script>
```



#### 2.2  - WeakSet

WeakSet 结构与Set类似，也是不重复的值的集合。但是，它与Set有两个区别。

​	WeakSet的成员只能是对象，而不能是其他类型的值。

​	WeakSet中对象都是弱引用。

如果一个对象没有任何引用，那么此对象会尽快被垃圾回收，释放掉它占用的内存。

即垃圾回收机制不考虑WeakSet对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于WeakSet之中。

WeakSet 结构有以下三种方法：

```js
WeaSet.prototype.add(value)	 :  向WeakSet 实例添加一个新的成员。
WeaSet.prototype.delete(value)	 ： 清楚WeakSet实例的指定成员。
WeaSet.prototype.has(value)	 ： 返回一个布尔值，表示某个值是否在WeakSet实例之中。
```

**WeakSet不能遍历**，是因为成员都是弱引用，随时可能消失。

示例：

```js
<body>
    <div>div lalala </div>
    <script>
        let div = document.querySelector('div');
        /* let set = new Set();
        set.add(div);
        console.log(div);
        
        document.body.removeChild(div); // 因为是强引用，实际上没有删除，会造成内存溢出现象
        div = null; // dom对象仍在内存中, 因为Set中W仍然用此对象
        */

        let weakset = new WeakSet();
        weakset.add(div);

        document.body.removeChild(div);
        div = null; // dom对象已经没有引用，会被垃圾回收机制回收
    </script>
</body>
```



## 3、Map和weakMap

#### 3.1 -  Map

js的对象，本质上是键值对的集合（Hash结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。

为了解决这个问题，ES6提供了Map数据结构。 它类似于对象，也是键值对的集合，但是‘键’的范围不限于字符串，各种类型的值（包括对象）都可以当作键，是一种更完善的Hash结构实现。

生成Map实例：

```js
const map1 = new Map();
const map2 = new Map([
    ['name', '张三'],
    ['title', 'Author']
]);
```

Map的实例属性：

​	Map.prototype.size : 返回Map实例的成员总数。

Map实例的方法分为两大类： 操作方法（用于操作数据）和遍历方法（用于遍历成员）。

四个操作方法：

```js
Map.prototype.set(key, value) : 设置键名key对应的键值为value，然后返回整个Map结构。如果key已经有值，则键值会被更新，否则就新生成该键。
Map.prototype.get(key) : 读取key对应的键值，如果找不到key，返回undefined. 
Map.prototype.has(key) : 返回一个布尔值，表示某个键是否在当前Map对象中。
Map.prototype.delete(key) ： 删除某个键，返回true。如果删除失败，返回false。
Map.prototype.clear(key) ：清楚所有成员，没有返回值。 
```

```js
    <script>
        // 初始化Map实例
        const map1 = new Map();
        const map2 = new Map([
            ['name', '张三'],
            ['title', 'Author']
        ]);

        // size
        let a = new Map();
        console.log(a.size);    // 0
        a.set('name', 'cnyangx');
        console.log(a.size);    // 1
        
        // set 方法 传入键值对
        let b = new Map();
        b.set({}, 1);
        b.set(undefined, 1);
        b.set(1, 1);
        b.set('cnyangx', 1109);
        console.log(b);
        
        // get 方法
        console.log(b.get('cnyangx'));  // 1109

        // has 方法
        console.log(a.has('name')); // true

        // delete 方法
        console.log(b.delete(undefined));
        console.log(b);
        
        // clear() 方法
        a.clear();    // 该方法没有返回值，或者返回值为undefined 
        console.log(a);
    </script>
```

![1582732977529](E:\前端从入门到入坟教程\笔记\resouce\ES6\1582732977529.png)

四个遍历方法：

```js
<script>
    let b = new Map();
    b.set({}, 1);
    b.set(undefined, 1);
    b.set(1, 1);
    b.set('cnyangx', 1109);
    console.log(b);

    //  .keys(); 返回键名的遍历器
    for( let key of b.keys()){
        console.log(key);
    }

    // .values  // 返回键值
    for( let key of b.values()){
        console.log(key);
    }

    // .entries()   返回键值对
    for( let key of b.entries()){
        console.log(key);
    }

    // forEach  // 使用回调函数遍历每个成员
    b.forEach(( key, value) => {
        console.log(key, value);
    })
</script>
```

3.1.1 - 扩展对象

当我们有一系列对象，想记录每个对象的一种属性，假设有100只鸡，需要记录每只鸡的重量，有两种思路：

​	（1） - 想办法用笔写在鸡身上

​	（2） - 记录到一个文本上

```js
<script>
    class Chicken {
    }

    // 100 只鸡
    let chickenList = [];
    for (let i = 0; i < 100; i++){
        chickenList.push(new Chicken())
    }

    // 方法1： 记录到鸡身上
    chickenList.forEach( (chicken, index) => {
        Chicken.weight = getWeight(Chicken);
    })

    // 方法2： 记录到文本上
    let notebook = [];
    chickenList.forEach( function(chicken, index) {
        notebook[index] = getWeight(chicken);
    })
</script>

方法1的问题： 破坏鸡的卖相， 鸡的重量是会变的
方法2的问题： 无法一一对应，只能靠一些标记(索引)不靠谱
```



```js
// 使用Map完善私有属性的实现
var Person = (function(){
    var map = new Map();

    function Person(name, age){
        var privateProperty = {
            name : name,
            age : age
        }
        map.set(this.privateProperty);
    }

    Person.prototype.getName = function(){
        return map.get(this).name;
    };

    Person.prototype.getAge = function(){
        return map.get(this).age;
    };

    return Person;
}())
```

#### 3.2  - weakMap

与WeakSet类似，WeakMap与Map有两个区别：

​	WeakMap的键只能是对象，而不能是其它类型的值。

​	WeakMap中对键的引用是弱引用。

同样的，WeakMap不能遍历，因为成员都是弱引用，随时可能消失。

Weak Map只有四个方法可用： get()，set()， has()， delete()

注意： WeakMap弱引用的只是键名，而不是键值。键值依然是正常引用。

```js
const wm = new WeakMap();
let key = {};
let obj = {foo: 123};
wm.set(key, obj);
obj = null;
wm.get(key)
console.log(wm);
```

3.2.1 实例，完善私有属性的实现

前面基于Map的实现还存在一个问题L

当Person实例的外部引用消除时，闭包中的Map任然有Person实例作为键的引用，Person实例不会被垃圾回收，必须等到所有的

```js
    <script>
        var Person = (function(){
            var wm = new WeakMap();

            function Person(name){
                wm.set(this, name)
            }

            Person.prototype.getName = function(){
                return wm.get(this)
            };

            return Person;
        }());

        let cnyangx = new Person('cnyangx');
        let yangx = new Person('yangx');
        console.log(cnyangx.getName());	// cnyangx
        cnyangx = null;
        console.log(yangx);
    </script>
```





## 4、Proxy

在ES6之前，Object.defineProerty可以拦截对象属性的读取和修改操作，Proxy可以理解成比这个API更强大的，在目标对象之前架设一层的“拦截”。外界对该Proxy对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy这个次的愿意是代理，用在这里表示由他来“代理”某些操作，可以译为“代理器”。

注意： 只有对生成的Proxy实例操作才能起到拦截的作用。

生成Proxy实例：

```js
var proxy = new Proxy(target, handler)
```

targer: 需要代理的对象。

handler： 拦截函数的集合。

如果handler是空对象则代表任何操作都不会拦截

```js
    let obj = {
        a: 1
    };

    // handler 为空对象
    // let proxy = new Proxy(obj, {});
    // proxy.a = 1;
    // console.log(proxy);
    // console.log(obj.a);     // 1

    // 对属性的读取进行拦截
    let proxy = new Proxy(obj, {
        get(target, key, receiver) {
            return target.a + 100;
        },
    });
    console.log(obj);       // {a: 1}
    console.log(proxy.a);   // 101
    console.log(obj.a);     // 1
```



- **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
- **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值。
- **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
- **ownKeys(target)**：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，**返回一个数组**。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
- **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
- **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
- **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
- **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。、

```js
<script>
        // 参考阮一峰 ES6
        let obj = {};
        let func = function(){

        }

        let proxy = new Proxy(obj, {
            get(target, key, receiver){
                console.log('get拦截'+ key);
            },
            set(target, key, value, receiver) {
                console.log('set拦截' + key);
            },
            has(target, propKey) {
                console.log('has拦截' );
            },
            deleteProperty(target, propKey) {
                console.log('deleteProperty拦截' );
            },
            ownKeys(target) {
                console.log('ownKeys拦截');
                return []
            },
            getOwnPropertyDescriptor(target, propKey){
                console.log('getOwnPropertyDescriptor拦截');

            },
            defineProperty(target, propKey, propDesc){
                console.log('defineProperty拦截');
                return true;
            },
            preventExtensions(target){
                console.log('preventExtensions拦截');
            },
            getPrototypeOf(target){
                console.log('getPrototypeOf拦截');
                return {}
            },
            isExtensible(target){
                console.log('isExtensible拦截');
            },
            setPrototypeOf(target, proto){
                console.log('setPrototypeOf拦截');
                return true;
            },
            apply(target, object, args){
                console.log('apply拦截');
            },
            construct(target, args){
                console.log('construct拦截');
            },
        })

        console.log(proxy.a);
        let a = 1;
        console.log(a in proxy);    // has拦截  false
        Object.setPrototypeOf(proxy, {});   // setPrototypeOf拦截  
        // proxy();  // 代理函数时可以用 否则会报错
    </script>
```



Proxy给了开发者拦截语言默认行为的权限，可以不改变原有对象或函数的情况下， 轻松运用在很多场景。例如：统计函数调用次数，实现行营是数据观测（Vue 3.0), 实现不可变数据（Immutable)等等。

## 5、Reflect

`Reflect`对象与`Proxy`对象一样，也是 ES6 为了操作对象而提供的新 API。`Reflect`对象的设计目的有这样几个。

（1） 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。也就是说，从`Reflect`对象上可以拿到语言内部的方法。

（2） 修改某些`Object`方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。

```js
    <script>
        let target = {};
        let property = 'a';

        Object.defineProperty(target, property, {
            configurable: false,
            value: 1
        })

        // 老写法
        try {
            Object.defineProperty(target, property, {
                configurable: true,
            })
            // success
        } catch (e) {
            // failure
            console.log(e);
            /* 
            TypeError: Cannot redefine property: a
            at Function.defineProperty (<anonymous>)
            at 01-Reflect用法.html:20
        */
        }

        // 新写法
        console.log('jieguo : ', Reflect.defineProperty(target, property, {
            configurable: true,
        }));
        if(Reflect.defineProperty(target, property, {
            configurable:true
        })) {
            // success

        }else {
            console.log('Reflect 失败');
            
        }
        
    </script>
```

(3) 将命令式操作转变为函数调用，避免更多的保留字占用。比如 name in obj , 和 delete obj[name], 对应Reflect.has(obj.name) 和 Reflect.deleteProperty(obj.name)

```js
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assing')	// true
```

(4) Reflect对象的方法与Proxy对象的方法一一对应，想要调用默认行为，直接在Reflect上调用同名方法，简单可靠，省去人工默认行为的代码。

```js
    <script>
        let obj = {};

        let proxy = new Proxy(obj, {
            set: function(target, name, value, receiver) {
                // var success = Reflect.set(target, name, value, receiver);
                // target[name] = value;
                if (success) {
                    console.log('property' + name + 'on' + target + 'set to' + value);
                }
                return success;
            }
        })
        

        let func =function(){

        }
        func.apply = function(){
            console.log('apply');
            
        }

        Function.prototype.apply.call(func,{}, [])
        Reflect.apply(func, {}, [])
    </script>
```

Reflect有13个同名的静态方法。

## 6、Iterator

Iterator(遍历器，迭代器)是一个对象，Iterator对象需要包含一个next方法，该方法返回一个对象，此对象有两个属性，一个value表示当前结果，一个done表示是否可以继续迭代。

Iterator 的遍历过程是这样的。

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。

每一次调用`next`方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含`value`和`done`两个属性的对象。其中，`value`属性是当前成员的值，`done`属性是一个布尔值，表示遍历是否结束。

```js
<script>
    let it = makeIterator();
    function makeIterator(){
        var netIndex = 0;
        return {
            next: function(){
                return nextIndex < 5 ? {value: nextIndex++, done:false } : {value: undefined, done: true}
            }
        };
    }
</script>
```

ES6规定，如果数据结构的Symbol.iterator属性是一个方法，该方法返回Iterator对象，就可以认为此数据结构是“可遍历的”（iterable）

如果使用 TypeScript 的写法，遍历器接口（Iterable）、指针对象（Iterator）和`next`方法返回值的规格可以描述如下。

```js
interface Itrable {
    [Symbol.iterator](): Iterator,
}
interface Iterator {
    next(value ? : any) :ItreationResult,
}
    
interface InterationResult {
    value:any,
    done : boolean,
}
```

实例

```js
    <script>
        // let it = makeIterator();
        function makeIterator(){    // 返回一个遍历器对象
            var netIndex = 0;
            return {
                next : function(){
                    return nextIndex < 5 ? {value: nextIndex++, done:false } : {value: undefined, done: true}
                }
            };
        }

        let obj = {
            [Symbol.iterator]:makeIterator
        }
        console.log(obj);
        let a = obj[Symbol.iterator]
        console.log(a); // makeIterator(){    // 返回一个遍历器对象
        a();
        let it = a();
        it.next();
    </script>
```

**Iterator 的作用**有三个：

​	`一是为各种数据结构，提供一个统一的、简便的访问接口；`

​	`二是使得数据结构的成员能够按某种次序排列；`

​	`三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。`

原生具备 Iterator 接口的数据结构如下。

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

##### **调用 Iterator 接口的场合**

（1）解构赋值

（2）扩展运算符

（3）yield\*

（4）其他场合

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如`new Map([['a',1],['b',2]])`）
- Promise.all()
- Promise.race()

## 7、Generator

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。

Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

**执行 Generator 函数会返回一个遍历器对象**，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

形式上，Generator 函数是一个普通函数，但是有两个特征。一是，`function`关键字与函数名之间有一个星号；二是，函数体内部使用`yield`表达式，定义不同的内部状态（`yield`在英语里的意思就是“产出”）。

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```

上面代码定义了一个 Generator 函数`helloWorldGenerator`，它内部有两个`yield`表达式（`hello`和`world`），即该函数有三个状态：hello，world 和 return 语句（结束执行）。

yield本身没有返回值，yield的返回值是下一次next()函数传入的值。

所以next() 方法的作用有两个：

​	（1）执行本次yield到下一个yield之间的代码。

​	（2）将形参的值传给本次yield的返回值

next()和yield实现了函数内外控制权的转移



yield* 等同于遍历某个对象，并且yield每个结果



## 8、Async函数

async 函数是什么？一句话，它就是 Generator 函数的语法糖。

一比较就会发现，`async`函数就是将 Generator 函数的星号（`*`）替换成`async`，将`yield`替换成`await`，仅此而已。

`async`函数对 Generator 函数的改进，体现在以下四点。

**（1）内置执行器。**

Generator 函数的执行必须靠执行器，所以才有了`co`模块，而`async`函数自带执行器。也就是说，`async`函数的执行，与普通函数一模一样，只要一行。

```javascript
asyncReadFile();
```

上面的代码调用了`asyncReadFile`函数，然后它就会自动执行，输出最后结果。这完全不像 Generator 函数，需要调用`next`方法，或者用`co`模块，才能真正执行，得到最后结果。

**（2）更好的语义。**

`async`和`await`，比起星号和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。

**（3）更广的适用性。**

`co`模块约定，`yield`命令后面只能是 Thunk 函数或 Promise 对象，而`async`函数的`await`命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。

**（4）返回值是 Promise。**

`async`函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用`then`方法指定下一步的操作。

进一步说，`async`函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而`await`命令就是内部`then`命令的语法糖。



#### 8.1 - await

正常情况下，`await`命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。



#### 8.2 - 错误处理 

如果`await`后面的异步操作出错，那么等同于`async`函数返回的 Promise 对象被`reject`。



#### 8.3 - 使用注意点

第一点，前面已经说过，`await`命令后面的`Promise`对象，运行结果可能是`rejected`，所以最好把`await`命令放在`try...catch`代码块中。

第二点，多个`await`命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。

第三点，`await`命令只能用在`async`函数之中，如果用在普通函数，就会报错。

第四点，async 函数可以保留运行堆栈。

#### 8.4 - async 函数的实现原理

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。







