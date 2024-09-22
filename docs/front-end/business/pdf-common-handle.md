# PDF 常见处理

## 多个 PDF 合并成一个 PDF

### 安装

[pdf-lib document](https://pdf-lib.js.org/)

```bash
npm install pdf-lib
```

### 使用

```ts
import { PDFDocument } from "pdf-lib";

export async function mergePDFs(pdfUrls: string[]) {
  // 创建一个新的空白PDF文档
  const mergedPdfDoc = await PDFDocument.create();

  for (const pdfUrl of pdfUrls) {
    // 获取PDF文件的二进制数据
    const pdfBytes = await fetch(pdfUrl).then((response) =>
      response.arrayBuffer()
    );

    // 将获取到的PDF文件添加到新的文档中
    const pdfDoc = await PDFDocument.load(pdfBytes);
    // 如果单个PDF为多页，则要一页一页往新建的PDF中添加
    const copiedPages = await mergedPdfDoc.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices()
    );
    copiedPages.forEach((page) => mergedPdfDoc.addPage(page));
  }

  // 将合并后的PDF保存为Blob对象
  const mergedPdfBytes = await mergedPdfDoc.save();
  const mergedPdfBlob = new Blob([mergedPdfBytes], {
    type: "application/pdf",
  });

  return URL.createObjectURL(mergedPdfBlob);
}
```

## 浏览器预览 PDF 去除顶部工具栏

```html
<iframe src="/default.pdf#toolbar=0&scrollbars=0"></iframe>
```
