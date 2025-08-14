# NPM

## 常用

### 换源

```bash
npm config get registry # 查看当前源
npm config set registry https://registry.npmmirror.com/
npm config delete registry # 还原源
```

### 全局安装

```bash
npm config get prefix # 查看 npm 全局安装地址
npm list --depth 0 -g # 查看全局安装
npm uninstall -g <package> # 卸载全局安装
```

## 局部设置

`.npmrc`

```
registry = https://registry.npmmirror.com/
```

## 参考

[NVM 安装与配置教程](https://zhuanlan.zhihu.com/p/608604094)

[无法加载文件 C:\Program Files\nodejs\pnpm.ps1，因为在此系统上禁止运行脚本](https://www.cnblogs.com/big--Bear/p/16489432.html)
