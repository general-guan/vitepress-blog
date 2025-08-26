# Vue

## 说说你对 nextTick 的理解

### 背景

有一个需求：根据文字的行数来显示展开更多的一个按钮，因此我们在 Vue 中给数据赋值之后需要获取文字高度。

```html
<div id="app">
  <div class="msg">{{msg}}</div>
</div>
```

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      msg: "",
    };
  },
  mounted() {
    this.msg = "我是测试文字";
    console.log(document.querySelector(".msg").offsetHeight); //0
  },
});
```

这时不管怎么获取，文字的 Div 高度都是 0；但是在控制台直接获取却是有值。

### 异步更新

我们发现上述的问题，是在给 data 中赋值后立马去查看数据导致的。由于“查看数据”这个动作是同步操作的，而且都是在赋值之后；因此我们猜测一下，给数据赋值操作是一个异步操作，并没有马上执行，Vue 官网对数据操作是这么描述的：

> 可能你还没有注意到，Vue 在更新 DOM 时是**异步**执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替。 --- [出处](https://v2.cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)

也就是说我们在设置 `this.msg = 'some thing'` 的时候，Vue 并没有马上去更新 DOM 数据，而是将这个操作放进一个队列中；如果我们重复执行的话，队列还会进行去重操作；等待**同一事件循环中**的所有数据变化完成之后，会将队列中的事件拿出来处理。

这样做主要是为了提升性能，因为如果在主线程中更新 DOM，循环 100 次就要更新 100 次 DOM；但是如果等事件循环完成之后更新 DOM，只需要更新 1 次。

为了在数据更新操作之后操作 DOM，我们可以在数据变化之后立即使用 `Vue.nextTick(callback)`；这样回调函数会在 DOM 更新完成后被调用，就可以拿到最新的 DOM 元素了。

### nextTick 的用法

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

```js
// 修改数据
vm.msg = "Hello";
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
});

// 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
Vue.nextTick().then(function () {
  // DOM 更新了
});
```

### nextTick 的源码分析

Vue 把 nextTick 的源码单独抽到一个文件中，[/src/core/util/next-tick.js](https://github.com/vuejs/vue/blob/main/src/core/util/next-tick.ts)，删掉注释也就大概六七十行的样子，让我们逐段来分析。

```ts
const callbacks: Array<Function> = [];
let pending = false;
let timerFunc;

export function nextTick(cb?: (...args: any[]) => any, ctx?: object) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e: any) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```

我们首先找到 `nextTick` 这个函数定义的地方，它在外层定义了三个变量，`callbacks`，就是我们上面说的队列；在 `nextTick` 的外层定义变量就形成了一个闭包，所以我们每次调用 `$nextTick` 的过程其实就是在向 `callbacks` 新增回调函数的过程。

`callbacks` 新增回调函数后又执行了 `timerFunc` 函数，`pending` 用来标识同一个时间只能执行一次。那么这个 `timerFunc` 函数是做什么用的呢，我们继续来看代码：

```ts
export let isUsingMicroTask = false;

if (typeof Promise !== "undefined" && isNative(Promise)) {
  // 判断 1：是否原生支持 Promise
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== "undefined" &&
  (isNative(MutationObserver) ||
    MutationObserver.toString() === "[object MutationObserverConstructor]")
) {
  // 判断 2：是否原生支持 MutationObserver
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  // 判断 3：是否原生支持 setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 判断 4：上面都不行，直接用 setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
```

这里出现了好几个 `isNative` 函数，这是用来判断所传参数是否在当前环境原生就支持；例如某些浏览器不支持 `Promise`，虽然我们使用了垫片（polify），但是 `isNative(Promise)` 还是会返回 `false`。

可以看出这边代码其实是做了四个判断，对当前环境进行不断的降级处理，尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，上述三个都不支持最后使用 `setTimeout`；降级处理的目的都是将 `flushCallbacks` 函数放入微任务（判断 1 和判断 2）或者宏任务（判断 3 和判断 4），等待下一次事件循环时来执行。

那么最终我们顺藤摸瓜找到了最终的大 boss：`flushCallbacks`；`nextTick` 不顾一切的要把它放入微任务或者宏任务中去执行，它究竟是何方神圣呢？让我们来一睹它的真容：

```ts
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
```

它所做的事情也非常的简单，把 `callbacks` 数组复制一份，然后把 `callbacks` 置为空，最后把复制出来的数组中的每个函数依次执行一遍；所以它的作用仅仅是用来执行 `callbacks` 中的回调函数。

### 总结

到这里，整体 `nextTick` 的代码都分析完毕了，总结一下它的流程就是：

1. 把回调函数放入 `callbacks` 等待执行
2. 将执行函数放到微任务或者宏任务中
3. 事件循环到了微任务或者宏任务，执行函数依次执行 `callbacks` 中的回调
