import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "点解我最型の博客",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

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
      { text: "常用网站", link: "/link" },
      { text: "面试", link: "/interview/html" },
    ],

    sidebar: {
      "/interview/": {
        base: "/interview",
        items: [
          { text: "HTML", link: "/html" },
          { text: "CSS", link: "/css" },
          { text: "JavaScript", link: "/javascript" },
        ],
      },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
