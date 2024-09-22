# Object 对象

## 概述

`Object` 对象的原生方法分成两类：`Object` 本身的方法与 `Object` 的实例方法

**（1）`Object` 对象本身的方法**

所谓“本身的方法”就是直接定义在 `Object` 对象的方法

```js
Object.print = function (o) {
  console.log(o);
};
```

**（2）`Object` 的实例方法**

所谓实例方法就是定义在 `Object` 原型对象 `Object.prototype` 上的方法。它可以被 `Object` 实例直接使用

```js
Object.prototype.print = function () {
  console.log(this);
};

var obj = new Object();
obj.print(); // Object
```

## Object()

`Object` 本身是一个函数，可以当作工具方法使用，将任意值转为对象。这个方法常用于保证某个值一定是对象

参数为空、`undefined`、`null`，`Object()` 返回一个空对象

```js
var obj = Object();
var obj = Object(undefined);
var obj = Object(null);

obj instanceof Object; // true
```

参数是原始类型，`Object()` 将其转为对应的包装对象的实例

```js
var obj = Object(1);
obj instanceof Object; // true
obj instanceof Number; // true

var obj = Object("foo");
obj instanceof Object; // true
obj instanceof String; // true

var obj = Object(true);
obj instanceof Object; // true
obj instanceof Boolean; // true
```

参数是一个对象，它总是返回该对象，即不用转换

```js
var arr = [];
var obj = Object(arr); // 返回原数组
obj === arr; // true

var value = {};
var obj = Object(value); // 返回原对象
obj === value; // true

var fn = function () {};
var obj = Object(fn); // 返回原函数
obj === fn; // true
```

利用这一点，可以写一个判断变量是否为对象的函数

```js
function isObject(value) {
  return value === Object(value);
}

isObject([]); // true
isObject(true); // false
```

## Object 构造函数

`Object` 不仅可以当作工具函数使用，还可以当作构造函数使用，即前面可以使用 `new` 命令

`Object` 构造函数的首要用途，是直接通过它来生成新对象

```js
var obj = new Object();
```

> 注意，通过 `var obj = new Object()` 的写法生成新对象，与字面量的写法 `var obj = {}` 是等价的。或者说，后者只是前者的一种简便写法

`Object` 构造函数的用法与工具方法很相似，几乎一模一样

```js
var o1 = { a: 1 };
var o2 = new Object(o1);
o1 === o2; // true

var obj = new Object(123);
obj instanceof Number; // true
```

虽然用法相似，但是 `Object(value)` 与 `new Object(value)` 两者的语义是不同的，`Object(value)` 表示将 `value` 转成一个对象，`new Object(value)` 则表示新生成一个对象，它的值是 `value`

## Object 的静态方法

所谓“静态方法”，是指部署在 `Object` 对象自身的方法

### Object.keys()，Object.getOwnPropertyNames()

`Object.keys` 方法和 `Object.getOwnPropertyNames` 方法都用来遍历对象的属性

`Object.keys` 方法的参数是一个对象，返回一个数组。该数组的成员都是该对象自身的（而不是继承的）所有属性名，`Object.getOwnPropertyNames` 方法与 `Object.keys` 类似

```js
var obj = {
  p1: 123,
  p2: 456,
};

Object.keys(obj); // ["p1", "p2"]
Object.getOwnPropertyNames(obj); // ["p1", "p2"]
```

对于一般的对象来说，`Object.keys()` 和 `Object.getOwnPropertyNames()` 返回的结果是一样的。只有涉及不可枚举属性时，才会有不一样的结果。`Object.keys` 方法只返回可枚举的属性，`Object.getOwnPropertyNames` 方法还返回不可枚举的属性名

```js
var a = ["Hello", "World"];

Object.keys(a); // ["0", "1"]
Object.getOwnPropertyNames(a); // ["0", "1", "length"]
```

由于 JavaScript 没有提供计算对象属性个数的方法，所以可以用这两个方法代替

```js
var obj = {
  p1: 123,
  p2: 456,
};

Object.keys(obj).length; // 2
Object.getOwnPropertyNames(obj).length; // 2
```

一般情况下，几乎总是使用 `Object.keys` 方法，遍历对象的属性

### 其他方法

**（1）对象属性模型的相关方法**

- `Object.getOwnPropertyDescriptor()`：获取某个属性的描述对象
- `Object.defineProperty()`：通过描述对象，定义某个属性
- `Object.defineProperties()`：通过描述对象，定义多个属性

**（2）控制对象状态的方法**

- `Object.preventExtensions()`：防止对象扩展
- `Object.isExtensible()`：判断对象是否可扩展
- `Object.seal()`：禁止对象配置
- `Object.isSealed()`：判断一个对象是否可配置
- `Object.freeze()`：冻结一个对象
- `Object.isFrozen()`：判断一个对象是否被冻结

**（3）原型链相关方法**

- `Object.create()`：该方法可以指定原型对象和属性，返回一个新的对象
- `Object.getPrototypeOf()`：获取对象的 `Prototype` 对象

## Object 的实例方法

### Object.prototype.valueOf()

`valueOf` 方法的作用是返回一个对象的“值”，默认情况下返回对象本身

