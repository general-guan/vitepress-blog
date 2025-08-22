# 跨页面通信

## BroadcastChannel

允许同源的不同浏览器窗口、标签页、frame 或者 iframe 下的不同文档之间相互通信

```js
const channel = new BroadcastChannel("example-channel");

// 发送消息
channel.postMessage("Hello, world!");

// 接受消息
channel.addEventListener("message", (event) => {
  console.log(event.data);
});
```
