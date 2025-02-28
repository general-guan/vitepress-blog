# ArrayBuffer

`ArrayBuffer` 对象、`TypedArray` 视图和 `DataView` 视图是 JavaScript 操作二进制数据的一个接口。这些对象早就存在，属于独立的规格（2011 年 2 月发布），ES6 将它们纳入了 ECMAScript 规格，并且增加了新的方法。它们都是以数组的语法处理二进制数据，所以统称为二进制数组

这个接口的原始设计目的，与 WebGL 项目有关。所谓 WebGL，就是指浏览器与显卡之间的通信接口，为了满足 JavaScript 与显卡之间大量的、实时的数据交换，它们之间的数据通信必须是二进制的，而不能是传统的文本格式。文本格式传递一个 32 位整数，两端的 JavaScript 脚本与显卡都要进行格式转化，将非常耗时。这时要是存在一种机制，可以像 C 语言那样，直接操作字节，将 4 个字节的 32 位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升

二进制数组就是在这种背景下诞生的。它很像 C 语言的数组，允许开发者以数组下标的形式，直接操作内存，大大增强了 JavaScript 处理二进制数据的能力，使得开发者有可能通过 JavaScript 与操作系统的原生接口进行二进制通信

二进制数组由三类对象组成：

**（1）ArrayBuffer 对象**：代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存

**（2）TypedArray 视图**：共包括 9 种类型的视图，比如 `Uint8Array`（无符号 8 位整数）数组视图, `Int16Array`（16 位整数）数组视图， `Float32Array`（32 位浮点数）数组视图等等

**（3）DataView 视图**：可以自定义复合格式的视图，比如第一个字节是 Uint8（无符号 8 位整数）、第二、三个字节是 Int16（16 位整数）、第四个字节开始是 Float32（32 位浮点数）等等，此外还可以自定义字节序

简单说，`ArrayBuffer` 对象代表原始的二进制数据，`TypedArray` 视图用来读写简单类型的二进制数据，`DataView` 视图用来读写复杂类型的二进制数据

`TypedArray` 视图支持的数据类型一共有 9 种（`DataView` 视图支持除 `Uint8C` 以外的其他 8 种）

| 数据类型 | 字节长度 | 含义                             | 对应的 C 语言类型 |
| -------- | -------- | -------------------------------- | ----------------- |
| Int8     | 1        | 8 位带符号整数                   | signed char       |
| Uint8    | 1        | 8 位不带符号整数                 | unsigned char     |
| Uint8C   | 1        | 8 位不带符号整数（自动过滤溢出） | unsigned char     |
| Int16    | 2        | 16 位带符号整数                  | short             |
| Uint16   | 2        | 16 位不带符号整数                | unsigned short    |
| Int32    | 4        | 32 位带符号整数                  | int               |
| Uint32   | 4        | 32 位不带符号的整数              | unsigned int      |
| Float32  | 4        | 32 位浮点数                      | float             |
| Float64  | 8        | 64 位浮点数                      | double            |

很多浏览器操作的 API，用到了二进制数组操作二进制数据，下面是其中的几个。

- Canvas
- Fetch API
- File API
- WebSockets
- XMLHttpRequest

## ArrayBuffer 对象

在 Web 开发中，当我们处理文件时（创建，上传，下载），经常会遇到二进制数据。另一个典型的应用场景是图像处理

这些都可以通过 JavaScript 进行处理，而且二进制操作性能更高

不过，在 JavaScript 中有很多种二进制数据格式，会有点容易混淆。仅举几个例子：

`ArrayBuffer`，`Uint8Array`，`DataView`，`Blob`，`File` 及其他

基本的二进制对象是 `ArrayBuffer`，对固定长度的连续内存空间的引用

我们这样创建它：

```js
let buffer = new ArrayBuffer(16); // 创建一个长度为 16 的 buffer
alert(buffer.byteLength); // 16
```

它会分配一个 16 字节的连续内存空间，并用 0 进行预填充

> `ArrayBuffer` 不是某种东西的数组
>
> 让我们先澄清一个可能的误区。`ArrayBuffer` 与 `Array` 没有任何共同之处：
>
> - 它的长度是固定的，我们无法增加或减少它的长度
> - 它正好占用了内存中的那么多空间
> - 要访问单个字节，需要另一个“视图”对象，而不是 `buffer[index]`

`ArrayBuffer` 是一个内存区域。它里面存储了什么？无从判断。只是一个原始的字节序列

如要操作 `ArrayBuffer`，我们需要使用“视图”对象

视图对象本身并不存储任何东西。它是一副“眼镜”，透过它来解释存储在 `ArrayBuffer` 中的字节

例如：

