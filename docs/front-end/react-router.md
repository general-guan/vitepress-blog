# React-Router

## 安装

```bash
npm install react-router-dom
```

## 开始

`main.tsx`

```tsx
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // [!code ++]

const router = createBrowserRouter([
  { path: "/", element: <h1>Hello World!</h1> }, // [!code ++]
  { path: "/about", element: <h1>Hello About!</h1> }, // [!code ++]
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}></RouterProvider> // [!code highlight]
);
```

## 组件

### Link

> 有效优化跳转性能

```tsx
import { Link } from "react-router-dom";

<Link to="/about">To About</Link>;
```

### Outlet

> 类似 Layout 子组件的作用

`main.tsx`

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <h1>Hello World!</h1> },
      { path: "/about", element: <h1>Hello About!</h1> },
    ],
  },
]);
```

`Layout.tsx`

```tsx
import { Link, Outlet } from "react-router-dom";

const LayoutPage = () => {
  return (
    <>
      <Link to="/">To Home</Link>
      <Link to="/about">To About</Link>
      <Outlet />
    </>
  );
};

export default LayoutPage;
```

### NavLink

> 导航链接，能知道自己的状态

```tsx
import { NavLink } from "react-router-dom";

<NavLink
  to="/messages"
  className={({ isActive, isPending }) =>
    isPending ? "pending" : isActive ? "active" : ""
  }
>
  Messages
</NavLink>;
```

## Hooks

### useLoaderData

> 页面加载前获取数据，也可以用来获取 url 里的参数

`main.tsx`

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/posts/:id",
        element: <Posts />,
        loader: async ({ params }) => {
          return {
            id: params.id,
          };
        },
      },
    ],
  },
]);
```

`Posts.tsx`

```tsx
import { useLoaderData } from "react-router-dom";

const PostsPage = () => {
  const { id } = useLoaderData();
  console.log(id);
  return <h1>Hello Posts!</h1>;
};

export default PostsPage;
```

## 参考

[React-Router 官网](https://reactrouter.com/en/main)

[2023 最新 React Router 基础及 Data API ｜粤语中字\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1FX4y1q72i/?spm_id_from=333.999.top_right_bar_window_custom_collection.content.click&vd_source=b3e9124ff68b33f00aefe373ee0d070e)
