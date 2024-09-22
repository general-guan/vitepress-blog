# 比较运算符

## 相等运算符

相等运算符用来比较**相同类型**的数据时，与严格相等运算符完全一样

```js
1 == 1.0;
// 等同于
1 === 1.0;
```

比较**不同类型**的数据时，相等运算符会先将数据进行类型转换，然后再用严格相等运算符比较

**（1）原始类型值**

原始类型的值会转换成数值再进行比较

```js
1 == true; // true
// 等同于 1 === Number(true)

0 == false; // true
// 等同于 0 === Number(false)

"true" == true; // false
// 等同于 Number('true') === Number(true)
// 等同于 NaN === 1

"" == 0; // true
// 等同于 Number('') === 0
// 等同于 0 === 0

"" == false; // true
// 等同于 Number('') === Number(false)
// 等同于 0 === 0

"1" == true; // true
// 等同于 Number('1') === Number(true)
// 等同于 1 === 1
```

**（2）对象与原始类型值比较**

对象（这里指广义的对象，包括数组和函数）与原始类型的值比较时，对象转换成原始类型的值，再进行比较

具体来说，先调用对象的 `valueOf()` 方法，如果得到原始类型的值，就按照上一小节的规则，互相比较；如果得到的还是对象，则再调用 `toString()` 方法，得到字符串形式，再进行比较

```js
// 数组与数值的比较
[1] == 1; // true

// 数组与字符串的比较
[1] == "1"; // true
[1, 2] == "1,2"; // true

// 对象与布尔值的比较
[1] == true; // true
[2] == true; // false
```

下面是一个更直接的例子

```js
const obj = {
  valueOf: function () {
    console.log("执行 valueOf()");
    return obj;
  },
  toString: function () {
    console.log("执行 toString()");
    return "foo";
  },
};

obj == "foo";
// 执行 valueOf()
// 执行 toString()
// true
```

**（3）undefined 和 null**

`undefined` 和 `null` 只有与自身比较，或者互相比较时，才会返回 `true`；与其他类型的值比较时，结果都为 `false`

```js
undefined == undefined; // true
null == null; // true
undefined == null; // true

false == null; // false
false == undefined; // false

0 == null; // false
0 == undefined; // false
```
