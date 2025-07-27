# Viewport 视口

## 什么是 Viewport（视口）

Viewport（视口）是指浏览器中用户可见的那部分网页内容的区域，简单来说，它是用户当前看到的网页的“窗口”区域。在不同的设备上，Viewport 的大小会有所不同。

- 在桌面设备上，Viewport 通常和浏览器窗口的大小一致。
- 在移动设备上，Viewport 是屏幕的可视区域。

## 视口的分类

根据不同的设备，视口可以分为三种类型：

### Layout Viewport（布局视口）

布局视口 是浏览器用于布局网页内容的虚拟视口。对于桌面浏览器，布局视口的宽度通常等于浏览器窗口的宽度。但在移动设备上，为了避免网页内容在小屏幕上被压缩得过小，浏览器会默认提供一个比屏幕宽得多的布局视口（一般在 980px 左右），以确保桌面版网页在手机上看起来不会太窄。

**特点：**

- 这是网页最初布局时所使用的虚拟宽度，浏览器根据这个宽度来排布元素。
- 在移动设备上，布局视口的宽度通常远大于屏幕的实际宽度，以模拟桌面设备的显示效果。

**问题：**

- 一般来说，如果不指定特殊的 Viewport 设置，网页在移动设备上可能会显示得非常小，需要用户手动缩放。

### Visual Viewport（视觉视口）

视觉视口 是用户实际可见的网页区域。这是用户当前看到的网页部分，不包括缩放和滚动后的页面之外的区域。视觉视口会随着缩放和滚动而改变。

**特点：**

- 视觉视口随着缩放而动态变化，缩放时视觉视口会变小（放大页面）或变大（缩小页面）。
- 它是用户当前在屏幕上看到的区域，与用户的视图相关。

### Ideal Viewport（理想视口）

理想视口 是指与设备的物理分辨率和尺寸完美匹配的视口。它提供了在设备屏幕上适合用户阅读的最佳尺寸，而无需缩放。在响应式设计中，开发者通过指定理想视口，可以确保网页在不同设备上看起来合适。

**特点：**

- 理想视口通常通过 meta 标签设置，能够让网页根据设备宽度调整内容，使其无论在大屏幕还是小屏幕设备上都能适应。

## Viewport 相关属性

在移动端中，默认是 Layout Viewport ，为了得到 Ideal Viewport ，开发者可以通过 `<meta>` 标签的 `viewport` 属性来控制网页的视口行为，特别是在移动设备上。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
```

| 属性          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| width         | 设置 layout viewport 的宽度，为一个正整数，或字符串 `width-device` |
| height        | 设置 layout viewport 的高度，这个属性对我们并不重要，很少使用 |
| initial-scale | 设置页面的初始缩放值，为一个数字，可以带小数                 |
| minimum-scale | 允许用户的最小缩放值，为一个数字，可以带小数                 |
| maximum-scale | 允许用户的最大缩放值，为一个数字，可以带小数                 |
| user-scalable | 是否允许用户进行缩放，值为 `no` 或 `yes`, `no` 代表不允许，`yes` 代表允许 |

## 常用

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 参考

[A tale of two viewports — part one](https://www.quirksmode.org/mobile/viewports.html)

[A tale of two viewports — part two](https://www.quirksmode.org/mobile/viewports2.html)

[Meta viewport](https://www.quirksmode.org/mobile/metaviewport/)
