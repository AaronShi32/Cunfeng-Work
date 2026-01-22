
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import hdiImage from '../../img/HDI/HDI-2025-09-04-1233.png';
import fcsImage from '../../img/FCS/FCS-2026-01-20-1331.png';
import asiImage from '../../img/ASI/ASI-2026-01-20-1022.png';
import scoutImage from '../../img/Scout/Scout-2026-01-20-1022.png';
import ongoingImage from '../../img/Fabric/Notebook-RetriableSession-2025-09-04-1233.png';

export default function Microsoft() {
  const [showHDIImage, setShowHDIImage] = useState(false);
  const [showFCSImage, setShowFCSImage] = useState(false);
  const [showASIImage, setShowASIImage] = useState(false);
  const [showScoutImage, setShowScoutImage] = useState(false);
  const [showOngoingImage, setShowOngoingImage] = useState(false);

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #999db3ff 0%, #030303ff 100%)',
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
          微软工作经历
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#ffffff',
          opacity: 0.9,
          margin: '0 0 30px 0',
          lineHeight: '1.6'
        }}>
          在微软参与的核心项目与技术实现
        </p>

        <div style={{
          marginBottom: '40px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
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
              ← 返回主页
            </button>
          </div>

        {/* 项目卡片 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto 40px auto'
        }}>
          {/* HDInsight 卡片 */}
          <div 
            onClick={() => setShowHDIImage(true)}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '200px',
              flex: '1',
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
            }}>🐘</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              HDInsight
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Azure HDInsight<br/>
              大数据分析平台
            </p>
          </div>

          {/* ASI 卡片 - 点击显示弹窗 */}
          <div
            onClick={() => setShowASIImage(true)}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '200px',
              flex: '1',
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

          {/* Scout 卡片 - 点击显示弹窗 */}
          <div
            onClick={() => setShowScoutImage(true)}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '200px',
              flex: '1',
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
            }}>🔍</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Scout
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              AI-AzureData<br/>
              智能分析引擎
            </p>
          </div>

          {/* FCS 卡片 - 点击显示弹窗 */}
          <div 
            onClick={() => setShowFCSImage(true)}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '200px',
              flex: '1',
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
            }}>🐳</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              FCS
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Microsoft Fabric<br/>
              容器服务管理平台
            </p>
          </div>

          {/* 其他卡片 - 点击显示弹窗 */}
          <div
            onClick={() => setShowOngoingImage(true)}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '200px',
              flex: '1',
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
            }}>🚀</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Retry Session
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Mircosoft Fabric<br/>
              重试作业
            </p>
          </div>
        </div>
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
              { name: 'C#/.NET', icon: '⚡' },
              { name: 'Azure/AKS/ACI', icon: '☁️' },
              { name: 'Service Fabric', icon: '🔧' },
              { name: 'Kusto/PowerBI', icon: '📊' },
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

      {/* HDI 图片弹出层 */}
      {showHDIImage && (
        <div 
          onClick={() => setShowHDIImage(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '85vw',
              height: '85vh',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setShowHDIImage(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
            <img 
              src={hdiImage} 
              alt="HDInsight Architecture"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}

      {/* FCS 图片弹出层 - 与 HDI 样式保持一致 */}
      {showFCSImage && (
        <div 
          onClick={() => setShowFCSImage(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '85vw',
              height: '85vh',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setShowFCSImage(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
            <img 
              src={fcsImage} 
              alt="FCS Architecture"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}

      {/* ASI 图片弹出层 - 与 HDI 样式保持一致 */}
      {showASIImage && (
        <div 
          onClick={() => setShowASIImage(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '85vw',
              height: '85vh',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setShowASIImage(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
            <img 
              src={asiImage} 
              alt="ASI Architecture"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}

      {/* Scout 图片弹出层 - 与 HDI 样式保持一致 */}
      {showScoutImage && (
        <div 
          onClick={() => setShowScoutImage(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '85vw',
              height: '85vh',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setShowScoutImage(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
            <img 
              src={scoutImage} 
              alt="Scout Architecture"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}

      {/* Ongoing 图片弹出层 - 与 HDI 样式保持一致 */}
      {showOngoingImage && (
        <div 
          onClick={() => setShowOngoingImage(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '85vw',
              height: '85vh',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setShowOngoingImage(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
            <img 
              src={ongoingImage} 
              alt="Ongoing Project"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
