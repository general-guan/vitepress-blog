# JavaScript

## script 标签 defer 和 async 的区别

> 相同点：`async` 和 `defer` 下载都不会阻塞 HTML 解析
> 不同点：`async` 下载完成后立即执行，不会等待 HTML 解析完成；`defer` 会等待 HTML 解析完成再执行

<!-- ![](/images/front-end/interview/javascript/legend.svg) -->

**`<script>`**

<!-- ![script](/images/front-end/interview/javascript/script.svg) -->

**`<script async>`**

<!-- ![script async](/images/front-end/interview/javascript/script-async.svg) -->

**`<script defer>`**

<!-- ![script defer](/images/front-end/interview/javascript/script-defer.svg) -->

## Object.is() 与比较运算符 ==、=== 的区别

- 双等号（`==`）：如果两边的类型不一致，则会进行强制类型转换后再进行比较
- 三等号（`===`）：如果两边的类型不一致时，不会做强制类型转换，直接返回 `false`
- `Object.is()`：一般情况下和三等号的判断相同，只有两个不同点

```js
NaN === NaN; // false
-0 === +0; // true

Object.is(NaN, NaN); // true
Object.is(-0, 0); // false
```

## 判断数组的方式有哪些

`Object.prototype.toString.call()`

```js
Object.prototype.toString.call(obj).slice(8, -1) === "Array";
```

`Array.isArray()`

```js
Array.isArray(obj);
```

`instanceof` / `Array.prototype.isPrototypeOf`

```js
obj instanceof Array;
Array.prototype.isPrototypeOf(obj);
```
