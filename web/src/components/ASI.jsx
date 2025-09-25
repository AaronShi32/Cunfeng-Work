import React from 'react';

export default function ASI() {
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
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 16px 0',
            textShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            ASI (Azure Service Insights)
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            opacity: 1,
            margin: 0
          }}>
            Azure 服务洞察看板
          </p>
        </div>

        {/* ASI 结构图 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#334155',
            margin: '0 0 24px 0'
          }}>
            ASI 业务架构图
          </h2>
          
          {/* SVG 图片容器 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            background: '#f1f5f9',
            borderRadius: '8px',
            border: '2px dashed #cbd5e1'
          }}>
            {/* 这里应该嵌入 ASI-Structure.svg */}
            <img 
              src="/ASI-Structure.svg" 
              alt="ASI Structure Diagram"
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{
              display: 'none',
              color: '#64748b',
              fontSize: '16px',
              padding: '40px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p>ASI-Structure.svg</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                请将 ASI-Structure.svg 文件放置在 public 目录中
              </p>
            </div>
          </div>
        </div>

        {/* ASI 数据源 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#334155',
            margin: '0 0 24px 0'
          }}>
            ASI 数据源
          </h2>
          
          {/* ASI-Telemetry 图片容器 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            background: '#f1f5f9',
            borderRadius: '8px',
            border: '2px dashed #cbd5e1'
          }}>
            {/* 这里嵌入 ASI-Telemetry.png */}
            <img 
              src="/ASI-Telemetry.png" 
              alt="ASI Telemetry Data Sources"
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{
              display: 'none',
              color: '#64748b',
              fontSize: '16px',
              padding: '40px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
              <p>ASI-Telemetry.png</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                请将 ASI-Telemetry.png 文件放置在 public 目录中
              </p>
            </div>
          </div>
        </div>

        {/* PowerBI 报告 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#334155',
            margin: '0 0 24px 0',
            textAlign: 'center'
          }}>
            ASI 使用报告
          </h2>
          
          {/* PowerBI iframe 容器 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            minHeight: '550px'
          }}>
            <iframe 
              title="Fabric Container Service ASI Report" 
              width="1140" 
              height="541.25" 
              src="https://msit.powerbi.com/reportEmbed?reportId=b5f2c4f0-62df-47d9-86ae-7a8b6c9ce554&autoAuth=true&ctid=72f988bf-86f1-41af-91ab-2d7cd011db47" 
              frameBorder="0" 
              allowFullScreen={true}
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
                maxWidth: '100%'
              }}
            />
          </div>
          
          {/* 报告说明 */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f1f5f9',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0,
              lineHeight: '1.5'
            }}>
              📊 此报告展示了 Fabric Container Service 的 ASI 相关指标和分析数据
              <br />
              如果报告无法加载，请确保您已登录 Microsoft 企业账户并具有相应的访问权限
            </p>
          </div>
        </div>

        {/* 导航按钮 */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
            }}
          >
            ← 返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
