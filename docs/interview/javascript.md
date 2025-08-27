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

### 一道面试题

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeOut");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});

console.log("script end");
```

::: details 运行结果

```js
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeOut
```

:::

### 同步任务和异步任务

因为 JavaScript 是单线程运行的，所有的任务只能在主线程上排队执行；但是如果某个任务特别耗时，比如 Ajax 请求一个接口，可能 1s 返回结果，也可能 10s 才返回，有很多的不确定因素（网络延迟等）；如果这些任务也放到主线程中去，那么会阻塞浏览器（用户除了等，不能进行其他操作）。

于是，浏览器就把这些任务分派到异步任务队列中去。先来看简单的例子来理解一下同步和异步任务：

```js
console.log("start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

console.log("end");
```

当主线程执行到 `setTimeout` 的时候，虽然是延迟了 0s，但是并不会马上来运行，而是放到异步任务队列中，等下面的同步任务队列执行完了，再来执行异步队列中的任务，所以运行结果是：start、end、setTimeout。

但如果同步任务中有特别耗时的操作，阻塞了 `setTimeout` 的定时执行，那么 `setTimeout` 就不会按时来完成。来看下面的例子：

```js
console.log("start");
console.time("now");
let list = [];

setTimeout(function () {
  console.timeEnd("now");
}, 1000);

for (let i = 0; i < 9999999; i++) {
  let now = new Date();
  list.push(i);
}
```

虽然我们让 `setTimeout` 1s 后执行，但是 for 循环占用了太多的线程资源，实际执行会在 2s 后。所以事件循环的流程大致如下：

1. 所有任务都在主线程上执行，形成一个执行栈。
2. 主线程发现有异步任务，就在“任务队列”之中加入一个任务事件。
3. 一旦“执行栈”中的所有同步任务执行完毕，系统就会读取“任务队列”（先进先出原则）。那些对应的异步任务，结束等待状态，进入执行栈并开始执行。
4. 主线程不断重复上面的第三步，这样的一个循环称为事件循环。

### 宏任务与微任务

如果任务队列中有多个异步任务，那么先执行哪个任务呢？于是在异步任务中，也进行了等级划分，分为宏任务（macrotask）和微任务（microtask）；不同的 API 注册的任务会依次进入自身对应的队列中，然后等待事件循环将它们依次压入执行栈中执行。

宏任务包括：

- script(整体代码)
- setTimeout, setInterval, setImmediate,
- I/O
- UI rendering

微任务包括：

- process.nextTick
- Promise
- MutationObserver

我们可以把整体的 JS 代码也看成是一个宏任务，主线程也是从宏任务开始的。我们把上面事件循环的步骤更新一下：

1. 执行一个宏任务
2. 执行过程中如果遇到微任务就加入微任务队列，遇到宏任务就加入宏任务队列
3. 宏任务执行完毕后，检查当前微任务队列，如果有，就依次执行（一轮事件循环结束）
4. 开始下一个宏任务
