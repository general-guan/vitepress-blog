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

## 基础框架

```py
from PySide6.QtWidgets import QApplication, QMainWindow, QPushButton, QLabel

class MyWindow(QMainWindow):
    def __init__(self):
        super().__init__()

if __name__ == '__main__':
    app = QApplication([])
    window = MyWindow()
    window.show()
    app.exec()
```

## 三种最基础控件

按钮、标签、输入框

```py
from PySide6.QtWidgets import QApplication, QMainWindow, QPushButton, QLabel, QLineEdit

class MyWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        btn = QPushButton('今天天气真好！', self)
        btn.setGeometry(10, 0, 100, 40)
        btn.setToolTip('点我有惊喜！')

        lb = QLabel('真的假的', self)
        lb.setGeometry(10, 40, 200, 40)
        lb.setText('我是被修改后的文字')

        line = QLineEdit(self)
        line.setGeometry(10, 80, 200, 40)
        line.setPlaceholderText('请输入')

if __name__ == '__main__':
    app = QApplication([])
    window = MyWindow()
    window.resize(360, 360)
    window.show()
    app.exec()

```

## 使用静态编译的文件

```py
from PySide6.QtWidgets import QApplication, QMainWindow,QPushButton
from login import Ui_Form

class MyWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.ui = Ui_Form()
        self.ui.setupUi(self)

if __name__ == '__main__':
    app = QApplication([])
    window = MyWindow()
    window.show()
    app.exec()
```
