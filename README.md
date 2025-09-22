# 🚀 Cunfeng-Work

> 个人简历展示平台 

## 📝 项目简介

这是一个个人简历展示平台，采用现代化的前端技术栈构建，用于展示个人的工作经历和项目成果。项目采用模块化设计，支持多级导航和动态内容展示。

### ✨ 核心特性

- 🎨 **现代化UI设计** - 渐变背景、卡片式布局、流畅动画
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔄 **动态导航** - 支持二级卡片展示，无需页面跳转
- 📊 **数据可视化** - 集成PowerBI报告和SVG图表
- 🏗️ **模块化架构** - 易于扩展和维护

## 🛠️ 技术栈

### 核心框架
- **React 19.1.1** - 最新的React框架
- **Vite 6.3.6** - 快速构建工具
- **React Router DOM 6.23.0** - 客户端路由

### 可视化组件
- **@xyflow/react 12.8.5** - 流程图和数据可视化

### 开发工具
- **ESLint 9.35.0** - 代码质量检查
- **TypeScript 支持** - 类型安全开发
- **热重载** - 开发时实时更新

## 📂 项目结构

```
Cunfeng-Work/
├── 📁 .github/                    # GitHub 配置
│   └── copilot-instructions.md    # AI 助手配置
├── 📁 web/                        # 主应用目录
│   ├── 📁 public/                 # 静态资源
│   │   └── ASI-Structure.svg      # ASI架构图
│   ├── 📁 img/ASI/               # 图片资源
│   ├── 📁 src/                   # 源代码
│   │   ├── 📁 components/        # React组件
│   │   │   ├── Home.jsx          # 主页组件（支持二级导航）
│   │   │   ├── Microsoft.jsx     # Microsoft经历组件
│   │   │   └── ASI.jsx           # ASI监控组件
│   │   ├── 📁 assets/            # 项目资源
│   │   ├── App.jsx               # 应用根组件
│   │   ├── main.jsx              # 应用入口
│   │   └── index.css             # 全局样式
│   ├── package.json              # 依赖配置
│   ├── vite.config.js            # Vite配置
│   ├── eslint.config.js          # 代码规范配置
│   └── staticwebapp.config.json  # Azure部署配置
└── README.md                     # 项目文档
```

## 🎯 功能模块

### 🏠 主页 (Home)
- **双级导航系统**：
  - 第一级：Alibaba、Microsoft 主要经历卡片
  - 第二级：点击Microsoft后显示ASI等子模块
- **无刷新切换**：所有导航都在同一页面完成
- **优雅交互**：悬停效果、平滑过渡动画

### 🏢 Microsoft 模块
- **项目展示**：微软云相关项目经历
- **二级导航**：点击后展开ASI监控等子功能
- **返回功能**：便捷的返回主页按钮

### 📊 ASI 监控模块
- **架构图展示**：SVG格式的系统架构图
- **PowerBI集成**：嵌入式报告展示
- **数据可视化**：Fabric Container Service相关指标

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

## 🎨 设计亮点

### 视觉设计
- **渐变背景**：`linear-gradient(135deg, #e7e9f2ff 0%, #d3c4e2ff 100%)`
- **卡片设计**：圆角、阴影、悬停效果
- **图标系统**：表意清晰的emoji图标

### 交互设计
- **状态管理**：React Hooks管理组件状态
- **动画效果**：CSS过渡和变换
- **响应式布局**：Grid布局自适应

### 代码架构
- **组件化开发**：功能模块独立组件
- **状态提升**：合理的状态管理策略
- **事件处理**：优雅的用户交互处理

## 💡 核心实现

### 二级导航系统
```jsx
const [showMicrosoftSubCards, setShowMicrosoftSubCards] = useState(false);
const [showASI, setShowASI] = useState(false);

// Microsoft卡片点击 -> 显示子卡片
const handleMicrosoftClick = () => {
  setShowMicrosoftSubCards(true);
};

// ASI卡片点击 -> 显示ASI页面
const handleASIClick = () => {
  setShowASI(true);
};
```

### 动态内容渲染
- 条件渲染不同的卡片组合
- 平滑的状态切换
- 统一的返回机制

## 🌟 项目特色

- ✅ **用户体验优先**：无页面跳转的流畅导航
- ✅ **现代化技术**：最新React 19和Vite 6
- ✅ **企业级功能**：PowerBI集成和数据可视化
- ✅ **响应式设计**：完美的移动端适配
- ✅ **代码质量**：ESLint规范和模块化架构
- ✅ **易于部署**：支持Azure Static Web Apps

## 🔧 开发指南

### 添加新模块
1. 在 `src/components/` 创建新组件
2. 在 `Home.jsx` 中添加对应的卡片
3. 实现状态管理和切换逻辑

### 样式规范
- 使用内联样式保持组件独立性
- 保持设计系统的一致性
- 响应式设计优先

### 构建部署
```bash
# 构建
npm run build

# 预览
npm run preview

# 部署到Azure Static Web Apps
# 使用 staticwebapp.config.json 配置
```

## 📞 联系方式

- 📧 **邮箱**：[你的邮箱]
- 🌐 **GitHub**：[GitHub 链接]
- 💼 **LinkedIn**：[LinkedIn 链接]

---

*该项目展示了从阿里云到微软云的职业发展历程，以及在Azure Service Infrastructure方面的专业技能。*

⭐ **如果这个项目对你有帮助，请给它一个星标！**