# useTransition

`useTransition` 是一个帮助你在不阻塞 UI 的情况下更新状态的 React Hook

```jsx
const [isPending, startTransition] = useTransition();
```

## 参考

### useTransition()

在组件顶层调用 `useTransition`，将某些状态更新标记为 transition。

```jsx
import { useTransition } from "react";

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ……
}
```

#### 参数

`useTransition` 不需要任何参数

#### 返回值

`useTransition` 返回一个由两个元素组成的数组：

1. `isPending`，告诉你是否存在待处理的 transition
2. `startTransition` 函数，你可以使用此方法将状态更新标记为 transition

### startTransition 函数

`useTransition` 返回的 `startTransition` 函数允许你将状态更新标记为 transition

```jsx
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("about");

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ……
}
```

#### 参数

- 作用域（scope）：一个通过调用一个或多个 `set` 函数 更新状态的函数。React 会立即不带参数地调用此函数，并将在 `scope` 调用期间将所有同步安排的状态更新标记为 transition。它们将是非阻塞的，并且 不会显示不想要的加载指示器

#### 返回值

`startTransition` 不返回任何值

#### 注意

- `useTransition` 是一个 Hook，因此只能在组件或自定义 Hook 内部调用。如果需要在其他地方启动 transition（例如从数据库），请调用独立的 `startTransition` 函数
- 只有在可以访问该状态的 `set` 函数时，才能将其对应的状态更新包装为 transition。如果你想启用 Transition 以响应某个 prop 或自定义 Hook 值，请尝试使用 `useDeferredValue`
- 传递给 `startTransition` 的函数必须是同步的。React 会立即执行此函数，并将在其执行期间发生的所有状态更新标记为 transition。如果在其执行期间，尝试稍后执行状态更新（例如在一个定时器中执行状态更新），这些状态更新不会被标记为 transition
- `startTransition` 函数具有稳定的标识，所以你经常会看到 Effect 的依赖数组中会省略它，即使包含它也不会导致 Effect 重新触发。如果 linter 允许你省略依赖项并且没有报错，那么你就可以安全地省略它
- 标记为 Transition 的状态更新将被其他状态更新打断。例如在 Transition 中更新图表组件，并在图表组件仍在重新渲染时继续在输入框中输入，React 将首先处理输入框的更新，之后再重新启动对图表组件的渲染工作
- Transition 更新不能用于控制文本输入
- 目前，React 会批处理多个同时进行的 transition。这是一个限制，可能会在未来版本中删除

## 用法

### 将状态更新标记为非阻塞的 Transition

在组件的顶层调用 `useTransition` 以将状态更新标记为非阻塞的 transition

```jsx
import { useState, useTransition } from "react";

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ……
}
```

`useTransition` 返回一个由两个元素组成的数组：

1. `isPending`，告诉你是否存在待处理的 transition
2. `startTransition` 函数，你可以使用此方法将状态更新标记为 transition

你可以按照以下方式将状态更新标记为 transition：

```jsx
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("about");

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ……
}
```

transition 可以使用户界面的更新在慢速设备上仍保持响应性

通过 transition，UI 仍将在重新渲染过程中保持响应性。例如用户点击一个选项卡，但改变了主意并点击另一个选项卡，他们可以在不等待第一个重新渲染完成的情况下完成操作

::: code-group

```tsx [App.tsx]
import { useState, useTransition } from "react";
import TabButton from "./TabButton.js";
import AboutTab from "./AboutTab.js";
import PostsTab from "./PostsTab.js";
import ContactTab from "./ContactTab.js";

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("about");

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton isActive={tab === "about"} onClick={() => selectTab("about")}>
        About
      </TabButton>
      <TabButton isActive={tab === "posts"} onClick={() => selectTab("posts")}>
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === "contact"}
        onClick={() => selectTab("contact")}
      >
        Contact
      </TabButton>
      <hr />
      {tab === "about" && <AboutTab />}
      {tab === "posts" && <PostsTab />}
      {tab === "contact" && <ContactTab />}
    </>
  );
}
```

```tsx [TabButton.tsx]
import { useTransition } from "react";

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>;
  }
  return (
    <button
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </button>
  );
}
```

```tsx [AboutTab.tsx]
export default function AboutTab() {
  return <p>Welcome to my profile!</p>;
}
```

```tsx [PostsTab.tsx]
import { memo } from "react";

const PostsTab = memo(function PostsTab() {
  // 打印一次。真正变慢的地方在 SlowPost 内。
  console.log("[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />");

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return <ul className="items">{items}</ul>;
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 每个 item 都等待 1 毫秒以模拟极慢的代码。
  }

  return <li className="item">Post #{index + 1}</li>;
}

export default PostsTab;
```

```tsx [ContactTab.tsx]
export default function ContactTab() {
  return (
    <>
      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

:::

### 在 Transition 期间显示待处理的视觉状态

你可以使用 `useTransition` 返回的 `isPending` 布尔值来向用户表明当前处于 Transition 中。例如，选项卡按钮可以有一个特殊的“pending”视觉状态：

```jsx
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

## 疑难解答

### 在 Transition 中无法更新输入框内容

不应将控制输入框的状态变量标记为 transition：

```jsx
const [text, setText] = useState("");
// ...
function handleChange(e) {
  // ❌ 不应将受控输入框的状态变量标记为 Transition
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

这是因为 Transition 是非阻塞的，但是在响应更改事件时更新输入应该是同步的。如果想在输入时运行一个 transition，那么有两种做法：

1. 声明两个独立的状态变量：一个用于输入状态（它总是同步更新），另一个用于在 Transition 中更新。这样，便可以使用同步状态控制输入，并将用于 Transition 的状态变量（它将“滞后”于输入）传递给其余的渲染逻辑
2. 或者使用一个状态变量，并添加 `useDeferredValue`，它将“滞后”于实际值，并自动触发非阻塞的重新渲染以“追赶”新值

### React 没有将状态更新视为 Transition

当在 Transition 中包装状态更新时，请确保它发生在 `startTransition` 调用期间：

```jsx
startTransition(() => {
  // ✅ 在调用 startTransition 中更新状态
  setPage("/about");
});
```

传递给 `startTransition` 的函数必须是同步的

你不能像这样将更新标记为 transition：

```jsx
startTransition(() => {
  // ❌ 在调用 startTransition 后更新状态
  setTimeout(() => {
    setPage("/about");
  }, 1000);
});
```

相反，你可以这样做：

```jsx
setTimeout(() => {
  startTransition(() => {
    // ✅ 在调用 startTransition 中更新状态
    setPage("/about");
  });
}, 1000);
```

类似地，你不能像这样将更新标记为 transition：

```jsx
startTransition(async () => {
  await someAsyncFunction();
  // ❌ 在调用 startTransition 后更新状态
  setPage("/about");
});
```

然而，使用以下方法可以正常工作：

```jsx
await someAsyncFunction();
startTransition(() => {
  // ✅ 在调用 startTransition 中更新状态
  setPage("/about");
});
```

### 我想在组件外部调用 useTransition

`useTransition` 是一个 Hook，因此不能在组件外部调用。请使用独立的 `startTransition` 方法。它们的工作方式相同，但不提供 `isPending` 标记

### 我传递给 startTransition 的函数会立即执行

如果你运行这段代码，它将会打印 1, 2, 3：

```jsx
console.log(1);
startTransition(() => {
  console.log(2);
  setPage("/about");
});
console.log(3);
```
