# Monorepo

Monorepo 是一种项目管理方式，就是把多个项目放在一个仓库里面

pnpm 原生支持 Monorepo，且比 npm 和 yarn 更快一些

## 搞一个 Monorepo 的 demo

### 准备工作

现在我们就开始使用 pnpm 来构建一个 Monorepo，在正事开始之前，你先需要保证你的电脑中具有 Node.js

首先你需要有 pnpm 这个工具，安装的话可以从官网找方法，或者直接使用 npm 安装，命令如下：

```bash
npm i pnpm -g
```

第一步，创建一个项目的根目录，这里就叫 monorepo-demo

```bash
mkdir monorepo-demo
```

第二步，初始化 package.json

```bash
pnpm init
```

这里我对内容做了一点修改，package.json 的内容如下：

主要添加了一个 `type` 字段，这里我使用 ESModule 模块化规范

```json
{
  "name": "monorepo-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "type": "module",
  "keywords": [],
  "author": "",
  "license": "MIT"
}
```

第三步，创建 pnpm-workspace.yaml 文件，这个文件定义了工作空间的根目录，内容如下：

```yaml
packages:
  - "packages/**"
```

现在我们就可以在 packages 中创建多个项目了，目录结构如下：

```plain
monorepo-demo
├── package.json
├── packages
│   ├── components
│   │   ├── index.js
│   │   └── package.json
│   ├── core
│   │   ├── index.js
│   │   └── package.json
│   ├── utils
│   │   ├── index.js
│   │   └── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

第四步，编写每个项目的 package.json，其实主要是编写一下名称，方便以后使用，这里我的如下：

```json
{
  "name": "@packages/components",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "type": "module",
  "license": "ISC"
}
```

剩余的两个名称分别为 `@packages/core` 和 `@packages/utils`

### 安装依赖

就这个 demo 来说，我们如果在根目录下安装依赖的话，这个依赖可以在所有的 packages 中使用，如果我们需要为具体的一个 package 安装依赖怎么办？

cd 到 package 的所在目录嘛？漏，大漏特漏，我们可以通过下面这个命令：

```bash
pnpm --filter <package_selector> <command>
```

例如我们需要在 `@packages/components` 安装 `lodash`，命令如下：

```bash
pnpm -F @packages/components add lodash
```

> `-F` 等价于 `--filter`

现在我们再往 `@packages/utils` 中安装一个 `dayjs`，命令如下：

```bash
pnpm --filter @packages/utils add dayjs
```

### packageA 中引用 packageB

现在我们就来实现 package 间的相互引用，首先我们在 packages/utils/index.js 中写入如下内容：

```javascript
import dayjs from "dayjs";
export function format(time, f = "YYYY-MM-DD") {
  return dayjs(time).format(f);
}
```

然后我们执行如下命令：

```bash
pnpm -F @packages/components add @packages/utils@*
```

这个命令表示在 `@packages/components` 安装 `@packages/utils`，其中的 `@*` 表示默认同步最新版本，省去每次都要同步最新版本的问题

安装完成后 packages/components/package.json 内容如下：

```json
{
  "name": "@packages/components",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "type": "module",
  "license": "ISC",
  "dependencies": {
    "@packages/utils": "workspace: *",
    "lodash": "^4.17.21"
  }
}
```

然后我们在 packages/components/index.js 写入如下内容：

```javascript
import { format } from "@packages/utils";
console.log(format(new Date()));
```

然后我们在项目根目录运行如下命令：

```bash
node packages/components
```

即可打印出当前的日期

## 常用

```bash
# 安装
pnpm install vue -w # 包安装在根目录
pnpm install vue -r # 包安装在所有 packages 中

# 执行所有 packages 的 serve 命令
pnpm run --parallel serve

# 指定 packages
# pnpm --filter <package_selector> <command>
pnpm --filter @packages/utils add dayjs # 指定 packages 中安装包
pnpm --filter @packages/utils serve # 运行指定 packages 中指令
```
