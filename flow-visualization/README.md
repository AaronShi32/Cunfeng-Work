# flow-visualization

本项目为基于 React + Vite 的可视化流程编辑器开发模板，适合集成 react-flow 及相关自定义组件。

## 目录结构

```
flow-visualization/
├── public/                # 静态资源与 HTML 模板
│   └── index.html
├── src/                   # 源码目录
│   ├── components/        # 业务组件（如 FlowEditor、NodePanel 等）
│   ├── App.jsx            # 应用主入口
│   └── main.jsx           # React 渲染入口
├── package.json           # 依赖与脚本
├── vite.config.js         # Vite 配置
├── README.md              # 项目说明
└── .gitignore
```

## 快速开始

1. 安装依赖

```sh
npm install
```

2. 启动开发环境

```sh
npm run dev
```

3. 访问 http://localhost:5173 查看效果

## 集成 react-flow

安装 react-flow：

```sh
npm install reactflow
```

在 `src/components/FlowEditor.jsx` 中编写你的流程编辑器组件。

## 推荐开发流程
- 业务组件统一放在 `src/components/`
- 页面入口逻辑写在 `src/App.jsx`
- 静态资源放在 `public/`

---

如需部署为静态网页，可执行：

```sh
npm run build
```

产物位于 `dist/` 目录，可直接部署到静态 Web 服务（如 Azure Static Web Apps）。
