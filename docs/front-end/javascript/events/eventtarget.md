# EventTarget 接口

## 概述

DOM 节点的事件操作（监听和触发），都定义在 `EventTarget` 接口。所有节点对象都部署了这个接口，其他一些需要事件通信的浏览器内置对象（比如，`XMLHttpRequest`、`AudioNode`、`AudioContext`）也部署了这个接口

该接口主要提供三个实例方法

- `addEventListener()`：绑定事件的监听函数
- `removeEventListener()`：移除事件的监听函数
- `dispatchEvent()`：触发事件

## EventTarget.addEventListener()

`EventTarget.addEventListener()` 用于在当前节点或对象上（即部署了 EventTarget 接口的对象），定义一个特定事件的监听函数。一旦这个事件发生，就会执行监听函数。该方法没有返回值

```js
target.addEventListener(type, listener[, useCapture]);
```

该方法接受三个参数

- `type`：事件名称，大小写敏感
- `listener`：监听函数。事件发生时，会调用该监听函数
- `useCapture`：布尔值，如果设为 `true`，表示监听函数将在捕获阶段（capture）触发。该参数可选，默认值为 `false`（监听函数只在冒泡阶段被触发）

下面是一个例子

```js
function hello() {
  console.log("Hello world");
}

var button = document.getElementById("btn");
button.addEventListener("click", hello, false);
```

关于参数，有两个地方需要注意

首先，第二个参数除了监听函数，还可以是一个具有`handleEvent`方法的对象，效果与监听函数一样

```js
buttonElement.addEventListener("click", {
  handleEvent: function (event) {
    console.log("click");
  },
});
```

其次，第三个参数除了布尔值 `useCapture`，还可以是一个监听器配置对象，定制事件监听行为。该对象有以下属性

- `capture`：布尔值，如果设为 `true`，表示监听函数在捕获阶段触发，默认为 `false`，在冒泡阶段触发
- `once`：布尔值，如果设为 `true`，表示监听函数执行一次就会自动移除，后面将不再监听该事件。该属性默认值为 `false`
- `passive`：布尔值，设为 `true` 时，表示禁止监听函数调用 `preventDefault()` 方法。如果调用了，浏览器将忽略这个要求，并在控制台输出一条警告。该属性默认值为 `false`
- `signal`：该属性的值为一个 AbortSignal 对象，为监听器设置了一个信号通道，用来在需要时发出信号，移除监听函数

下面是 `once` 属性的例子，让监听函数只执行一次

```js
element.addEventListener(
  "click",
  function (event) {
    // 只执行一次的代码
  },
  { once: true }
);
```

`addEventListener()` 方法可以为针对当前对象的同一个事件，添加多个不同的监听函数。这些函数按照添加顺序触发，即先添加先触发。如果为同一个事件多次添加同一个监听函数，该函数只会执行一次，多余的添加将自动被去除（不必使用 `removeEventListener()` 方法手动去除）

```js
function hello() {
  console.log("Hello world");
}

document.addEventListener("click", hello, false);
document.addEventListener("click", hello, false);
```

执行上面代码，点击文档只会输出一行 `Hello world`

## EventTarget.removeEventListener()

`EventTarget.removeEventListener()` 方法用来移除 `addEventListener()` 方法添加的事件监听函数。该方法没有返回值

```js
div.addEventListener("click", listener, false);
div.removeEventListener("click", listener, false);
```

注意，`removeEventListener()` 方法移除的监听函数，必须是 `addEventListener()` 方法添加的那个监听函数，而且必须在同一个元素节点，否则无效

```js
div.addEventListener("click", function (e) {}, false);
div.removeEventListener("click", function (e) {}, false);
```

上面代码中，`removeEventListener()` 方法无效，因为监听函数不是同一个匿名函数

```js
element.addEventListener("mousedown", handleMouseDown, true);
element.removeEventListener("mousedown", handleMouseDown, false);
```

上面代码中，`removeEventListener()` 方法也是无效的，因为第三个参数不一样

## EventTarget.dispatchEvent()

`EventTarget.dispatchEvent()` 方法在当前节点上触发指定事件，从而触发监听函数的执行。该方法返回一个布尔值，只要有一个监听函数调用了 `Event.preventDefault()`，则返回值为 `false`，否则为 `true`

```js
target.dispatchEvent(event);
```

`dispatchEvent()` 方法的参数是一个 `Event` 对象的实例

```js
para.addEventListener("click", hello, false);
var event = new Event("click");
para.dispatchEvent(event);
```

如果 `dispatchEvent()` 方法的参数为空，或者不是一个有效的事件对象，将报错
