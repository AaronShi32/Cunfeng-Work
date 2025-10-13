
import React, { useState } from 'react';
import { ReactFlow } from '@xyflow/react';
import ASI from './ASI';
import Scout from './Scout';
import FCS from './FCS';

const nodes = [
  { id: '1', type: 'input', data: { label: 'Start Node' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Middle Node' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'End Node' }, position: { x: 400, y: 100 } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function Microsoft() {
  const [showASI, setShowASI] = useState(false);
  const [showScout, setShowScout] = useState(false);
  const [showFCS, setShowFCS] = useState(false);

  const handleASIClick = () => {
    setShowASI(true);
  };

  const handleScoutClick = () => {
    setShowScout(true);
  };

  const handleFCSClick = () => {
    setShowFCS(true);
  };

  const handleBackToMicrosoft = () => {
    setShowASI(false);
    setShowScout(false);
    setShowFCS(false);
  };

  // 如果显示ASI页面
  if (showASI) {
    return <ASI onBack={handleBackToMicrosoft} />;
  }

  // 如果显示Scout页面
  if (showScout) {
    return <Scout onBack={handleBackToMicrosoft} />;
  }

  // 如果显示FCS页面
  if (showFCS) {
    return <FCS onBack={handleBackToMicrosoft} />;
  }

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
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
            color: '#0f172a',
            margin: '0 0 16px 0'
          }}>
            Microsoft 项目
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#475569',
            margin: 0
          }}>
            微软云相关项目经历
          </p>
        </div>

        {/* 项目卡片 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* ASI 卡片 */}
          <div 
            onClick={handleASIClick}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              textAlign: 'center'
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
            }}>📊</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              ASI
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Azure Service Insights<br/>
              服务监控与分析报告
            </p>
          </div>

          {/* Scout 卡片 */}
          <div 
            onClick={handleScoutClick}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              textAlign: 'center'
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
            }}>🔍</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Scout 监控
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Service Monitoring & Analytics<br/>
              服务监控与分析平台
            </p>
          </div>

          {/* FCS 卡片 */}
          <div 
            onClick={handleFCSClick}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              textAlign: 'center'
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
            }}>🐳</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              FCS 容器服务
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Fabric Container Service<br/>
              容器服务管理平台
            </p>
          </div>
        </div>

        {/* React Flow 演示 */}
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
            React Flow Demo
          </h2>
          <div style={{ height: '400px' }}>
            <ReactFlow 
              nodes={nodes} 
              edges={edges} 
              fitView 
              style={{ background: '#f8fafc' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
