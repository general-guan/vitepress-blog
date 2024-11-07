# Event 对象

事件发生以后，会产生一个事件对象，作为参数传给监听函数。浏览器原生提供一个 `Event` 对象，所有的事件都是这个对象的实例，或者说继承了 `Event.prototype` 对象

`Event` 对象本身就是一个构造函数，可以用来生成新的实例

```js
event = new Event(type, options);
```

`Event` 构造函数接受两个参数。第一个参数 `type` 是字符串，表示事件的名称；第二个参数 `options` 是一个对象，表示事件对象的配置。该对象主要有下面两个属性

- `bubbles`：布尔值，可选，默认为 `false`，表示事件对象是否冒泡
- `cancelable`：布尔值，可选，默认为 `false`，表示事件是否可以被取消，即能否用 `Event.preventDefault()` 取消这个事件。一旦事件被取消，就好像从来没有发生过，不会触发浏览器对该事件的默认行为

```js
var ev = new Event("look", {
  bubbles: true,
  cancelable: false,
});
document.dispatchEvent(ev);
```

注意，如果不是显式指定 `bubbles` 属性为 `true`，生成的事件就只能在“捕获阶段”触发监听函数

```js
// HTML 代码为
// <div><p>Hello</p></div>
var div = document.querySelector("div");
var p = document.querySelector("p");

function callback(event) {
  var tag = event.currentTarget.tagName;
  console.log("Tag: " + tag); // 没有任何输出
}

div.addEventListener("click", callback, false);

var click = new Event("click");
p.dispatchEvent(click);
```

上面代码中，`p` 元素发出一个 `click` 事件，该事件默认不会冒泡。`div.addEventListener` 方法指定在冒泡阶段监听，因此监听函数不会触发。如果写成 `div.addEventListener('click', callback, true)`，那么在“捕获阶段”可以监听到这个事件

另一方面，如果这个事件在 `div` 元素上触发

```js
div.dispatchEvent(click);
```

那么，不管 `div` 元素是在冒泡阶段监听，还是在捕获阶段监听，都会触发监听函数。因为这时 `div` 元素是事件的目标，不存在是否冒泡的问题，`div` 元素总是会接收到事件，因此导致监听函数生效

## 实例属性

### Event.bubbles，Event.eventPhase

`Event.bubbles `属性返回一个布尔值，表示当前事件是否会冒泡。该属性为只读属性，一般用来了解 Event 实例是否可以冒泡。前面说过，除非显式声明，`Event` 构造函数生成的事件，默认是不冒泡的

`Event.eventPhase` 属性返回一个整数常量，表示事件目前所处的阶段。该属性只读

```js
var phase = event.eventPhase;
```

- 0：事件目前没有发生
- 1：事件目前处于捕获阶段，即处于从祖先节点向目标节点的传播过程中
- 2：事件到达目标节点，即 `Event.target` 属性指向的那个节点
- 3：事件处于冒泡阶段，即处于从目标节点向祖先节点的反向传播过程中

### Event.cancelable，Event.cancelBubble，event.defaultPrevented

`Event.cancelable `属性返回一个布尔值，表示事件是否可以取消。该属性为只读属性，一般用来了解 Event 实例的特性

大多数浏览器的原生事件是可以取消的。比如，取消 `click` 事件，点击链接将无效。但是除非显式声明，`Event` 构造函数生成的事件，默认是不可以取消的

```js
var evt = new Event("foo");
evt.cancelable; // false
```

当 `Event.cancelable` 属性为 `true` 时，调用 `Event.preventDefault()` 就可以取消这个事件，阻止浏览器对该事件的默认行为

如果事件不能取消，调用 `Event.preventDefault()` 会没有任何效果。所以使用这个方法之前，最好用 `Event.cancelable` 属性判断一下是否可以取消

```js
function preventEvent(event) {
  if (event.cancelable) {
    event.preventDefault();
  } else {
    console.warn("This event couldn't be canceled.");
    console.dir(event);
  }
}
```

`Event.cancelBubble` 属性是一个布尔值，如果设为 `true`，相当于执行 `Event.stopPropagation()`，可以阻止事件的传播

`Event.defaultPrevented` 属性返回一个布尔值，表示该事件是否调用过 `Event.preventDefault` 方法。该属性只读

```js
if (event.defaultPrevented) {
  console.log("该事件已经取消了");
}
```
