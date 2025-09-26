// FCS 页面的所有数据和配置
export const fcsConfig = {
  title: {
    main: "FCS (Fabric Container Service)",
    subtitle: "容器服务管理平台"
  },
  
  sections: [
    {
      id: "architecture",
      title: "FCS 架构图",
      type: "image",
      content: {
        src: "/FCS-Architecture.svg",
        alt: "FCS Architecture Diagram",
        fallback: {
          icon: "🐳",
          text: "FCS-Architecture.svg",
          description: "请将 FCS-Architecture.svg 文件放置在 public 目录中"
        }
      }
    },
    {
      id: "lifecycle",
      title: "容器生命周期管理",
      type: "image",
      content: {
        src: "/FCS-Lifecycle.png",
        alt: "FCS Container Lifecycle Management",
        fallback: {
          icon: "♻️",
          text: "FCS-Lifecycle.png",
          description: "请将 FCS-Lifecycle.png 文件放置在 public 目录中"
        }
      }
    }
  ]
};

// FCS 样式主题配置
export const fcsTheme = {
  colors: {
    background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
    cardBackground: '#ffffff',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    textMuted: '#78716c',
    border: '#d6d3d1',
    buttonPrimary: '#f59e0b',
    buttonPrimaryHover: '#d97706',
    imagePlaceholder: '#fef7ed',
    imageBorder: '#fdba74'
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
    card: '0 4px 20px rgba(0,0,0,0.08)',
    button: '0 2px 8px rgba(245, 158, 11, 0.3)',
    buttonHover: '0 4px 12px rgba(245, 158, 11, 0.4)',
    image: '0 2px 10px rgba(0,0,0,0.08)'
  }
};