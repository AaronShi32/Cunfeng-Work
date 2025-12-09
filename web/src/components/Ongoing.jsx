import React from 'react';

export default function Ongoing({ onBack }) {
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '60px 40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 页面标题 */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            🚀 其他项目
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: 0,
            lineHeight: '1.6'
          }}>
            当前正在进行的项目和技术研究
          </p>
        </div>

        {/* 导航按钮 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.9)',
              color: '#4f46e5',
              border: '1px solid rgba(79,70,229,0.3)',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← 返回微软项目
          </button>
        </div>

        {/* 项目列表 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* 项目1 */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '32px', marginRight: '12px' }}>🤖</span>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                Spark Batch/Session 重试作业
              </h3>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Microsoft Fabric 上运行 Spark 作业的重试机制开发，提升任务稳定性和资源利用率
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {['Spark', 'Session', 'Batch', 'Notebook'].map(tech => (
                <span 
                  key={tech}
                  style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                background: '#dcfce7',
                color: '#166534',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                进行中
              </span>
              <span style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                80% 完成
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}