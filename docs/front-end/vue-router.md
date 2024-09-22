

# Vue-Router

## 安装

```bash
pnpm add vue-router@4
```

`router/index.ts`

```ts
import { createWebHashHistory, createRouter } from "vue-router";

import HomeView from "./HomeView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: () => import("./AboutView.vue") },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
```

`main.ts`

```ts
import { router } from "@/router";

const app = createApp(App);
app.use(router).mount("#app");
```

`App.vue`

```html
<RouterView />
```
