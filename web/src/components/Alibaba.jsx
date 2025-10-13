import React from 'react';
import { Link } from 'react-router-dom';

export default function Alibaba({ onBack }) {
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e7e9f2ff 0%, #353435ff 100%)',
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
          阿里云项目经历
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#ffffff',
          opacity: 0.9,
          margin: '0 0 60px 0',
          lineHeight: '1.6'
        }}>
          在阿里云平台参与的核心项目与技术实现
        </p>

        {/* 返回按钮 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <button
            onClick={onBack || (() => window.history.back())}
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
            ← 返回主页
          </button>
        </div>

        {/* 卡片区块居中 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          marginBottom: '40px',
        }}>
          {/* ENI 项目卡片 */}
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
              width: '320px',
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
                marginBottom: '16px',
                lineHeight: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '48px'
              }}>
                🌐
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                ENI
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                textAlign: 'center',
                margin: 0,
                lineHeight: '1.5'
              }}>
                弹性网络接口<br/>
                网络资源管理
              </p>
            </div>
          </Link>

          {/* 跨可用区迁移项目卡片 */}
          <Link 
            to="/instance-migration"
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
              width: '320px',
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
                marginBottom: '16px',
                lineHeight: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '48px'
              }}>
                🏗️
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                跨可用区迁移
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                textAlign: 'center',
                margin: 0,
                lineHeight: '1.5'
              }}>
                零停机实例迁移<br/>
                灾难恢复解决方案
              </p>
            </div>
          </Link>
        </div>
        {/* 技术栈展示 */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255,255,255,0.2)',
          marginTop: '40px'
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
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {[
              { name: 'Java/C#/Python', icon: '⚛️' },
              { name: 'Distributed System', icon: '⚡' },
              { name: 'AI Agent/MCP', icon: '🗺️' },
              { name: 'Azure/Alibaba Cloud', icon: '☁️' },
            ].map(tech => (
              <div 
                key={tech.name}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
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