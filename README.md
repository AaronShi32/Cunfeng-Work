# Cunfeng-Work

🚀 基于 React + Vite 的现代化前端工作空间，专注于企业级应用和数据可视化解决方案。

## 📋 项目概述

这是一个现代化的前端开发项目，集成了多种企业级功能模块，包括：

- 🏠 **主页导航**：优雅的卡片式导航界面
- 🏢 **Microsoft 集成**：企业级功能和服务集成
- 📊 **ASI 监控**：Azure Service Infrastructure 监控与分析
- 🎨 **可扩展架构**：模块化设计，便于添加新功能

## 🛠️ 技术栈

### 核心技术
- **React 19.1.1** - 现代化 React 框架
- **Vite 6.3.6** - 快速构建工具
- **React Router DOM 6.23.0** - 客户端路由
- **@xyflow/react 12.8.5** - 流程图和数据可视化

### 开发工具
- **ESLint 9.35.0** - 代码质量检查
- **TypeScript 支持** - 类型安全开发体验
- **模块化 CSS** - 组件级样式管理

## 📂 项目结构

```
Cunfeng-Work/
├── .github/                    # GitHub 配置文件
│   └── copilot-instructions.md # Copilot 指令文档
├── web/                        # Web 应用主目录
│   ├── public/                 # 静态资源
│   │   └── ASI-Structure.svg   # ASI 结构图
│   ├── img/                    # 图片资源
│   │   └── ASI/                # ASI 相关图片
│   ├── src/                    # 源码目录
│   │   ├── components/         # React 组件
│   │   │   ├── Home.jsx        # 主页组件
│   │   │   ├── Microsoft.jsx   # Microsoft 功能组件
│   │   │   └── ASI.jsx         # ASI 监控组件
│   │   ├── assets/             # 项目资源
│   │   ├── App.jsx             # 应用根组件
│   │   └── main.jsx            # 应用入口
│   ├── package.json            # 项目依赖配置
│   ├── vite.config.js          # Vite 配置
│   ├── eslint.config.js        # ESLint 配置
│   └── staticwebapp.config.json # Azure Static Web App 配置
└── README.md                   # 项目文档
```

## 🚀 快速开始

### 环境要求
- Node.js 18+ (推荐 18.18.0 或更高版本)
- npm 或 yarn 包管理器

### 安装依赖
```bash
cd web
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 🏗️ 功能模块

### 🏠 主页 (Home)
- 现代化的渐变背景设计
- 卡片式导航布局
- 响应式设计适配
- 技术栈展示

### 🏢 Microsoft 集成
- 企业级功能模块
- Microsoft 服务集成
- 身份验证支持

### 📊 ASI 监控页面
- **结构图展示**：居中显示 ASI-Structure.svg 架构图
- **PowerBI 报告**：内嵌 Fabric Container Service ASI 报告
- **响应式设计**：适配不同屏幕尺寸
- **友好的错误处理**：文件不存在或权限不足时的提示

### 🎨 设计特点
- 现代化 UI/UX 设计
- 一致的视觉风格
- 流畅的交互动画
- 移动端友好

## 📦 部署说明

### Azure Static Web Apps
项目已配置 Azure Static Web Apps 支持：
- `staticwebapp.config.json` 配置文件
- 自动化部署流水线
- 客户端路由支持

### 本地静态部署
```bash
npm run build
# 构建文件位于 dist/ 目录
```

## 🔧 开发指南

### 添加新页面
1. 在 `src/components/` 中创建新组件
2. 在 `App.jsx` 中添加路由配置
3. 在 `Home.jsx` 中添加导航卡片

### 样式规范
- 使用内联样式进行组件级样式管理
- 保持一致的颜色主题
- 响应式设计优先

### 代码质量
- 运行 `npm run lint` 检查代码质量
- 遵循 React Hooks 最佳实践
- 保持组件的单一职责原则

## 🌟 主要特性

- ✅ **现代化技术栈**：使用最新的 React 19 和 Vite 6
- ✅ **企业级集成**：支持 Microsoft 服务和 PowerBI 报告
- ✅ **数据可视化**：集成 React Flow 用于图表展示
- ✅ **响应式设计**：完美适配桌面和移动设备
- ✅ **模块化架构**：易于扩展和维护
- ✅ **代码质量保障**：ESLint 和 TypeScript 支持

## 🤝 贡献指南

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 📧 Email: [你的邮箱]
- 🐙 GitHub Issues: [项目 Issues 页面]

---

⭐ 如果这个项目对您有帮助，请给它一个星标！