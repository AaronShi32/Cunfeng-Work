// Scout 页面的所有数据和配置
export const scoutConfig = {
  title: {
    main: "Scout (AzureData-AITools)",
    subtitle: "AI 工具"
  },
  
  sections: [
    {
      id: "architecture",
      title: "Scout 架构图",
      type: "image",
      content: {
        src: "/Scout-Arch.png",
        alt: "Scout Architecture Diagram",
        fallback: {
          icon: "🏗️",
          text: "Scout-Arch.png",
          description: "请将 Scout-Arch.png 文件放置在 public 目录中"
        }
      }
    },
    {
      id: "persona",
      title: "Scout Persona",
      type: "image",
      content: {
        src: "/Scout-Persona.png",
        alt: "Scout Persona Diagram",
        fallback: {
          icon: "�",
          text: "Scout-Persona.png",
          description: "请将 Scout-Persona.png 文件放置在 public 目录中"
        }
      }
    }
  ]
};

// Scout 样式主题配置
export const scoutTheme = {
  colors: {
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    cardBackground: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    border: '#cbd5e1',
    buttonPrimary: '#0ea5e9',
    buttonPrimaryHover: '#0284c7',
    imagePlaceholder: '#f1f5f9',
    imageBorder: '#94a3b8'
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
    button: '0 2px 8px rgba(14, 165, 233, 0.3)',
    buttonHover: '0 4px 12px rgba(14, 165, 233, 0.4)',
    image: '0 2px 10px rgba(0,0,0,0.08)'
  }
};