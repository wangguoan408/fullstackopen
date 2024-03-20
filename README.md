# 预备知识

## 创建 `Vite + React` 项目

```bash
npm create vite@latest your_project_name -- --template react
```

## 在 WSL 中对 Windows 文件启用 HMR

编辑 `vite.config.js` 文件
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    }
  },
})
```