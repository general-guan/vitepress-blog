# 图片懒加载

```html
<body>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <img data-src="./img1.gif" alt="" />
  <img data-src="./img2.gif" alt="" />
  <img data-src="./img3.gif" alt="" />
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
  <p>Lorem ipsum dolor sit</p>
</body>
```

## 原生

### 方式一

通过监听滚动事件，利用 **图片距离视口顶部的高度** 与 **视口的高度** 作比较，判断图片是否出现在可视区域内，如果在，则加载图片

> 缺点：需要监听滚动事件，消耗性能

```javascript
const images = document.querySelectorAll("img");

window.addEventListener("scroll", (e) => {
  images.forEach((image) => {
    const imageTop = image.getBoundingClientRect().top;
    if (imageTop < window.innerHeight) {
      const data_src = image.getAttribute("data-src");
      image.setAttribute("src", data_src);
    }
  });
});
```

### 方式二

使用 `IntersectionObserver` 的方式，可以 **观察元素与视口的交叉区域** 来实现图片的懒加载

```javascript
const images = document.querySelectorAll("img");

const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const image = entry.target;
      const data_src = image.getAttribute("data-src");
      image.setAttribute("src", data_src);
      observer.unobserve(image);
    }
  });
};

const observer = new IntersectionObserver(callback);

images.forEach((image) => {
  observer.observe(image);
});
```

## vue

使用自定义指令

```typescript
// directives/lazy.ts

export default {
  mounted(el: HTMLImageElement) {
    const imgSrc = el.src;
    el.src = "";
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        el.src = imgSrc;
        observer.unobserve(el);
      }
    });
    observer.observe(el);
  },
};
```

## 参考

[JavaScript 图片懒加载 - Web 前端工程师面试题讲解 - 哔哩哔哩 - bilibili](https://www.bilibili.com/video/BV1FU4y157Li/?spm_id_from=333.337.search-card.all.click&vd_source=b3e9124ff68b33f00aefe373ee0d070e)
