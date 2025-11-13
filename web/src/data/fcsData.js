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
    },
    {
      id: "business-data",
      title: "📊 业务数据",
      type: "table",
      content: {
        tableTitle: "FCS API 接口 30天 QPS 数据表格",
        subtitle: "🏆 主要 API 接口 QPS 统计表",
        columns: [
          { key: "rank", label: "排名", width: "10%" },
          { key: "api", label: "API 接口", width: "40%" },
          { key: "method", label: "HTTP 方法", width: "20%" },
          { key: "maxQps", label: "最大 QPS", width: "15%" },
          { key: "avgQps", label: "平均 QPS", width: "15%" }
        ],
        data: [
          {
            rank: 1,
            api: "/clusters/{id}",
            method: "GET",
            maxQps: "1,030.05",
            avgQps: "506.37"
          },
          {
            rank: 2,
            api: "/clusters/{id}/nodes",
            method: "GET",
            maxQps: "965.54",
            avgQps: "515.42"
          },
          {
            rank: 3,
            api: "/clusters/{id}",
            method: "DELETE",
            maxQps: "2.85",
            avgQps: "1.04"
          },
          {
            rank: 4,
            api: "/clusters/{id}",
            method: "PUT",
            maxQps: "1.48",
            avgQps: "0.86"
          },
          {
            rank: 5,
            api: "/clusterpools/{id}",
            method: "DELETE",
            maxQps: "1.17",
            avgQps: "0.10"
          },
          {
            rank: 6,
            api: "/clusterpools/{id}",
            method: "GET",
            maxQps: "0.66",
            avgQps: "0.27"
          },
          {
            rank: 7,
            api: "/clusterpools/{id}",
            method: "PUT",
            maxQps: "0.25",
            avgQps: "0.06"
          }
        ]
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