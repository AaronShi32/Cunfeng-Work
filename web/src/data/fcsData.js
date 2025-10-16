import fabricDEWorkflow from '../../img/FCS/Fabric-DE-Workflow.jpg';
import fcsComponent from '../../img/FCS/FCS Component.png';
import controlPlaneWorkflow from '../../img/FCS/PYNB-ControlPlane-Workflow.png';
import dataPlaneWorkflow from '../../img/FCS/PYNB-DataPlane-Workflow.png';

// FCS 页面的所有数据和配置
export const fcsConfig = {
  title: {
    main: "FCS (Fabric Container Service)",
    subtitle: "容器服务管理平台"
  },
  
  sections: [
    {
      id: "architecture",
      title: "Fabric Data Engineering 架构",
      type: "image",
      content: {
        src: fabricDEWorkflow,
        alt: "Fabric-DE-Workflow",
        link: "https://learn.microsoft.com/en-us/fabric/data-engineering/",
        linkText: "Fabric Data Engineering 官方文档",
        fallback: {
          icon: "🐳",
          text: "Fabric-DE-Workflow.jpg",
          description: "Fabric Data Engineering 架构"
        }
      }
    },
    {
      id: "lifecycle",
      title: "Fabric Container Service 架构",
      type: "image",
      content: {
        src: fcsComponent,
        alt: "FCS Component",
        fallback: {
          icon: "♻️",
          text: "FCS Component.png",
          description: "Fabric Container Service 架构"
        }
      }
    },
    {
      id: "controlplane",
      title: "PythonNotebook 控制面工作流",
      type: "image",
      content: {
        src: controlPlaneWorkflow,
        alt: "ControlPlane-Workflow",
        fallback: {
          icon: "⚙️",
          text: "PYNB-ControlPlane-Workflow.png",
          description: "控制面工作流图"
        }
      }
    },
    {
      id: "dataplane",
      title: "PythonNotebook 数据面工作流",
      type: "image",
      content: {
        src: dataPlaneWorkflow,
        alt: "DataPlane-Workflow",
        fallback: {
          icon: "📊",
          text: "PYNB-DataPlane-Workflow.png",
          description: "数据面工作流图"
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