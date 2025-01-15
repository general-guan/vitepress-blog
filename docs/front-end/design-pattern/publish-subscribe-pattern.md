# 发布订阅模式

## 手写 mitt

```js
export default function mitt(all) {
  all = all || new Map();
  return {
    all,
    // 订阅事件
    on(type, handler) {
      const handlers = all.get(type);
      if (handlers) {
        handlers.push(handler);
      } else {
        all.set(type, [handler]);
      }
    },
    // 取消订阅事件
    off(type, handler) {
      const handlers = all.get(type);
      if (handlers) {
        if (handler) {
          if (handlers.indexOf(handler) > -1) {
            handlers.splice(handlers.indexOf(handler), 1);
          }
        } else {
          all.set(type, []);
        }
      }
    },
    // 发布事件
    emit(type, evt) {
      const handlers = all.get(type);
      if (handlers) {
        handlers.forEach((handler) => {
          handler(evt);
        });
      }
    },
  };
}
```
