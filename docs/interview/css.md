# CSS

## BFC

### 什么是 BFC？

BFC 是 Block Formatting Context 的缩写，意为块级格式化上下文。它是一种独立的渲染区域，其中的元素按照一定的规则进行布局，并且与外部的布局不发生影响。BFC 的主要作用是隔离元素之间的布局行为，特别是在处理浮动和垂直间距等问题时非常有效

### BFC 的触发条件

1. `overflow` 属性值为 `hidden`、`scroll` 或 `auto`
2. `display` 属性值为 `flow-root`
3. `position` 属性值为 `absolute` 或 `fixed`
4. `float` 属性值为 `left` 或 `right`
5. `display` 属性值为 `inline-block`、`inline-flex`、`inline-grid`

### BFC 的作用

1. **清除浮动**：BFC 可以用来解决浮动元素造成的布局问题，比如包含浮动子元素的父元素高度塌陷的问题。只要父元素创建了一个新的 BFC，浮动子元素的高度会被包含在内
2. **防止外边距合并**：BFC 能够防止相邻块级元素的垂直外边距合并问题。通常情况下，两个相邻块级元素的外边距会合并，而 BFC 使它们的外边距保持独立
