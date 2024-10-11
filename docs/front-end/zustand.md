# Zustand

## 安装

```bash
npm install zustand
```

## 使用

### 定义

```ts
import { create } from "zustand";

export const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
```

### 绑定组件

```tsx
function BearCounter() {
  const bears = useStore((state) => state.bears);
  return <h1>{bears} around here...</h1>;
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}
```

### TypeScript

```ts
import { create } from "zustand";

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));
```

### 计算属性

```ts
import { create } from "zustand";

const useStore = create((set, get) => ({
  bears: 0,
  // 访问储存状态
  getBears: () => get().bears * 10,
}));
```
