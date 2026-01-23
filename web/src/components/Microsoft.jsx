
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ZoomableImageModal from './ZoomableImageModal';
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

      <ZoomableImageModal 
        imageSrc={hdiImage} 
        imageAlt="HDInsight Architecture"
        isOpen={showHDIImage} 
        onClose={() => setShowHDIImage(false)} 
      />

      <ZoomableImageModal 
        imageSrc={fcsImage} 
        imageAlt="FCS Architecture"
        isOpen={showFCSImage} 
        onClose={() => setShowFCSImage(false)} 
      />

      <ZoomableImageModal 
        imageSrc={asiImage} 
        imageAlt="ASI Architecture"
        isOpen={showASIImage} 
        onClose={() => setShowASIImage(false)} 
      />

      <ZoomableImageModal 
        imageSrc={scoutImage} 
        imageAlt="Scout Architecture"
        isOpen={showScoutImage} 
        onClose={() => setShowScoutImage(false)} 
      />

      <ZoomableImageModal 
        imageSrc={ongoingImage} 
        imageAlt="Ongoing Project"
        isOpen={showOngoingImage} 
        onClose={() => setShowOngoingImage(false)} 
      />

    </div>
  );
}
