import React from 'react';

export default function InstanceMigration({ onBack }) {
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
            跨可用区实例迁移
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            margin: 0,
            lineHeight: '1.6'
          }}>
            阿里云跨可用区实例迁移项目经历与技术实现
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
                🏗️
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
                跨可用区实例迁移是阿里云提供的一项关键服务，允许用户将 ECS 实例从一个可用区迁移到另一个可用区，确保业务的高可用性和灾难恢复能力。
              </p>
              <p style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.6',
                margin: '0 0 16px 0'
              }}>
                在项目中主要负责迁移策略设计、数据一致性保障、以及迁移过程中的状态管理和异常处理机制。
              </p>
              <p style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.6',
                margin: '0 0 24px 0'
              }}>
                实现了零停机迁移、增量数据同步、以及迁移过程的实时监控等核心功能。
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
                href="https://help.aliyun.com/zh/ecs/user-guide/migrate-an-ecs-instance"
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
                <span style={{ marginRight: '8px' }}>🔄</span>
                ECS 实例迁移指南
              </a>

              <a
                href="https://help.aliyun.com/zh/ecs/user-guide/overview-of-instance-families"
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
                <span style={{ marginRight: '8px' }}>🏗️</span>
                可用区与实例规格说明
              </a>

              <a
                href="https://help.aliyun.com/zh/ecs/user-guide/disaster-recovery-solutions"
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
                <span style={{ marginRight: '8px' }}>🛡️</span>
                灾难恢复解决方案
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
                在跨可用区实例迁移项目开发过程中，主要使用了以下阿里云 ECS 和相关服务的 API 接口：
              </p>
              <ul style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.5',
                paddingLeft: '20px',
                margin: '0 0 24px 0'
              }}>
                <li>ModifyInstanceAttribute - 修改实例属性</li>
                <li>CreateSnapshot - 创建磁盘快照</li>
                <li>CreateImage - 创建自定义镜像</li>
                <li>RunInstances - 在目标可用区创建实例</li>
                <li>CopyImage - 跨可用区复制镜像</li>
                <li>StartInstance / StopInstance - 实例启停控制</li>
                <li>DescribeInstanceStatus - 监控迁移状态</li>
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
                href="https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-modifyinstanceattribute"
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
                ModifyInstanceAttribute API
              </a>

              <a
                href="https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-createsnapshot"
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
                <span style={{ marginRight: '8px' }}>📷</span>
                CreateSnapshot API
              </a>

              <a
                href="https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-runinstances"
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
                <span style={{ marginRight: '8px' }}>🚀</span>
                RunInstances API
              </a>

              <a
                href="https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-copyimage"
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
                <span style={{ marginRight: '8px' }}>📋</span>
                CopyImage API
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