- `Uint8Array`：将 `ArrayBuffer` 中的每个字节视为 0 到 255 之间的单个数字（每个字节是 8 位，因此只能容纳那么多）。这称为 “8 位无符号整数”
- `Uint16Array`：将每 2 个字节视为一个 0 到 65535 之间的整数。这称为 “16 位无符号整数”
- `Uint32Array`：将每 4 个字节视为一个 0 到 4294967295 之间的整数。这称为 “32 位无符号整数”
- `Float64Array`：将每 8 个字节视为一个 `5.0x10-324` 到 `1.8x10308` 之间的浮点数

因此，一个 16 字节 `ArrayBuffer` 中的二进制数据可以解释为 16 个“小数字”，或 8 个更大的数字（每个数字 2 个字节），或 4 个更大的数字（每个数字 4 个字节），或 2 个高精度的浮点数（每个数字 8 个字节）

![arraybuffer-views](./images/arraybuffer-views.svg)

`ArrayBuffer` 是核心对象，是所有的基础，是原始的二进制数据

但是，如果我们要写入值或遍历它，基本上几乎所有操作，我们必须使用视图（view），例如：

```js
let buffer = new ArrayBuffer(16); // 创建一个长度为 16 的 buffer

let view = new Uint32Array(buffer); // 将 buffer 视为一个 32 位整数的序列

alert(Uint32Array.BYTES_PER_ELEMENT); // 每个整数 4 个字节

alert(view.length); // 4，它存储了 4 个整数
alert(view.byteLength); // 16，字节中的大小

// 让我们写入一个值
view[0] = 123456;

// 遍历值
for (let num of view) {
  alert(num); // 123456，然后 0，0，0（一共 4 个值）
}
```

### ArrayBuffer.isView()

`ArrayBuffer` 有一个静态方法 `isView`，返回一个布尔值，表示参数是否为 `ArrayBuffer` 的视图实例。这个方法大致相当于判断参数，是否为 `TypedArray` 实例或 `DataView` 实例

```js
const buffer = new ArrayBuffer(8);
ArrayBuffer.isView(buffer); // false

const v = new Int32Array(buffer);
ArrayBuffer.isView(v); // true
```

## TypedArray 视图

所有这些视图（`Uint8Array`，`Uint32Array` 等）的通用术语是 TypedArray。它们共享同一方法和属性集

请注意，没有名为 `TypedArray` 的构造器，它只是表示 `ArrayBuffer` 上的视图之一的通用总称术语：`Int8Array`，`Uint8Array` 及其他，很快就会有完整列表

当你看到 `new TypedArray` 之类的内容时，它表示 `new Int8Array`、`new Uint8Array` 及其他中之一

类型化数组的行为类似于常规数组：具有索引，并且是可迭代的

一个类型化数组的构造器（无论是 `Int8Array` 或 `Float64Array`，都无关紧要），其行为各不相同，并且取决于参数类型

参数有 5 种变体：

```js
new TypedArray(buffer, [byteOffset], [length]);
new TypedArray(object);
new TypedArray(typedArray);
new TypedArray(length);
new TypedArray();
```

1. 如果给定的是 `ArrayBuffer` 参数，则会在其上创建视图。我们已经用过该语法了

   可选，我们可以给定起始位置 `byteOffset`（默认为 0）以及 `length`（默认至 buffer 的末尾），这样视图将仅涵盖 `buffer` 的一部分

2. 如果给定的是 `Array`，或任何类数组对象，则会创建一个相同长度的类型化数组，并复制其内容。

   我们可以使用它来预填充数组的数据：

   ```js
   let arr = new Uint8Array([0, 1, 2, 3]);
   alert(arr.length); // 4，创建了相同长度的二进制数组
   alert(arr[1]); // 1，用给定值填充了 4 个字节（无符号 8 位整数）
   ```

3. 如果给定的是另一个 `TypedArray`，也是如此：创建一个相同长度的类型化数组，并复制其内容。如果需要的话，数据在此过程中会被转换为新的类型

   ```js
   let arr16 = new Uint16Array([1, 1000]);
   let arr8 = new Uint8Array(arr16);
   alert(arr8[0]); // 1
   alert(arr8[1]); // 232，试图复制 1000，但无法将 1000 放进 8 位字节中（详述见下文）。
   ```

4. 对于数字参数 `length` 创建类型化数组以包含这么多元素。它的字节长度将是 `length` 乘以单个 `TypedArray.BYTES_PER_ELEMENT` 中的字节数：

   ```js
   let arr = new Uint16Array(4); // 为 4 个整数创建类型化数组
   alert(Uint16Array.BYTES_PER_ELEMENT); // 每个整数 2 个字节
   alert(arr.byteLength); // 8（字节中的大小）
   ```

5. 不带参数的情况下，创建长度为零的类型化数组

