# Azure Static Web Apps HTML Demo

本项目用于演示如何将静态 HTML 网站部署到 Azure Static Web Apps。

## 目录结构

```
/ (项目根目录)
|-- index.html
|-- README.md
|-- .github/
|   |-- copilot-instructions.md
|-- staticwebapp.config.json (可选)
```

## 步骤说明

### 1. 准备静态 HTML 文件

将你的 HTML 文件（如 `index.html`）放在项目根目录下。

### 2. 创建 Azure Static Web App

1. 登录 [Azure Portal](https://portal.azure.com)。
2. 搜索并创建“Static Web App”。
3. 选择部署源（如 GitHub），并关联本项目仓库。
4. 构建细节：
   - App location: `/`（根目录）
   - Output location: `/`（根目录）
   - API location: 留空（如无 API）

### 3. 配置（可选）

如需自定义路由或重定向，可添加 `staticwebapp.config.json` 文件。

### 4. 部署

每次推送到主分支，Azure 会自动构建并部署最新内容。

### 5. 访问

部署完成后，可在 Azure Portal 查看分配的静态网站 URL。

## 参考
- [Azure Static Web Apps 官方文档](https://learn.microsoft.com/azure/static-web-apps/)

---

如需自定义或添加更多页面，请将 HTML/CSS/JS 文件放在根目录或子目录下，并更新 `index.html` 导航。