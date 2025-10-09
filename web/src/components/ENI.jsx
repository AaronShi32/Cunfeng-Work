import React from 'react';

export default function ENI({ onBack }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 页面标题 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          padding: '32px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 16px 0'
          }}>
            ENI (弹性网络接口)
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            margin: 0,
            lineHeight: '1.6'
          }}>
            阿里云弹性网络接口项目经历与技术实现
          </p>
        </div>

        {/* 内容区域 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '32px',
          marginBottom: '48px'
        }}>
          
          {/* 介绍部分 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '32px',
                marginRight: '16px'
              }}>
                📖
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                项目介绍
              </h2>
            </div>
            
            <div style={{
              marginBottom: '24px'
            }}>
              <p style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.6',
                margin: '0 0 16px 0'
              }}>
                弹性网络接口（ENI）是阿里云提供的一种虚拟网络接口，可以在专有网络VPC中自由移动，提供高可用性和灵活性。
              </p>
              <p style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.6',
                margin: '0 0 24px 0'
              }}>
                在项目中负责 ENI 的核心功能开发，包括网络接口的创建、绑定、解绑、以及跨可用区迁移等关键特性。
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 12px 0'
              }}>
                相关链接
              </h3>
              
              <a
                href="https://help.aliyun.com/zh/ecs/user-guide/eni-overview"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #ff6600 0%, #ff8533 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(255, 102, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 102, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 102, 0, 0.3)';
                }}
              >
                <span style={{ marginRight: '8px' }}>🔗</span>
                阿里云 ENI 产品介绍
              </a>

              <a
                href="https://help.aliyun.com/zh/ecs/user-guide/attach-an-eni"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #ff6600 0%, #ff8533 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(255, 102, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 102, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 102, 0, 0.3)';
                }}
              >
                <span style={{ marginRight: '8px' }}>📚</span>
                ENI 绑定与管理指南
              </a>
            </div>
          </div>

          {/* API 部分 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '32px',
                marginRight: '16px'
              }}>
                ⚙️
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                涉及的 API
              </h2>
            </div>
            
            <div style={{
              marginBottom: '24px'
            }}>
              <p style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.6',
                margin: '0 0 16px 0'
              }}>
                在 ENI 项目开发过程中，主要使用了以下阿里云 ECS API 接口：
              </p>
              <ul style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.5',
                paddingLeft: '20px',
                margin: '0 0 24px 0'
              }}>
                <li>CreateNetworkInterface - 创建弹性网络接口</li>
                <li>AttachNetworkInterface - 绑定弹性网络接口</li>
                <li>DetachNetworkInterface - 解绑弹性网络接口</li>
                <li>DeleteNetworkInterface - 删除弹性网络接口</li>
                <li>DescribeNetworkInterfaces - 查询弹性网络接口</li>
              </ul>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 12px 0'
              }}>
                API 文档链接
              </h3>
              
              <a
                href="https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-createnetworkinterface"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                <span style={{ marginRight: '8px' }}>🔧</span>
                CreateNetworkInterface API
              </a>

              <a
                href="https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-attachnetworkinterface"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                <span style={{ marginRight: '8px' }}>🔗</span>
                AttachNetworkInterface API
              </a>

              <a
                href="https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-describenetworkinterfaces"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                <span style={{ marginRight: '8px' }}>📊</span>
                DescribeNetworkInterfaces API
              </a>
            </div>
          </div>
        </div>

        {/* 返回按钮 */}
        <div style={{
          textAlign: 'center'
        }}>
          <button
            onClick={onBack || (() => window.history.back())}
            style={{
              background: 'rgba(0,0,0,0.1)',
              color: '#475569',
              border: '1px solid #cbd5e1',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← 返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}