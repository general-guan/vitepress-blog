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
      { text: "生活", link: "/life/proverb" },
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
