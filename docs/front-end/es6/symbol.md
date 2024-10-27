# Symbol

Symbol 值通过 `Symbol()` 函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突

```js
let s = Symbol();

typeof s;
// "symbol"
```

注意，`Symbol()` 函数前不能使用 `new` 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象，所以不能使用 `new` 命令来调用。另外，由于 Symbol 值不是对象，所以也不能添加属性。基本上，它是一种类似于字符串的数据类型

`Symbol()` 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述。这主要是为了在控制台显示，或者转为字符串时，比较容易区分

```js
let s1 = Symbol("foo");
let s2 = Symbol("bar");

s1; // Symbol(foo)
s2; // Symbol(bar)

s1.toString(); // "Symbol(foo)"
s2.toString(); // "Symbol(bar)"
```

如果 Symbol 的参数是一个对象，就会调用该对象的 `toString()` 方法，将其转为字符串，然后才生成一个 Symbol 值

```js
const obj = {
  toString() {
    return "abc";
  },
};
const sym = Symbol(obj);
sym; // Symbol(abc)
```

注意，`Symbol()` 函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的 Symbol 函数的返回值是不相等的

```js
let s1 = Symbol("foo");
let s2 = Symbol("foo");

s1 === s2; // false
```

Symbol 值不能与其他类型的值进行运算，会报错

```js
let sym = Symbol("My symbol");

"your symbol is " + sym;
// TypeError: can't convert symbol to string
`your symbol is ${sym}`;
// TypeError: can't convert symbol to string
```

但是，Symbol 值可以显式转为字符串

```js
let sym = Symbol("My symbol");

String(sym); // 'Symbol(My symbol)'
```

另外，Symbol 值也可以转为布尔值，但是不能转为数值

```js
let sym = Symbol();
Boolean(sym); // true
!sym; // false

if (sym) {
  // ...
}

Number(sym); // TypeError
sym + 2; // TypeError
```
