
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '60px 40px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 20px 0',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Cunfeng-Work
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#ffffff',
          opacity: 0.9,
          margin: '0 0 60px 0',
          lineHeight: '1.6'
        }}>
          基于 React + Vite 的现代化前端工作空间
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Samples 卡片 */}
          <Link 
            to="/samples"
            style={{
              textDecoration: 'none',
              display: 'block'
            }}
          >
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🎨
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              样本库
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
              margin: 0,
              lineHeight: '1.5'
            }}>
              React Flow 模板 | 组件样本<br/>
              开箱即用的精美设计
            </p>
          </div>
          </Link>

          {/* Microsoft 卡片 */}
          <Link 
            to="/microsoft"
            style={{
              textDecoration: 'none',
              display: 'block'
            }}
          >
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🏢
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Microsoft
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Microsoft 相关功能和集成<br/>
              企业级应用和服务
            </p>
          </div>
          </Link>

          {/* ASI 卡片 */}
          <Link 
            to="/asi"
            style={{
              textDecoration: 'none',
              display: 'block'
            }}
          >
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              📊
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              ASI 监控
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Azure Service Infrastructure<br/>
              服务监控与分析报告
            </p>
          </div>
          </Link>
        </div>

        {/* 技术栈展示 */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff',
            margin: '0 0 20px 0'
          }}>
            技术栈
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            {[
              { name: 'React 19.1.1', icon: '⚛️' },
              { name: 'Vite 6.3.6', icon: '⚡' },
              { name: 'React Router', icon: '🗺️' },
              { name: '@xyflow/react', icon: '🔄' },
              { name: 'ESLint', icon: '✅' }
            ].map(tech => (
              <div 
                key={tech.name}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <span style={{ marginRight: '8px' }}>{tech.icon}</span>
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
