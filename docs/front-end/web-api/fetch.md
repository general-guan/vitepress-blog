# Fetch

## 基本用法

```js
let promise = fetch(url, [options]);
```

- `url`：要访问的 URL
- `options`：可选参数：method，header 等

没有 `options`，这就是一个简单的 GET 请求，下载 `url` 的内容

浏览器立即启动请求，并返回一个该调用代码应该用来获取结果的 `promise`

获取响应通常需要经过两个阶段：

1. 获取并解析响应头

   在这个阶段，我们可以通过检查响应头，来检查 HTTP 状态以确定请求是否成功，当前还没有响应体（response body）

   如果 `fetch` 无法建立一个 HTTP 请求，例如网络问题，亦或是请求的网址不存在，那么 `promise` 就会 `reject`。异常的 HTTP 状态，例如 `404` 或 `500`，不会导致出现 `error`

   我们可以在 `response` 的属性中看到 HTTP 状态：

   - `status`：HTTP 状态码，例如 `200`
   - `ok`：布尔值，如果 HTTP 状态码为 `200`-`299`，则为 `true`

   例如：

   ```js
   let response = await fetch(url);

   if (response.ok) {
     // 如果 HTTP 状态码为 200-299
     // 获取 response body（此方法会在下面解释）
     let json = await response.json();
   } else {
     alert("HTTP-Error: " + response.status);
   }
   ```

2. 获取响应体

   为了获取响应体，我们需要使用一个其他的方法调用

   `Response` 提供了多种基于 `promise` 的方法，来以不同的格式访问响应体：

   - `response.text()`：以文本形式返回
   - `response.json()`：以 JSON 格式返回
   - `response.formData()`：以 `FormData` 对象的形式返回
   - `response.blob()`：以 Blob（具有类型的二进制数据）形式返回
   - `response.arrayBuffer()`：以 ArrayBuffer（低级别的二进制数据）形式返回

   另外，`response.body` 是 ReadableStream 对象，它允许你逐块读取 body，稍后会用一个例子解释

   例如，我们从 GitHub 获取最新 commits 的 JSON 对象：

   ```js
   let url =
     "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits";
   let response = await fetch(url);

   let commits = await response.json(); // 读取 response body，并将其解析为 JSON 格式

   alert(commits[0].author.login);
   ```

   要获取响应文本，可以使用 `await response.text()` 代替 `.json()`：

   ```js
   let response = await fetch(
     "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits"
   );

   let text = await response.text(); // 将 response body 读取为文本

   alert(text.slice(0, 80) + "...");
   ```

   作为一个读取为二进制格式的演示示例，让我们 fetch 并显示一张图片

   ```js
   let response = await fetch("/article/fetch/logo-fetch.svg");

   let blob = await response.blob(); // 下载为 Blob 对象

   // 为其创建一个 <img>
   let img = document.createElement("img");
   img.style = "position:fixed;top:10px;left:10px;width:100px";
   document.body.append(img);

   // 显示它
   img.src = URL.createObjectURL(blob);

   setTimeout(() => {
     // 3 秒后将其隐藏
     img.remove();
     URL.revokeObjectURL(img.src);
   }, 3000);
   ```

   > 我们只能选择一种读取 body 的方法
   >
   > 如果我们已经使用了 `response.text()` 方法来获取 response，那么如果再用 `response.json()`，则不会生效，因为 body 内容已经被处理过了
   >
   > ```js
   > let text = await response.text(); // response body 被处理了
   > let parsed = await response.json(); // 失败（已经被处理过了）
   > ```

## 响应头（Response header）

Response header 位于 `response.headers` 中的一个类似于 Map 的 header 对象

它不是真正的 Map，但是它具有类似的方法，我们可以按名称（name）获取各个 header，或迭代它们：

```js
let response = await fetch(
  "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits"
);

// 获取一个 header
alert(response.headers.get("Content-Type")); // application/json; charset=utf-8

// 迭代所有 header
for (let [key, value] of response.headers) {
  alert(`${key} = ${value}`);
}
```

