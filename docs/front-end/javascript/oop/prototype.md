# 对象的继承

![JavaScript Object Layout](./images/javascript-object-layout.jpg)

## 原型对象概述

### 构造函数的缺点

JavaScript 通过构造函数生成新对象，因此构造函数可以视为对象的模板。实例对象的属性和方法，可以定义在构造函数内部

```js
function Cat(name, color) {
  this.name = name;
  this.color = color;
}

var cat1 = new Cat("大毛", "白色");

cat1.name; // '大毛'
cat1.color; // '白色'
```

通过构造函数为实例对象定义属性，虽然很方便，但是有一个缺点。同一个构造函数的多个实例之间，无法共享属性，从而造成对系统资源的浪费

```js
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.meow = function () {
    console.log("喵喵");
  };
}

var cat1 = new Cat("大毛", "白色");
var cat2 = new Cat("二毛", "黑色");

cat1.meow === cat2.meow;
// false
```

上面代码中，`cat1` 和 `cat2` 是同一个构造函数的两个实例，它们都具有 `meow` 方法。由于 `meow` 方法是生成在每个实例对象上面，所以两个实例就生成了两次。也就是说，每新建一个实例，就会新建一个 `meow` 方法。这既没有必要，又浪费系统资源，因为所有 `meow` 方法都是同样的行为，完全应该共享

这个问题的解决方法，就是 JavaScript 的原型对象（prototype）

### prototype 属性的作用

JavaScript 继承机制的设计思想就是，原型对象的所有属性和方法，都能被实例对象共享。也就是说，如果属性和方法定义在原型上，那么所有实例对象就能共享，不仅节省了内存，还体现了实例对象之间的联系

JavaScript 规定，每个函数都有一个 prototype 属性，指向一个对象

```js
function f() {}
typeof f.prototype; // "object"
```

对于普通函数来说，该属性基本无用。但是，对于构造函数来说，生成实例的时候，该属性会自动成为实例对象的原型

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.color = "white";

var cat1 = new Animal("大毛");
var cat2 = new Animal("二毛");

cat1.color; // 'white'
cat2.color; // 'white'
```

如果实例对象自身就有某个属性或方法，它就不会再去原型对象寻找这个属性或方法

```js
cat1.color = "black";

cat1.color; // 'black'
cat2.color; // 'yellow'
Animal.prototype.color; // 'yellow';
```

总结一下，原型对象的作用，就是定义所有实例对象共享的属性和方法。这也是它被称为原型对象的原因，而实例对象可以视作从原型对象衍生出来的子对象

### 原型链

JavaScript 规定，所有对象都有自己的原型对象（prototype）。一方面，任何一个对象，都可以充当其他对象的原型；另一方面，由于原型对象也是对象，所以它也有自己的原型。因此，就会形成一个“原型链”（prototype chain）：对象到原型，再到原型的原型……

如果一层层地上溯，所有对象的原型最终都可以上溯到 `Object.prototype`。也就是说，所有对象都继承了 `Object.prototype` 的属性。这就是所有对象都有 `valueOf` 和 `toString` 方法的原因，因为这是从 `Object.prototype` 继承的

那么，`Object.prototype` 对象有没有它的原型呢？回答是 `Object.prototype` 的原型是 `null`

读取对象的某个属性时，JavaScript 引擎先寻找对象本身的属性，如果找不到，就到它的原型去找，如果还是找不到，就到原型的原型去找。如果直到最顶层的 `Object.prototype` 还是找不到，则返回 `undefined`。如果对象自身和它的原型，都定义了一个同名属性，那么优先读取对象自身的属性，这叫做“覆盖”（overriding）

注意，一级级向上，在整个原型链上寻找某个属性，对性能是有影响的。所寻找的属性在越上层的原型对象，对性能的影响越大。如果寻找某个不存在的属性，将会遍历整个原型链

```js
Object.getPrototypeOf(Object.prototype);
// null
```

举例来说，如果让构造函数的 `prototype` 属性指向一个数组，就意味着实例对象可以调用数组方法

```js
var MyArray = function () {};

MyArray.prototype = new Array();
MyArray.prototype.constructor = MyArray;

