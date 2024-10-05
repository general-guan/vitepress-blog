# Pyside

## 环境搭建

1. [下载 Python](https://www.python.org/downloads/)
2. 安装 pyside6

   ```bash
   pip install pyside6

   # 清华大学源
   pip install pyside6 -i https://pypi.tuna.tsinghua.edu.cn/simple
   ```

3. vscode 安装插件
   [PYQT Integration](https://marketplace.visualstudio.com/items?itemName=zhoufeng.pyqt-integration) 并配置
   ```json
   {
     "pyqt-integration.qtdesigner.path": "D:\\software\\Python\\Python312\\Lib\\site-packages\\PySide6\\designer.exe",
     "pyqt-integration.pyrcc.cmd": "D:\\software\\Python\\Python312\\Scripts\\pyside6-rcc.exe",
     "pyqt-integration.pyuic.cmd": "D:\\software\\Python\\Python312\\Scripts\\pyside6-uic.exe"
   }
   ```
