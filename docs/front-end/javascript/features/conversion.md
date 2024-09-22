# 数据类型的转换

## 强制转换

### Number()

下面分成两种情况讨论，一种是参数是原始类型的值，另一种是参数是对象

**（1）原始类型值**

```js
// 数值：转换后还是原来的值
Number(324); // 324

// 字符串：如果可以被解析为数值，则转换为相应的数值
Number("324"); // 324

// 字符串：如果不可以被解析为数值，返回 NaN
Number("324abc"); // NaN

// 空字符串转为0
Number(""); // 0

// 布尔值：true 转成 1，false 转成 0
Number(true); // 1
Number(false); // 0

// undefined：转成 NaN
Number(undefined); // NaN

// null：转成0
Number(null); // 0
```

**（2）对象**

```js
Number({ a: 1 }); // NaN
Number([1, 2, 3]); // NaN
Number([5]); // 5
```

之所以会这样，是因为 `Number` 背后的转换规则比较复杂

第一步，调用对象自身的 `valueOf` 方法。如果返回原始类型的值，则直接对该值使用 `Number` 函数，不再进行后续步骤

第二步，如果 `valueOf` 方法返回的还是对象，则改为调用对象自身的 `toString` 方法。如果 `toString` 方法返回原始类型的值，则对该值使用 `Number` 函数，不再进行后续步骤

第三步，如果 `toString` 方法返回的是对象，就报错

`valueOf` 和 `toString` 方法，都是可以自定义的

```js
Number({
  valueOf: function () {
    return 2;
  },
});
// 2

Number({
  toString: function () {
    return 3;
  },
});
// 3

Number({
  valueOf: function () {
    return 2;
  },
  toString: function () {
    return 3;
  },
});
// 2
```
