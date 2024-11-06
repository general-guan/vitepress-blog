# 事件模型

## 监听函数

浏览器的事件模型，就是通过监听函数（listener）对事件做出反应。事件发生后，浏览器监听到了这个事件，就会执行对应的监听函数。这是事件驱动编程模式（event-driven）的主要编程方式

JavaScript 有三种方法，可以为事件绑定监听函数

### HTML 的 on- 属性

HTML 语言允许在元素的属性中，直接定义某些事件的监听代码

```html
<body onload="doSomething()">
  <div onclick="console.log('触发事件')"></div>
</body>
```

元素的事件监听属性，都是 `on` 加上事件名，比如 `onclick` 就是 `on` + `click`，表示 `click` 事件的监听代码

注意，这些属性的值是将会执行的代码，而不是一个函数

```html
<!-- 正确 -->
<body onload="doSomething()"></body>

<!-- 错误 -->
<body onload="doSomething"></body>
```

使用这个方法指定的监听代码，只会在冒泡阶段触发

```html
<div onclick="console.log(2)">
  <button onclick="console.log(1)">点击</button>
</div>
```

上面代码中，`<button>` 是 `<div>` 的子元素。`<button>` 的 `click` 事件，也会触发 `<div>` 的 `click` 事件。由于 `on-` 属性的监听代码，只在冒泡阶段触发，所以点击结果是先输出 `1`，再输出 `2`，即事件从子元素开始冒泡到父元素

直接设置 `on-` 属性，与通过元素节点的 `setAttribute` 方法设置 `on-` 属性，效果是一样的

```js
el.setAttribute("onclick", "doSomething()");
// 等同于
// <Element onclick="doSomething()">
```

### 元素节点的事件属性

元素节点对象的事件属性，同样可以指定监听函数

```js
window.onload = doSomething;

div.onclick = function (event) {
  console.log("触发事件");
};
```

使用这个方法指定的监听函数，也是只会在冒泡阶段触发
注意，这种方法与 HTML 的 `on-` 属性的差异是，它的值是函数名（`doSomething`），而不像后者，必须给出完整的监听代码（`doSomething()`）

### EventTarget.addEventListener()

所有 DOM 节点实例都有 `addEventListener` 方法，用来为该节点定义事件的监听函数

```js
window.addEventListener("load", doSomething, false);
```

### 小结

上面三种方法，第一种 “HTML 的 on- 属性”，违反了 HTML 与 JavaScript 代码相分离的原则，将两者写在一起，不利于代码分工，因此不推荐使用

第二种 “元素节点的事件属性” 的缺点在于，同一个事件只能定义一个监听函数，也就是说，如果定义两次 `onclick` 属性，后一次定义会覆盖前一次。因此，也不推荐使用

第三种 `EventTarget.addEventListener` 是推荐的指定监听函数的方法。它有如下优点：

- 同一个事件可以添加多个监听函数
- 能够指定在哪个阶段（捕获阶段还是冒泡阶段）触发监听函数
- 除了 DOM 节点，其他对象（比如 `window`、`XMLHttpRequest` 等）也有这个接口，它等于是整个 JavaScript 统一的监听函数接口

## this 的指向

监听函数内部的 `this` 指向触发事件的那个元素节点

```html
<button id="btn" onclick="console.log(this.id)">点击</button>
```

其他两种监听函数的写法，this 的指向也是如此

```js
// HTML 代码如下
// <button id="btn">点击</button>
var btn = document.getElementById("btn");

// 写法一
btn.onclick = function () {
  console.log(this.id);
};

// 写法二
btn.addEventListener(
  "click",
  function (e) {
    console.log(this.id);
  },
  false
);
```
