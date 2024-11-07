import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "点解我最型の博客",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo-small1.png",
    search: {
      provider: "local",
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    outline: {
      label: "页面导航",
      level: [2, 3],
    },

    nav: [
      { text: "前端", link: "/front-end/es6/destructuring" },
      { text: "后端", link: "/back-end/python/pyside" },
      { text: "生活", link: "/life/proverb" },
      { text: "面试", link: "/interview/html" },
      { text: "常用网站", link: "/link" },
    ],

    sidebar: {
      "/front-end/": {
        base: "/front-end",
        items: [
          {
            text: "业务",
            collapsed: true,
            items: [
              { text: "PDF 常见处理", link: "/business/pdf-common-handle" },
            ],
          },
          {
            text: "JavaScript",
            collapsed: true,
            items: [
              {
                text: "运算符",
                items: [
                  {
                    text: "比较运算符",
                    link: "/javascript/operators/comparison",
                  },
                ],
              },
              {
                text: "语法专题",
                items: [
                  {
                    text: "数据类型的转换",
                    link: "/javascript/features/conversion",
                  },
                ],
              },
              {
                text: "标准库",
                items: [
                  {
                    text: "Object 对象",
                    link: "/javascript/stdlib/object",
                  },
                  {
                    text: "属性描述对象",
                    link: "/javascript/stdlib/attributes",
                  },
                ],
              },
              {
                text: "面向对象编程",
                items: [
                  {
                    text: "对象的继承",
                    link: "/javascript/oop/prototype",
                  },
                ],
              },
              {
                text: "事件",
                items: [
                  {
                    text: "EventTarget 接口",
                    link: "/javascript/events/eventtarget",
                  },
                  {
                    text: "事件模型",
                    link: "/javascript/events/model",
                  },
                ],
              },
            ],
          },
          {
            text: "ES6",
            collapsed: true,
            items: [
              { text: "变量的解构赋值", link: "/es6/destructuring" },
              { text: "Symbol", link: "/es6/symbol" },
            ],
          },
          {
            text: "Vue-Router",
            link: "/vue-router",
          },
          {
            text: "Vite",
            link: "/vite",
          },
          {
            text: "TypeScript",
            link: "/typescript",
          },
          {
            text: "Axios",
            link: "/axios",
          },
          {
            text: "Git",
            link: "/git",
          },
          {
            text: "Github",
            link: "/github",
          },
          {
            text: "NPM",
            link: "/npm",
          },
          {
            text: "Bun",
            link: "/bun",
          },
          {
            text: "React-Router",
            link: "/react-router",
          },
          {
            text: "Electron",
            link: "/electron",
          },
          {
            text: "Nginx",
            link: "/nginx",
          },
          {
            text: "Zustand",
            link: "/zustand",
          },
          {
            text: "Prettier",
            link: "/prettier",
          },
        ],
      },
      "/back-end/": {
        base: "/back-end",
        items: [
          {
            text: "Python",
            items: [{ text: "Pyside", link: "/python/pyside" }],
          },
        ],
      },
      "/interview/": {
        base: "/interview",
        items: [
          { text: "HTML", link: "/html" },
          { text: "CSS", link: "/css" },
          { text: "JavaScript", link: "/javascript" },
        ],
      },
      "/life/": {
        base: "/life",
        items: [
          { text: "好词好句", link: "/proverb" },
          { text: "羽毛球", link: "/badminton" },
          {
            text: "爬山",
            items: [{ text: "梧桐山", link: "/mountain/wutong-mountain" }],
          },
        ],
      },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