## 请求头（Request header）

要在 `fetch` 中设置 request header，我们可以使用 `headers` 选项。它有一个带有输出 header 的对象，如下所示：

```js
let response = fetch(protectedUrl, {
  headers: {
    Authentication: "secret",
  },
});
```

但是有一些我们无法设置的 header（详见 [forbidden HTTP headers](https://fetch.spec.whatwg.org/#forbidden-header-name)）：

- `Accept-Charset`, `Accept-Encoding`
- `Access-Control-Request-Headers`
- `Access-Control-Request-Method`
- `Connection`
- `Content-Length`
- `Cookie`, `Cookie2`
- `Date`
- `DNT`
- `Expect`
- `Host`
- `Keep-Alive`
- `Origin`
- `Referer`
- `TE`
- `Trailer`
- `Transfer-Encoding`
- `Upgrade`
- `Via`
- `Proxy-*`
- `Sec-*`

这些 header 保证了 HTTP 的正确性和安全性，所以它们仅由浏览器控制

## POST 请求

要创建一个 `POST` 请求，或者其他方法的请求，我们需要使用 `fetch` 选项：

- `method`：HTTP 方法，例如 `POST`
- `body`：request body，其中之一：
  - 字符串（例如 JSON 编码的）
  - `FormData` 对象，以 `multipart/form-data` 形式发送数据
  - `Blob`/`BufferSource` 发送二进制数据
  - [URLSearchParams](https://zh.javascript.info/url)，以 `x-www-form-urlencoded` 编码形式发送数据，很少使用

JSON 形式是最常用的

例如，下面这段代码以 JSON 形式发送 `user` 对象：

```js
let user = {
  name: "John",
  surname: "Smith",
};

let response = await fetch("/article/fetch/post/user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  body: JSON.stringify(user),
});

let result = await response.json();
alert(result.message);
```

请注意，如果请求的 `body` 是字符串，则 `Content-Type` 会默认设置为 `text/plain;charset=UTF-8`

但是，当我们要发送 JSON 时，我们会使用 `headers` 选项来发送 `application/json`，这是 JSON 编码的数据的正确的 `Content-Type`

## 发送图片

我们同样可以使用 `Blob` 或 `BufferSource` 对象通过 `fetch` 提交二进制数据

例如，这里有一个 `<canvas>`，我们可以通过在其上移动鼠标来进行绘制。点击 “submit” 按钮将图片发送到服务器：

```js
<body style="margin:0">
  <canvas id="canvasElem" width="100" height="80" style="border:1px solid"></canvas>

  <input type="button" value="Submit" onclick="submit()">

  <script>
    canvasElem.onmousemove = function(e) {
      let ctx = canvasElem.getContext('2d');
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };

    async function submit() {
      let blob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
      let response = await fetch('/article/fetch/post/image', {
        method: 'POST',
        body: blob
      });

      // 服务器给出确认信息和图片大小作为响应
      let result = await response.json();
      alert(result.message);
    }

  </script>
</body>
```

请注意，这里我们没有手动设置 `Content-Type` header，因为 `Blob` 对象具有内建的类型（这里是 `image/png`，通过 `toBlob` 生成的）。对于 `Blob` 对象，这个类型就变成了 `Content-Type` 的值

## 下载进度

`fetch` 方法允许去跟踪下载进度

请注意：到目前为止，`fetch` 方法无法跟踪上传进度。对于这个目的，请使用 XMLHttpRequest

要跟踪下载进度，我们可以使用 `response.body` 属性。它是 `ReadableStream`，一个特殊的对象，它可以逐块（chunk）提供 body

与 `response.text()`，`response.json()` 和其他方法不同，`response.body` 给予了对进度读取的完全控制，我们可以随时计算下载了多少

这是从 `response.body` 读取 response 的示例代码：

```js
// 代替 response.json() 以及其他方法
const reader = response.body.getReader();

// 在 body 下载时，一直为无限循环
while (true) {
  // 当最后一块下载完成时，done 值为 true
  // value 是块字节的 Uint8Array
  const { done, value } = await reader.read();

  if (done) {
    break;
  }

  console.log(`Received ${value.length} bytes`);
}
```

`await reader.read()` 调用的结果是一个具有两个属性的对象：

- done：当读取完成时为 `true`，否则为 `false`
- value：字节的类型化数组：`Uint8Array`

我们在循环中接收响应块（response chunk），直到加载完成，也就是：直到 `done` 为 `true`

要将进度打印出来，我们只需要将每个接收到的片段 `value` 的长度（length）加到 counter 即可

这是获取响应，并在控制台中记录进度的完整工作示例，下面有更多说明：

```js
// Step 1：启动 fetch，并获得一个 reader
let response = await fetch(
  "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits?per_page=100"
);

const reader = response.body.getReader();

// Step 2：获得总长度（length）
const contentLength = +response.headers.get("Content-Length");

// Step 3：读取数据
let receivedLength = 0; // 当前接收到了这么多字节
let chunks = []; // 接收到的二进制块的数组（包括 body）
while (true) {
  const { done, value } = await reader.read();

  if (done) {
    break;
  }

  chunks.push(value);
  receivedLength += value.length;

  console.log(`Received ${receivedLength} of ${contentLength}`);
}

// Step 4：将块连接到单个 Uint8Array
let chunksAll = new Uint8Array(receivedLength); // (4.1)
let position = 0;
for (let chunk of chunks) {
  chunksAll.set(chunk, position); // (4.2)
  position += chunk.length;
}

// Step 5：解码成字符串
let result = new TextDecoder("utf-8").decode(chunksAll);

// 我们完成啦！
let commits = JSON.parse(result);
alert(commits[0].author.login);
```

让我们一步步解释下这个过程：

1. 我们像往常一样执行 `fetch`，但不是调用 `response.json()`，而是获得了一个流读取器（stream reader）`response.body.getReader()`

   请注意，我们不能同时使用这两种方法来读取相同的响应。要么使用流读取器，要么使用 reponse 方法来获取结果

2. 在读取数据之前，我们可以从 `Content-Length` header 中得到完整的响应长度

   跨源请求中可能不存在这个 header，并且从技术上讲，服务器可以不设置它。但是通常情况下它都会在那里

3. 调用 `await reader.read()`，直到它完成

   我们将响应块收集到数组 `chunks` 中。这很重要，因为在使用完（consumed）响应后，我们将无法使用 `response.json()` 或者其他方式（你可以试试，将会出现 error）去“重新读取”它

4. 最后，我们有了一个 `chunks` 一个 `Uint8Array` 字节块数组。我们需要将这些块合并成一个结果。但不幸的是，没有单个方法可以将它们串联起来，所以这里需要一些代码来实现：

   1. 我们创建 `chunksAll = new Uint8Array(receivedLength)`，一个具有所有数据块合并后的长度的同类型数组
   2. 然后使用 `.set(chunk, position)` 方法，从数组中一个个地复制这些 `chunk`

5. 我们的结果现在储存在 `chunksAll` 中。但它是一个字节数组，不是字符串

   要创建一个字符串，我们需要解析这些字节。可以使用内建的 TextDecoder 对象完成。然后，我们可以 `JSON.parse` 它，如果有必要的话

   如果我们需要的是二进制内容而不是字符串呢？这更简单。用下面这行代码替换掉第 4 和第 5 步，这行代码从所有块创建一个 `Blob`：

   ```js
   let blob = new Blob(chunks);
   ```

最后，我们得到了结果（以字符串或 blob 的形式表示，什么方便就用什么），并在过程中对进度进行了跟踪

另外，如果大小未知，我们应该检查循环中的 `receivedLength`，一旦达到一定的限制就将其中断。这样 `chunks` 就不会溢出内存了

## 中止

正如我们所知道的，`fetch` 返回一个 promise。JavaScript 通常并没有“中止” promise 的概念。那么我们怎样才能取消一个正在执行的 `fetch` 呢？例如，如果用户在我们网站上的操作表明不再需要某个执行中的 `fetch`

为此有一个特殊的内建对象：`AbortController`。它不仅可以中止 `fetch`，还可以中止其他异步任务

用法非常简单

### AbortController 对象

创建一个控制器（controller）：

```javascript
let controller = new AbortController();
```

控制器是一个极其简单的对象

- 它具有单个方法 `abort()`
- 和单个属性 `signal`，我们可以在这个属性上设置事件监听器

当 `abort()` 被调用时：

- `controller.signal` 就会触发 `abort` 事件
- `controller.signal.aborted` 属性变为 `true`

通常，我们需要处理两部分：

1. 一部分是通过在 `controller.signal` 上添加一个监听器，来执行可取消操作
2. 另一部分是触发取消：在需要的时候调用 `controller.abort()`

这是完整的示例（目前还没有 `fetch`）：

```js
let controller = new AbortController();
let signal = controller.signal;

// 执行可取消操作部分
// 获取 "signal" 对象，
// 并将监听器设置为在 controller.abort() 被调用时触发
signal.addEventListener("abort", () => alert("abort!"));

// 另一部分，取消（在之后的任何时候）：
controller.abort(); // 中止！

// 事件触发，signal.aborted 变为 true
alert(signal.aborted); // true
```

正如我们所看到的，`AbortController` 只是在 `abort()` 被调用时传递 `abort` 事件的一种方式

我们可以自己在代码中实现相同类型的事件监听，而不需要 `AbortController` 对象

但是有价值的是，`fetch` 知道如何与 `AbortController` 对象一起工作。它们是集成在一起的

### 与 fetch 一起使用

为了能够取消 `fetch`，请将 `AbortController` 的 `signal` 属性作为 `fetch` 的一个可选参数（option）进行传递：

```js
let controller = new AbortController();
fetch(url, {
  signal: controller.signal,
});
```

`fetch` 方法知道如何与 `AbortController` 一起工作。它会监听 `signal` 上的 `abort` 事件

现在，想要中止 `fetch`，调用 `controller.abort()` 即可：

```js
controller.abort();
```

我们完成啦：`fetch` 从 `signal` 获取了事件并中止了请求

当一个 fetch 被中止，它的 promise 就会以一个 error `AbortError` reject，因此我们应该对其进行处理，例如在 `try..catch` 中

这是完整的示例，其中 `fetch` 在 1 秒后中止：

```js
// 1 秒后中止
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch("/article/fetch-abort/demo/hang", {
    signal: controller.signal,
  });
} catch (err) {
  if (err.name == "AbortError") {
    // handle abort()
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

### AbortController 是可伸缩的

`AbortController` 是可伸缩的。它允许一次取消多个 fetch

这是一个代码草稿，该代码并行 fetch 很多 `urls`，并使用单个控制器将其全部中止：

```js
let urls = [...]; // 要并行 fetch 的 url 列表

let controller = new AbortController();

// 一个 fetch promise 的数组
let fetchJobs = urls.map(url => fetch(url, {
  signal: controller.signal
}));

let results = await Promise.all(fetchJobs);

// controller.abort() 被从任何地方调用，
// 它都将中止所有 fetch
```

如果我们有自己的与 `fetch` 不同的异步任务，我们可以使用单个 `AbortController` 中止这些任务以及 `fetch`

在我们的任务中，我们只需要监听其 `abort` 事件：

```js
let urls = [...];
let controller = new AbortController();

let ourJob = new Promise((resolve, reject) => { // 我们的任务
  ...
  controller.signal.addEventListener('abort', reject);
});

let fetchJobs = urls.map(url => fetch(url, { // fetches
  signal: controller.signal
}));

// 等待完成我们的任务和所有 fetch
let results = await Promise.all([...fetchJobs, ourJob]);

// controller.abort() 被从任何地方调用，
// 它都将中止所有 fetch 和 ourJob
```
