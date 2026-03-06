# 🚀 Cunfeng-Work

> 个人简历展示平台

## 📝 项目简介

这是一个个人简历展示平台，采用现代化的前端技术栈构建，用于展示个人的工作经历和项目成果。项目采用组件化 + CSS Module 架构，支持多级路由导航、响应式布局和流畅的入场动画。

## 🛠️ 技术栈

### 核心框架
- **React 19.1.1** - 最新的 React 框架
- **Vite 6.3.6** - 快速构建工具
- **React Router DOM 6.23.0** - 客户端路由

### 样式方案
- **CSS Modules** - 模块化样式，避免类名冲突
- **CSS 变量 (Custom Properties)** - 统一设计令牌（颜色、间距、字体等）
- **CSS 动画** - 卡片交错淡入、页面过渡效果

### 开发工具
- **ESLint 9.35.0** - 代码质量检查
- **TypeScript 支持** - 类型安全开发
- **热重载** - 开发时实时更新

## 🏗️ 项目结构

```
web/src/
├── components/          # 页面 & 可复用组件
│   ├── Home.jsx         # 主页 - Alibaba/Microsoft 入口
│   ├── Microsoft.jsx    # 微软项目总览（HDI、ASI、Scout、FCS、Retry Session）
│   ├── Alibaba.jsx      # 阿里云项目总览（ENI、跨可用区迁移）
│   ├── ENI.jsx          # ENI 弹性网卡详情页
│   ├── InstanceMigration.jsx  # 跨可用区迁移详情页
│   ├── ASI.jsx          # ASI 架构图查看
│   ├── FCS.jsx          # FCS 架构图查看
│   ├── PageLayout.jsx   # 🔧 可复用 - 页面布局容器
│   ├── ProjectCard.jsx  # 🔧 可复用 - 项目卡片
│   ├── TechStackBar.jsx # 🔧 可复用 - 技术栈标签栏
│   ├── LinkButton.jsx   # 🔧 可复用 - 外部链接按钮
│   └── ZoomableImageModal.jsx  # 🔧 可复用 - 可缩放图片弹窗
├── styles/              # CSS Module 样式系统
│   ├── theme.css        # CSS 变量定义（颜色、间距、字体）
│   ├── layout.module.css    # 页面布局样式
│   ├── card.module.css      # 卡片样式
│   ├── button.module.css    # 按钮 & 技术栈标签样式
│   └── animation.module.css # 入场动画
├── App.jsx              # 路由配置
├── main.jsx             # 应用入口
└── index.css            # 全局基础样式
```

## 🎯 功能模块

### 🏠 主页 (Home)
- **公司导航**：Alibaba、Microsoft 两大经历卡片，点击进入各自详情
- **技术栈展示**：玻璃拟态风格的技术标签栏
- **入场动画**：卡片交错淡入效果

### 🏢 Microsoft 模块
- **5 大项目展示**：HDInsight、ASI、Scout、FCS、Retry Session
- **架构图弹窗**：点击卡片弹出可缩放/拖拽的架构图
- **技术栈标签**：C#/.NET、Azure/AKS/ACI、Service Fabric、Kusto/PowerBI

### ☁️ Alibaba 模块
- **项目导航**：ENI 弹性网卡、跨可用区迁移
- **详情页面**：项目介绍、涉及 API、官方文档链接
- **统一风格**：与微软模块一致的深色渐变主题

## 🚀 快速开始

### 环境要求
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### 安装与运行
```bash
# 克隆项目
git clone https://github.com/Cunfeng/Cunfeng-Work.git
cd Cunfeng-Work

# 进入应用目录
cd web

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🔧 开发指南

### 添加新项目卡片
1. 在对应的页面组件（如 `Microsoft.jsx`）的数据数组中添加新项目配置
2. 准备项目图片放入 `img/` 对应目录

```jsx
// 示例：在 Microsoft.jsx 的 PROJECTS 数组中添加
{ key: 'new-project', icon: '🆕', title: 'New Project', description: '项目描述', image: newImage, alt: 'New Project' }
```

### 添加新页面
1. 创建新组件，使用 `PageLayout` 包裹内容
2. 在 `App.jsx` 中添加路由
3. 在父页面添加 `ProjectCard` 入口

```jsx
// 示例：新页面模板
import PageLayout from './PageLayout';

export default function NewPage() {
  return (
    <PageLayout title="页面标题" subtitle="页面描述" backTo="/parent">
      {/* 页面内容 */}
    </PageLayout>
  );
}
```

### 样式规范
- 使用 CSS Module（`*.module.css`）编写组件样式
- 使用 `theme.css` 中定义的 CSS 变量保持一致性
- hover 效果使用 CSS `:hover`，不使用 JS 事件
- 响应式设计通过 `@media` 查询在 `theme.css` 中统一管理

### 构建部署
```bash
# 构建
npm run build

# 预览
npm run preview

# 部署到 Azure Static Web Apps
# 使用 staticwebapp.config.json 配置
```

## 📞 联系方式

- 📧 **邮箱**：shicf9032@163.com
- 🌐 **GitHub**：https://github.com/AaronShi32/Cunfeng-Work
- 💼 **LinkedIn**：www.linkedin.com/in/cfshi

---

*该项目展示了从阿里云到微软云的职业发展历程，以及在 Cloud Infrastructure 方面的专业技能。*

⭐ **如果这个项目对你有帮助，请给它一个星标！**