我们可以直接创建一个 `TypedArray`，而无需提及 `ArrayBuffer`。但是，视图离不开底层的 `ArrayBuffer`，因此，除第一种情况（已提供 `ArrayBuffer`）外，其他所有情况都会自动创建 `ArrayBuffer`

如要访问底层的 `ArrayBuffer`，那么在 `TypedArray` 中有如下的属性：

- `arr.buffer`：引用 `ArrayBuffer`
- `arr.byteLength`：`ArrayBuffer` 的长度

因此，我们总是可以从一个视图转到另一个视图：

```js
let arr8 = new Uint8Array([0, 1, 2, 3]);

// 同一数据的另一个视图
let arr16 = new Uint16Array(arr8.buffer);
```

下面是类型化数组的列表：

- `Uint8Array`，`Uint16Array`，`Uint32Array`：用于 8、16 和 32 位的整数
  - `Uint8ClampedArray`：用于 8 位整数，在赋值时便“固定“其值（见下文）
- `Int8Array`，`Int16Array`，`Int32Array`：用于有符号整数（可以为负数）
- `Float32Array`，`Float64Array`：用于 32 位和 64 位的有符号浮点数

### 越界行为

如果我们尝试将越界值写入类型化数组会出现什么情况？不会报错。但是多余的位被切除

例如，我们尝试将 256 放入 `Uint8Array`。256 的二进制格式是 `100000000`（9 位），但 `Uint8Array` 每个值只有 8 位，因此可用范围为 0 到 255

对于更大的数字，仅存储最右边的（低位有效）8 位，其余部分被切除：

![arraybuffer-views](./images/8bit-integer-256.svg)

`Uint8ClampedArray` 在这方面比较特殊，它的表现不太一样。对于大于 255 的任何数字，它将保存为 255，对于任何负数，它将保存为 0。此行为对于图像处理很有用

### TypedArray 方法

`TypedArray` 具有常规的 `Array` 方法，但有个明显的例外

我们可以遍历（iterate），`map`，`slice`，`find` 和 `reduce` 等

但有几件事我们做不了：

- 没有 `splice`，我们无法“删除”一个值，因为类型化数组是缓冲区（buffer）上的视图，并且缓冲区（buffer）是固定的、连续的内存区域。我们所能做的就是分配一个零值
- 无 `concat` 方法

还有两种其他方法：

- `arr.set(fromArr, [offset])` 从 `offset`（默认为 0）开始，将 `fromArr` 中的所有元素复制到 `arr`
- `arr.subarray([begin, end])` 创建一个从 `begin` 到 `end`（不包括）相同类型的新视图。这类似于 `slice` 方法（同样也支持），但不复制任何内容，只是创建一个新视图，以对给定片段的数据进行操作

有了这些方法，我们可以复制、混合类型化数组，从现有数组创建新数组等

## DataView 试图

DataView 是在 `ArrayBuffer` 上的一种特殊的超灵活“未类型化”视图。它允许以任何格式访问任何偏移量（offset）的数据。

- 对于类型化的数组，构造器决定了其格式。整个数组应该是统一的。第 i 个数字是 `arr[i]`
- 通过 `DataView`，我们可以使用 `.getUint8(i)` 或 `.getUint16(i)` 之类的方法访问数据。我们在调用方法时选择格式，而不是在构造的时候

语法：

```js
new DataView(buffer, [byteOffset], [byteLength]);
```

- `buffer`：底层的 `ArrayBuffer`。与类型化数组不同，`DataView` 不会自行创建缓冲区（buffer）。我们需要事先准备好
- `byteOffset`：视图的起始字节位置（默认为 0）
- `byteLength`：视图的字节长度（默认至 `buffer` 的末尾）

例如，这里我们从同一个 buffer 中提取不同格式的数字：

```js
// 4 个字节的二进制数组，每个都是最大值 255
let buffer = new Uint8Array([255, 255, 255, 255]).buffer;

let dataView = new DataView(buffer);

// 在偏移量为 0 处获取 8 位数字
alert(dataView.getUint8(0)); // 255

// 现在在偏移量为 0 处获取 16 位数字，它由 2 个字节组成，一起解析为 65535
alert(dataView.getUint16(0)); // 65535（最大的 16 位无符号整数）

// 在偏移量为 0 处获取 32 位数字
alert(dataView.getUint32(0)); // 4294967295（最大的 32 位无符号整数）

dataView.setUint32(0, 0); // 将 4 个字节的数字设为 0，即将所有字节都设为 0
```

当我们将混合格式的数据存储在同一缓冲区（buffer）中时，`DataView` 非常有用。例如，当我们存储一个成对序列（16 位整数，32 位浮点数）时，用 `DataView` 可以轻松访问它们
