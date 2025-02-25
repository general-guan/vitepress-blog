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

JSON 形式是最常用的。

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
