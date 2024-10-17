# Prettier

## 命令行

```bash
# 安装
npm i prettier -g

# 格式化所有文件
prettier --write .
```

## 文件格式

- `.prettierrc.js`
- `.prettierrc`

## 配置选项

### Print Width

单行代码的最大宽度

| 默认值 | 配置格式            |
| ------ | ------------------- |
| `80`   | `printWidth: <int>` |

### Tab Width

指定每个缩进的空格数

| 默认值 | 配置格式          |
| ------ | ----------------- |
| `2`    | `tabWidth: <int>` |

### Tabs

使用 tab（制表位）缩进而非空格

| 默认值  | 配置格式          |
| ------- | ----------------- |
| `false` | `useTabs: <bool>` |

### Semicolons

在语句末尾添加分号

| 默认值 | 配置格式       |
| ------ | -------------- |
| `true` | `semi: <bool>` |

参数含义：

- `true`：在每一条语句后面添加分号
- `false`：只在有可能导致 ASI 错误的行首添加分号

### Quotes

使用单引号而非双引号

| 默认值  | 配置格式              |
| ------- | --------------------- |
| `false` | `singleQuote: <bool>` |

### Quote Props

| 默认值      | 配置格式                                          |
| ----------- | ------------------------------------------------- |
| `as-needed` | `quoteProps: <as-needed \ consistent \ preserve>` |

参数含义：

- `as-needed`：仅在需要时在对象属性周围添加引号
- `consistent`：如果对象中的至少一个属性需要加引号，就对所有属性加引号
- `preserve`：按照对象属性中引号的输入用法

### JSX Quotes

在 JSX 中使用单引号

| 默认值  | 配置格式                 |
| ------- | ------------------------ |
| `false` | `jsxSingleQuote: <bool>` |

### Trailing Commas

在任何可能的多行中输入尾逗号

| 默认值 | 配置格式                            |
| ------ | ----------------------------------- |
| `es5`  | `trailingComma: <es5 \ none \ all>` |

参数含义：

- `none`：无尾逗号
- `es5`：添加 es5 中被支持的尾逗号
- `all`：所有可能的地方都被添加尾逗号

### Bracket Spacing

括号空格

| 默认值 | 配置格式                 |
| ------ | ------------------------ |
| `true` | `bracketSpacing: <bool>` |

参数含义：

- `true`：格式化结果为 : `{ foo: bar }`
- `false`：格式化结果为 : `{foo: bar}`

### JSX Brackets

在多行 JSX 元素最后一行的末尾添加 `>` 而使 `>` 单独一行（不适用于自闭和元素）

| 默认值  | 配置格式                     |
| ------- | ---------------------------- |
| `false` | `jsxBracketSameLine: <bool>` |

参数含义：

- `true`：格式化结果为：

```latex
<button
  className="prettier-class"
  id="prettier-id"
  onClick={this.handleClick}>
  Click Here
</button>
```

- `false`：格式化结果为：

```jsx
<button className="prettier-class" id="prettier-id" onClick={this.handleClick}>
  Click Here
</button>
```

### Arrow Function Parentheses

为单行箭头函数的参数添加圆括号

| 默认值   | 配置格式                         |
| -------- | -------------------------------- |
| `always` | `arrowParens: "<always \ avoid>` |

参数含义：

- `avoid`：格式化结果为 : `x => x`
- `always`：格式化结果为 : `(x) => x`

### Vue files script and style tags indentation

缩进 Vue 文件中

| 默认值  | 配置格式                          |
| ------- | --------------------------------- |
| `false` | `vueIndentScriptAndStyle: <bool>` |

参数含义：

- `false`：不缩进 Vue 文件中的脚本和样式标签
- `true`：缩进 Vue 文件中的脚本和样式标签

### End of Line

设置统一的行结尾样式

参数含义：

- `lf`：仅换行（`\n`），在 Linux 和 macOS 以及 git repos 内部通用
- `crlf`：回车符 + 换行符（`\r\n`），在 Windows 上很常见
- `cr`：仅回车符（`\r`），很少使用
- `auto`：保持现有的行尾

## 常用配置

`.prettierrc.js`

```javascript
module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: "as-needed",
  jsxSingleQuote: true,
  trailingComma: "all",
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: "avoid",
  vueIndentScriptAndStyle: true,
  endOfLine: "lf",
};
```

## 参考地址

[Options · Prettier 中文网](https://www.prettier.cn/docs/options.html)