var mine = new MyArray();
mine.push(1, 2, 3);
mine.length; // 3
mine instanceof Array; // true
```

### constructor 属性

`prototype` 对象有一个 `constructor` 属性，默认指向 `prototype` 对象所在的构造函数

```js
function P() {}
P.prototype.constructor === P; // true
```

由于 `constructor` 属性定义在 `prototype` 对象上面，意味着可以被所有实例对象继承

```js
function P() {}
var p = new P();

p.constructor === P; // true
p.constructor === P.prototype.constructor; // true
p.hasOwnProperty("constructor"); // false
```

`constructor` 属性的作用是，可以得知某个实例对象，到底是哪一个构造函数产生的

```js
function F() {}
var f = new F();

f.constructor === F; // true
f.constructor === RegExp; // false
```

另一方面，有了 `constructor` 属性，就可以从一个实例对象新建另一个实例

```js
function Constr() {}
var x = new Constr();

var y = new x.constructor();
y instanceof Constr; // true
```

`constructor` 属性表示原型对象与构造函数之间的关联关系，如果修改了原型对象，一般会同时修改 `constructor` 属性，防止引用的时候出错

```js
function Person(name) {
  this.name = name;
}

Person.prototype.constructor === Person; // true

Person.prototype = {
  method: function () {},
};

Person.prototype.constructor === Person; // false
Person.prototype.constructor === Object; // true
```

所以，修改原型对象时，一般要同时修改 `constructor` 属性的指向

```js
// 坏的写法
C.prototype = {
  method1: function (...) { ... },
  // ...
};

// 好的写法
C.prototype = {
  constructor: C,
  method1: function (...) { ... },
  // ...
};

// 更好的写法
C.prototype.method1 = function (...) { ... };
```

如果不能确定 `constructor` 属性是什么函数，还有一个办法：通过 `name` 属性，从实例得到构造函数的名称

```js
function Foo() {}
var f = new Foo();
f.constructor.name; // "Foo"
```

## instanceof 运算符

`instanceof` 运算符返回一个布尔值，表示对象是否为某个构造函数的实例

```js
var v = new Vehicle();
v instanceof Vehicle; // true
```

`instanceof` 运算符的左边是实例对象，右边是构造函数。它会检查右边构造函数的原型对象（prototype），是否在左边对象的原型链上。因此，下面两种写法是等价的

```js
v instanceof Vehicle;
// 等同于
Vehicle.prototype.isPrototypeOf(v);
```

上面代码中，`Vehicle` 是对象 `v` 的构造函数，它的原型对象是 `Vehicle.prototype`，`isPrototypeOf()` 方法是 JavaScript 提供的原生方法，用于检查某个对象是否为另一个对象的原型

由于 `instanceof` 检查整个原型链，因此同一个实例对象，可能会对多个构造函数都返回 `true`

```js
var d = new Date();
d instanceof Date; // true
d instanceof Object; // true
```

`instanceof` 的原理是检查右边构造函数的 `prototype` 属性，是否在左边对象的原型链上。有一种特殊情况，就是左边对象的原型链上，只有 `null` 对象。这时，`instanceof` 判断会失真

```js
var obj = Object.create(null);
typeof obj; // "object"
obj instanceof Object; // false
```

上面代码中，`Object.create(null)` 返回一个新对象 `obj`，它的原型是 `null`。右边的构造函数 `Object` 的 `prototype` 属性，不在左边的原型链上，因此 `instanceof` 就认为 `obj` 不是 `Object` 的实例。这是唯一的 `instanceof` 运算符判断会失真的情况（一个对象的原型是 `null`）

`instanceof` 运算符的一个用处，是判断值的类型

```js
var x = [1, 2, 3];
var y = {};
x instanceof Array; // true
y instanceof Object; // true
```

注意，`instanceof` 运算符只能用于对象，不适用原始类型的值

```js
var s = "hello";
s instanceof String; // false
```

此外，对于 `undefined` 和 `null`，`instanceof` 运算符总是返回 `false`

```js
undefined instanceof Object; // false
null instanceof Object; // false
```

利用 `instanceof` 运算符，还可以巧妙地解决，调用构造函数时，忘了加 `new` 命令的问题

```js
function Fubar(foo, bar) {
  if (this instanceof Fubar) {
    this._foo = foo;
    this._bar = bar;
  } else {
    return new Fubar(foo, bar);
  }
}
```
