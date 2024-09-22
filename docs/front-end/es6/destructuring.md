# 变量的解构赋值

## 数组的解构赋值

### 基本用法

### 默认值

解构赋值允许指定默认值

```javascript
let [foo = true] = [];
foo; // true

let [x, y = "b"] = ["a"]; // x='a', y='b'
let [x, y = "b"] = ["a", undefined]; // x='a', y='b'
```

> 注意，只有当一个数组成员严格等于 `undefined`，默认值才会生效
