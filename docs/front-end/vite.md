# Vite

## 安装

```bash
npm create vite@latest
yarn create vite
pnpm create vite
```

## 配置 alias

`vite.config.ts`

```ts
import path from 'path' // [!code ++]

resolve: {
  alias: { '@': path.resolve(__dirname, 'src') }, // [!code ++]
},
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": "./", // [!code ++]
    "paths": { "@/*": ["src/*"] } // [!code ++]
  }
}
```

## 参考

[Vite 官网](https://cn.vitejs.dev/)
