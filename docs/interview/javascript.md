# JavaScript

## JavaScript 的数据类型

- 基本数据类型：`Number`、`String`、`Boolean`、`Undefined`、`Null`、`Symbol`、`BigInt`
- 引用数据类型：`Object`

## script 标签 defer 和 async 的区别

- 相同点：`async` 和 `defer` 下载都不会阻塞 HTML 解析
- 不同点：`async` 下载完成后立即执行，不会等待 HTML 解析完成；`defer` 会等待 HTML 解析完成再执行

![](./images/javascript/legend.svg)

**`<script>`**

![script](./images/javascript/script.svg)

**`<script async>`**

![script async](./images/javascript/script-async.svg)

**`<script defer>`**

![script defer](./images/javascript/script-defer.svg)

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

## Cookie、SessionStorage 与 LocalStorage 的区别

|                | Cookie                                                                              | SessionStorage                                     | LocalStorage       |
| -------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------ |
| 数据的生命周期 | 一般由服务器生成，可设置失效时间。如果在浏览器端生成 Cookie，默认是关闭浏览器后失效 | 仅在当前会话下有效，关闭页面或浏览器后被清除       | 永久（除非被清除） |
| 存放数据大小   | 4k 左右                                                                             | 一般为 5MB                                         | 同 SessionStorage  |
| 与服务器端通信 | 每次都会携带在 HTTP 头中，如果使用 cookie 保存过多数据会带来性能问题                | 仅在客户端（即浏览器）中保存，不参与和服务器的通信 | 同 SessionStorage  |

## 如何理解 JS 的异步？

JS 是一门单线程的语言，这是因为他运行在浏览器的渲染主线程中，而渲染主线程只有一个

渲染主线程承担着诸多的工作，渲染页面，执行 JS 都在其中运行

如果使用同步的方式，就极有可能导致主线程阻塞，从而导致消息队列中的很多其他任务无法得到执行，这样一来，一方面会导致繁忙的主线程白白消耗时间，另一方面导致页面无法及时更新，给用户造成卡死现象

所以浏览器采用异步的方式来避免，具体做法是当某些任务发生时，比如计时器，网络，事件监听，主线程将任务交给其他线程去处理，自身立即结束任务的执行，转而执行后续代码，当其他线程完成时，将事先传递的回调函数包装成任务，加入到消息队列的末尾排队，等待主线程调度执行

在这种异步模式下，浏览器永不阻塞，从而最大限度的保证了单线程的流畅运行

## 阐述一下 JS 的事件循环

事件循环又叫做消息循环，是浏览器渲染主线程的工作方式

在 Chrome 的源码中，它开启了一个不会结束的 for 循环，每次循环从消息队列中取出第一个任务执行，而其他线程只需要在合适的时候将任务加入到队列末尾即可

过去把消息队列简单分为宏队列和微队列，这种说法目前已无法满足复杂的浏览器环境，取而代之的是一种更加灵活多变的处理方式

根据 W3C 官方的解释，每个任务有不同的类型，同类型的任务必须在同一个队列，不同类型的任务可以属于不同的队列，不同任务队列有不同的优先级，在一次事件循环中，由浏览器自行决定取哪一个队列的任务，但浏览器必须有一个微队列，微队列的任务一定有最高的优先级，必须优先调度执行
