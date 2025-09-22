import React from 'react';

export default function ASI() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            color: '#ffffff',
            margin: '0 0 16px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            ASI (Azure Service Infrastructure)
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#ffffff',
            opacity: 0.9,
            margin: 0
          }}>
            Azure 服务基础架构监控与分析
          </p>
        </div>

        {/* ASI 结构图 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 24px 0'
          }}>
            ASI 架构结构图
          </h2>
          
          {/* SVG 图片容器 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '2px dashed #d1d5db'
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
              color: '#6b7280',
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

        {/* PowerBI 报告 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 24px 0',
            textAlign: 'center'
          }}>
            Fabric Container Service ASI Report
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
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                maxWidth: '100%'
              }}
            />
          </div>
          
          {/* 报告说明 */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
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
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            ← 返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
