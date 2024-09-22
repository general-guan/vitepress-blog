# Electron

## 使用 vite 构建 electron 项目

创建一个 vite 项目

```bash
npm init vite@latest
```

安装 electron（安装缓慢的话使用 cnpm）

```bash
npm install electron -D
npm install vite-plugin-electron -D
npm install vite-plugin-electron-renderer -D # 通信插件
```

根目录新建 electron/main.ts，并修改 vite.config.ts、package.json、.gitignore

`electron/main.ts`

```ts
// app 控制应用程序的事件生命周期
// BrowserWindow 创建并控制浏览器窗口
import { app, BrowserWindow } from "electron";
import path from "path";

// 定义全局变量，获取窗口实例
let win: BrowserWindow | null;

const createWindow = () => {
  win = new BrowserWindow({
    webPreferences: {
      devTools: true,
      contextIsolation: false,
      // 允许 html 页面上的 javascipt 代码访问 nodejs 环境 api 代码的能力（与 node 集成的意思）
      nodeIntegration: true,
    },
  });
  if (process.env.NODE_ENV === "development") {
    win.loadURL(process.env["VITE_DEV_SERVER_URL"]!);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};
//在Electron完成初始化时被触发
app.whenReady().then(createWindow);
```

`vite.config.ts`

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron"; // [!code ++]
import electronRender from "vite-plugin-electron-renderer"; // [!code ++]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({ entry: "electron/main.ts" }), // [!code ++]
    electronRender(), // [!code ++]
  ],
});
```

`package.json`

```json
{
  "name": "smt-desktop",
  "private": true,
  "version": "0.0.0",
  "type": "module", // [!code --]
  "main": "dist-electron/main.js", // [!code ++]
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.2.47"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.1.0",
    "electron": "^24.1.1",
    "typescript": "^4.9.3",
    "vite": "^4.2.0",
    "vite-plugin-electron": "^0.11.1",
    "vite-plugin-electron-renderer": "^0.14.1",
    "vue-tsc": "^1.2.0"
  }
}
```

`.gitignore`

```
dist-electron // [!code ++]
release // [!code ++]
```

运行

```bash
npm run dev
```

## 打包 Electron

需要安装 electron-builder

```bash
npm install electron-builder -D
```

package.json 修改 `npm run build`

`package.json`

```json
"scripts": {
  "build": "vue-tsc --noEmit && vite build && electron-builder", // [!code highlight]
},
```

还有其他打包配置

`package.json`

```json
"build": {
  "appId": "com.electron.desktop",
  "productName": "electron",
  "asar": true,
  "copyright": "Copyright © 2024 electron",
  "directories": {
    "output": "release/"
  },
  "files": [
    "dist/**/*",
    "dist-electron/**/*"
  ],
  "electronDownload": {
    "mirror": "https://npmmirror.com/mirrors/electron/"
  },
  "mac": {
    "artifactName": "${productName}_${version}.${ext}",
    "target": [
      "dmg"
    ]
  },
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": [
          "x64"
        ]
      }
    ],
    "artifactName": "${productName}_${version}.${ext}"
  },
  "nsis": {
    "oneClick": false,
    "perMachine": false,
    "allowToChangeInstallationDirectory": true,
    "deleteAppDataOnUninstall": false
  },
  "publish": [
    {
      "provider": "generic",
      "url": "http://127.0.0.1:8080"
    }
  ],
  "releaseInfo": {
    "releaseNotes": "版本更新的具体内容"
  }
}
```

nsis 配置详解

```json
{
  "oneClick": false, // 创建一键安装程序还是辅助安装程序（默认是一键安装）
  "allowElevation": true, // 是否允许请求提升，如果为false，则用户必须使用提升的权限重新启动安装程序 （仅作用于辅助安装程序）
  "allowToChangeInstallationDirectory": true, // 是否允许修改安装目录 （仅作用于辅助安装程序）
  "installerIcon": "public/timg.ico", // 安装程序图标的路径
  "uninstallerIcon": "public/timg.ico", // 卸载程序图标的路径
  "installerHeader": "public/timg.ico", // 安装时头部图片路径（仅作用于辅助安装程序）
  "installerHeaderIcon": "public/timg.ico", // 安装时标题图标（进度条上方）的路径（仅作用于一键安装程序）
  "installerSidebar": "public/installerSiddebar.bmp", // 安装完毕界面图片的路径，图片后缀.bmp，尺寸164*314 （仅作用于辅助安装程序）
  "uninstallerSidebar": "public/uninstallerSiddebar.bmp", // 开始卸载界面图片的路径，图片后缀.bmp，尺寸164*314 （仅作用于辅助安装程序）
  "uninstallDisplayName": "${productName}${version}", // 控制面板中的卸载程序显示名称
  "createDesktopShortcut": true, // 是否创建桌面快捷方式
  "createStartMenuShortcut": true, // 是否创建开始菜单快捷方式
  "shortcutName": "SHom", // 用于快捷方式的名称，默认为应用程序名称
  "include": "script/installer.nsi", // NSIS包含定制安装程序脚本的路径，安装过程中自行调用  (可用于写入注册表 开机自启动等操作)
  "script": "script/installer.nsi", // 用于自定义安装程序的NSIS脚本的路径
  "deleteAppDataOnUninstall": false, // 是否在卸载时删除应用程序数据（仅作用于一键安装程序）
  "runAfterFinish": true, // 完成后是否运行已安装的应用程序（对于辅助安装程序，应删除相应的复选框）
  "menuCategory": false // 是否为开始菜单快捷方式和程序文件目录创建子菜单，如果为true，则使用公司名称
}
```

打包

```bash
npm run build
```

## Electron Vscode 输出乱码解决方案

`package.json`

```json
"scripts": {
  "dev": "chcp 65001 && vite" // [!code highlight]
},
```

## 渲染进程和主进程通信

渲染进程使用 ipcRenderer 发送

```js
import { ipcRenderer } from "electron";

const open = () => {
  ipcRenderer.send("openFlyCar");
};
```

主进程使用 ipcMain 接收

```js
ipcMain.on("openFlyCar", () => {
  console.log("收到");
});
```

主进程通知渲染进程

```js
const  win = new BrowserWindow(xxxxx)
win!.webContents.send('load', { message: "electron初始化了" })
```

渲染进程接收

```js
ipcRenderer.on("load", (_, data) => {
  console.log(data);
});
```
