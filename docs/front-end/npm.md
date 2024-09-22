# NPM

## 切换淘宝源

**全局设置**

```bash
npm config get registry # 查看当前源
npm config set registry https://registry.npmmirror.com/
npm config delete registry # 还原源
```

**局部设置**

`.npmrc`

```
registry = https://registry.npmmirror.com/
```

## 参考

[NVM 安装与配置教程](https://zhuanlan.zhihu.com/p/608604094)

[无法加载文件 C:\Program Files\nodejs\pnpm.ps1，因为在此系统上禁止运行脚本](https://www.cnblogs.com/big--Bear/p/16489432.html)