```js
var obj = new Object();
obj.valueOf() === obj; // true
```

`valueOf` 方法的主要用途是，JavaScript 自动类型转换时会默认调用这个方法

```js
var obj = new Object();
1 + obj; // "1[object Object]"
```

如果自定义 `valueOf` 方法，就可以得到想要的结果

```js
var obj = new Object();
obj.valueOf = function () {
  return 2;
};

1 + obj; // 3
```

### Object.prototype.toString()

`toString` 方法的作用是返回一个对象的字符串形式，默认情况下返回类型字符串

```js
var o1 = new Object();
o1.toString(); // "[object Object]"

var o2 = { a: 1 };
o2.toString(); // "[object Object]"
```

字符串 `[object Object]` 本身没有太大的用处，但是通过自定义 `toString` 方法，可以让对象在自动类型转换时，得到想要的字符串形式

```js
var obj = new Object();

obj.toString = function () {
  return "hello";
};

obj + " " + "world"; // "hello world"
```

数组、字符串、函数、Date 对象都分别部署了自定义的 `toString` 方法，覆盖了 `Object.prototype.toString` 方法

```js
[1, 2, 3].toString(); // "1,2,3"

"123".toString(); // "123"

(function () {
  return 123;
}).toString();
// "function () {
//   return 123;
// }"

new Date().toString();
// "Tue May 10 2016 09:11:31 GMT+0800 (CST)"
```

### toString() 的应用：判断数据类型

`Object.prototype.toString` 方法返回对象的类型字符串，因此可以用来判断一个值的类型

```js
var obj = {};
obj.toString(); // "[object Object]"
```

由于实例对象可能会自定义 `toString` 方法，覆盖掉 `Object.prototype.toString` 方法，所以为了得到类型字符串，最好直接使用 `Object.prototype.toString` 方法。通过函数的 `call` 方法，可以在任意值上调用这个方法，帮助我们判断这个值的类型

```js
Object.prototype.toString.call(value);
```

不同数据类型的 `Object.prototype.toString` 方法返回值如下

- 数值：返回 `[object Number]`
- 字符串：返回 `[object String]`
- 布尔值：返回 `[object Boolean]`
- undefined：返回 `[object Undefined]`
- null：返回 `[object Null]`
- 数组：返回 `[object Array]`
- arguments 对象：返回 `[object Arguments]`
- 函数：返回 `[object Function]`
- Error 对象：返回 `[object Error]`
- Date 对象：返回 `[object Date]`
- RegExp 对象：返回 `[object RegExp]`
- 其他对象：返回 `[object Object]`

```js
Object.prototype.toString.call(2); // "[object Number]"
Object.prototype.toString.call(""); // "[object String]"
Object.prototype.toString.call(true); // "[object Boolean]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(Math); // "[object Math]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call([]); // "[object Array]"
```

利用这个特性，可以写出一个比 `typeof` 运算符更准确的类型判断函数

```js
var type = function (o) {
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

type({}); // "object"
type([]); // "array"
type(5); // "number"
type(null); // "null"
type(); // "undefined"
type(/abcd/); // "regex"
type(new Date()); // "date"
```

在上面这个 `type` 函数的基础上，还可以加上专门判断某种类型数据的方法

```js
var type = function (o) {
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

[
  "Null",
  "Undefined",
  "Object",
  "Array",
  "String",
  "Number",
  "Boolean",
  "Function",
  "RegExp",
].forEach(function (t) {
  type["is" + t] = function (o) {
    return type(o) === t.toLowerCase();
  };
});

type.isObject({}); // true
type.isNumber(NaN); // true
type.isRegExp(/abc/); // true
```

### Object.prototype.toLocaleString()

`Object.prototype.toLocaleString` 方法与 `toString` 的返回结果相同，也是返回一个值的字符串形式

```js
var obj = {};
obj.toString(obj); // "[object Object]"
obj.toLocaleString(obj); // "[object Object]"
```

这个方法的主要作用是留出一个接口，让各种不同的对象实现自己版本的 `toLocaleString`，用来返回针对某些地域的特定的值

```js
var person = {
  toString: function () {
    return "Henry Norman Bethune";
  },
  toLocaleString: function () {
    return "白求恩";
  },
};

person.toString(); // Henry Norman Bethune
person.toLocaleString(); // 白求恩
```

目前，主要有三个对象自定义了 `toLocaleString` 方法

- Array.prototype.toLocaleString()
- Number.prototype.toLocaleString()
- Date.prototype.toLocaleString()

举例来说，日期的实例对象的 `toString` 和 `toLocaleString` 返回值就不一样，而且 `toLocaleString` 的返回值跟用户设定的所在地域相关

```js
var date = new Date();
date.toString(); // "Tue Jan 01 2018 12:01:33 GMT+0800 (CST)"
date.toLocaleString(); // "1/01/2018, 12:01:33 PM"
```

### Object.prototype.hasOwnProperty()

`Object.prototype.hasOwnProperty` 方法接受一个字符串作为参数，返回一个布尔值，表示该实例对象自身是否具有该属性

```js
var obj = {
  p: 123,
};

obj.hasOwnProperty("p"); // true
obj.hasOwnProperty("toString"); // false
```
