
import React, { useState } from 'react';
import alibabaLogo from '../../img/Others/Alibaba.png';
import microsoftLogo from '../../img/Others/Microsoft.svg';
import { Link } from 'react-router-dom';
import ASI from './ASI';
import Scout from './Scout';
import FCS from './FCS';

export default function Home() {
  const [showMicrosoftSubCards, setShowMicrosoftSubCards] = useState(false);
  const [showASI, setShowASI] = useState(false);
  const [showScout, setShowScout] = useState(false);
  const [showFCS, setShowFCS] = useState(false);

  const handleMicrosoftClick = () => {
    setShowMicrosoftSubCards(true);
  };

  const handleASIClick = () => {
    setShowASI(true);
  };

  const handleScoutClick = () => {
    setShowScout(true);
  };

  const handleFCSClick = () => {
    setShowFCS(true);
  };

  const handleBackToMain = () => {
    setShowMicrosoftSubCards(false);
    setShowASI(false);
    setShowScout(false);
    setShowFCS(false);
  };

  // 如果显示ASI页面
  if (showASI) {
    return (
      <div>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000
        }}>
          <button
            onClick={handleBackToMain}
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
        <ASI onBack={handleBackToMain} />
      </div>
    );
  }

  // 如果显示Scout页面
  if (showScout) {
    return (
      <div>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000
        }}>
          <button
            onClick={handleBackToMain}
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
        <Scout onBack={handleBackToMain} />
      </div>
    );
  }

  // 如果显示FCS页面
  if (showFCS) {
    return (
      <div>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000
        }}>
          <button
            onClick={handleBackToMain}
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
        <FCS onBack={handleBackToMain} />
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e7e9f2ff 0%, #d3c4e2ff 100%)',
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
          简历
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: !showMicrosoftSubCards 
            ? 'repeat(auto-fit, minmax(280px, 1fr))' 
            : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
          maxWidth: !showMicrosoftSubCards ? 'none' : '1000px',
          margin: !showMicrosoftSubCards ? '0 0 40px 0' : '0 auto 40px auto'
        }}>
          {!showMicrosoftSubCards ? (
            // 主要卡片
            <>
              {/* Alibaba 卡片 */}
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
                <img
                  src={alibabaLogo}
                  alt="Alibaba"
                  style={{ width: 48, height: 48, marginBottom: 16, objectFit: 'contain' }}
                />
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>
                  Alibaba
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  阿里云 相关项目经历<br/>
                </p>
              </div>
              </Link>

              {/* Microsoft 卡片 - 修改为点击事件 */}
              <div 
                onClick={handleMicrosoftClick}
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
                <img
                  src={microsoftLogo}
                  alt="Microsoft"
                  style={{ width: 48, height: 48, marginBottom: 16, objectFit: 'contain' }}
                />
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
                  微软云 相关项目经历
                </p>
              </div>
              </div>
            </>
          ) : (
            // Microsoft 二级卡片
            <>
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <button
                  onClick={handleBackToMain}
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

              {/* ASI 卡片 */}
              <div 
                onClick={handleASIClick}
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
                  Azure Service Insights<br/>
                  服务监控与分析报告
                </p>
              </div>
              </div>

              {/* Scout 卡片 */}
              <div 
                onClick={handleScoutClick}
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
                  🔍
                </div>
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
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Service Monitoring & Analytics<br/>
                  服务监控与分析平台
                </p>
              </div>
              </div>

              {/* FCS 卡片 */}
              <div 
                onClick={handleFCSClick}
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
                  🐳
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>
                  FCS 监控
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Fabric Container Service<br/>
                  容器服务监控与管理
                </p>
              </div>
              </div>
            </>
          )}
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
              { name: 'Java/C#/Python', icon: '⚛️' },
              { name: '分布式后端服务', icon: '⚡' },
              { name: 'AI Agent/MCP', icon: '🗺️' },
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
