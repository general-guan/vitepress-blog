# Pinia

[官方地址](https://pinia.vuejs.org/zh/)

## 安装

```bash
yarn add pinia
# 或者使用 npm
npm install pinia
```

创建一个 pinia 实例 (根 store) 并将其传递给应用：

```js
import { createApp } from "vue";
// highlight-next-line
import { createPinia } from "pinia";
import App from "./App.vue";

// highlight-start
const pinia = createPinia();
const app = createApp(App);
// highlight-end

// highlight-next-line
app.use(pinia);
app.mount("#app");
```

## Store

1. 新建一个文件夹 Store

2. 新建文件 Store --> [name].ts

3. 我们需要知道存储是使用定义的 defineStore()，并且它需要一个唯一的名称，作为第一个参数传递，我们将名称抽离出去

   新建文件 store-namespace/index.ts

   ```ts
   export const enum Names {
     Test = "TEST",
   }
   ```

   [name].ts（test.ts）

   ```ts
   import { defineStore } from "pinia";
   import { Names } from "./store-namespace";

   // 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
   // 第一个参数是你的应用中 Store 的唯一 ID
   export const useTestStore = defineStore(Names.Test, {
     // 其他配置...
   });
   ```

4. 定义值

   ```ts
   import { defineStore } from "pinia";
   import { Names } from "./store-namespce";

   export const useTestStore = defineStore(Names.Test, {
     // highlight-start
     state: () => {
       return {
         current: 1,
       };
     },
     getters: {},
     actions: {},
     // highlight-end
   });
   ```

## State

### 直接修改

```html
<template>
  <div>
    <button @click="Add">+</button>
    <div>{{ Test.current }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useTestStore } from "./store";
  const Test = useTestStore();
  const Add = () => {
    // highlight-next-line
    Test.current++;
  };
</script>
```

### 批量修改

```html
<template>
  <div>
    <button @click="Add">+</button>
    <div>{{ Test.current }}</div>
    <div>{{ Test.age }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useTestStore } from "./store";
  const Test = useTestStore();
  const Add = () => {
    // highlight-start
    Test.$patch({
      current: 200,
      age: 300,
    });
    // highlight-end
  };
</script>
```

### 批量修改（函数形式）

```html
<template>
  <div>
    <button @click="Add">+</button>
    <div>{{ Test.current }}</div>
    <div>{{ Test.age }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useTestStore } from "./store";
  const Test = useTestStore();
  const Add = () => {
    // highlight-start
    Test.$patch((state) => {
      state.current++;
      state.age = 40;
    });
    // highlight-end
  };
</script>
```

### 通过原始对象修改

:::warning
`$state` 您可以通过将 store 的属性设置为新对象来替换 store 的整个状态

缺点就是必须修改整个对象的所有属性
:::

```html
<template>
  <div>
    <button @click="Add">+</button>
    <div>{{ Test.current }}</div>
    <div>{{ Test.age }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useTestStore } from "./store";
  const Test = useTestStore();
  const Add = () => {
    // highlight-start
    Test.$state = {
      current: 10,
      age: 30,
    };
    // highlight-end
  };
</script>
```

### 通过 actions 修改

定义 actions

```ts
import { defineStore } from "pinia";
import { Names } from "./store-naspace";
export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return {
      current: 1,
      age: 30,
    };
  },
  // highlight-start
  actions: {
    setCurrent() {
      this.current++;
    },
  },
  // highlight-end
});
```

调用

```html
<template>
  <div>
    <button @click="Add">+</button>
    <div>{{ Test.current }}</div>
    <div>{{ Test.age }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useTestStore } from "./store";
  const Test = useTestStore();
  const Add = () => {
    // highlight-next-line
    Test.setCurrent();
  };
</script>
```

## Actions

### 同步

```ts
import { defineStore } from "pinia";
import { Names } from "./store-naspace";
export const useTestStore = defineStore(Names.TEST, {
  state: () => ({
    counter: 0,
  }),
  actions: {
    // highlight-start
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random());
    },
    // highlight-end
  },
});
```

```html
<template>
  <div>
    <button @click="Add">+</button>
    <div>{{ Test.counter }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useTestStore } from "./store";
  const Test = useTestStore();
  const Add = () => {
    // highlight-next-line
    Test.randomizeCounter();
  };
</script>
```

### 异步

可以结合 `async` `await` 修饰

```ts
import { defineStore } from "pinia";
import { Names } from "./store-naspace";

type Result = {
  name: string;
  isChu: boolean;
};

const Login = (): Promise<Result> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "小满",
        isChu: true,
      });
    }, 3000);
  });
};

export const useTestStore = defineStore(Names.TEST, {
  state: () => ({
    user: <Result>{},
    name: "123",
  }),
  actions: {
    // highlight-start
    async getLoginInfo() {
      const result = await Login();
      this.user = result;
    },
    // highlight-end
  },
});
```

## getters

主要作用类似于 `computed` 数据修饰并且有缓存

普通函数形式可以使用 `this`

```ts
export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return {
      current: 1,
    };
  },
  getters: {
    newCurrent(): number {
      return ++this.current;
    },
  },
});
```

使用箭头函数不能使用 `this`，`this` 指向已改变成指向 `undefined`，修改值请用 `state`

```ts
export const useTestStore = defineStore(Names.TEST, {
  state: () => {
    return {
      current: 1,
    };
  },
  getters: {
    newPrice: (state) => `$${state.current}`,
  },
});
```

## API

### $reset

重置 store 到他的初始状态

```ts
Test.$reset();
```

### $subscribe

订阅 state 的改变，只要 state 变化就会走这个函数

```ts
Test.$subscribe((args, state) => {
  console.log(args, state);
});
```

第二个参数

如果你的组件卸载之后还想继续调用请设置第二个参数

```ts
Test.$subscribe(
  (args, state) => {
    console.log(args, state);
  },
  {
    detached: true,
  }
);
```

### $onAction

只要有 actions 被调用就会走这个函数

```ts
Test.$onAction((args) => {
  console.log(args);
});
```
