// ASI 页面的所有数据和配置
export const asiConfig = {
  title: {
    main: "ASI (Azure Service Insights)",
    subtitle: "Azure 服务洞察看板"
  },
  
  sections: [
    {
      id: "structure",
      title: "ASI 业务架构图",
      type: "image",
      content: {
        src: "/ASI-Structure.svg",
        alt: "ASI Structure Diagram",
        fallback: {
          icon: "📊",
          text: "ASI-Structure.svg",
          description: "请将 ASI-Structure.svg 文件放置在 public 目录中"
        }
      }
    },
    {
      id: "datasource",
      title: "ASI 数据源",
      type: "image",
      content: {
        src: "/ASI-Telemetry.png",
        alt: "ASI Telemetry Data Sources",
        fallback: {
          icon: "📈",
          text: "ASI-Telemetry.png",
          description: "请将 ASI-Telemetry.png 文件放置在 public 目录中"
        }
      }
    },
    {
      id: "powerbi",
      title: "ASI 使用报告",
      type: "powerbi",
      content: {
        title: "Fabric Container Service ASI Report",
        width: "1140",
        height: "541.25",
        src: "https://msit.powerbi.com/reportEmbed?reportId=b5f2c4f0-62df-47d9-86ae-7a8b6c9ce554&autoAuth=true&ctid=72f988bf-86f1-41af-91ab-2d7cd011db47",
        description: "📊 此报告展示了 Fabric Container Service 的 ASI 相关指标和分析数据",
        fallbackText: "如果报告无法加载，请确保您已登录 Microsoft 企业账户并具有相应的访问权限"
      }
    }
  ]
};

// 样式主题配置
export const asiTheme = {
  colors: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    cardBackground: '#ffffff',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#64748b',
    border: '#e2e8f0',
    buttonPrimary: '#3b82f6',
    buttonPrimaryHover: '#2563eb',
    imagePlaceholder: '#f1f5f9',
    imageBorder: '#cbd5e1'
  },
  
  spacing: {
    containerPadding: '40px 20px',
    sectionMargin: '32px',
    cardPadding: '32px',
    smallPadding: '16px'
  },
  
  typography: {
    title: {
      fontSize: '36px',
      fontWeight: '700'
    },
    subtitle: {
      fontSize: '18px',
      fontWeight: 'normal'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600'
    },
    body: {
      fontSize: '14px',
      fontWeight: 'normal'
    }
  },
  
  shadows: {
    card: '0 4px 20px rgba(0,0,0,0.06)',
    button: '0 2px 8px rgba(59, 130, 246, 0.3)',
    buttonHover: '0 4px 12px rgba(59, 130, 246, 0.4)',
    image: '0 2px 10px rgba(0,0,0,0.08)'
  }
};