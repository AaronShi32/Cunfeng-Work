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
            🚀 Ongoing 项目
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
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
                AI 智能助手开发
              </h3>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              基于大语言模型的智能对话系统开发，集成多模态能力和个性化推荐功能
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {['Python', 'FastAPI', 'LangChain', 'OpenAI'].map(tech => (
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

          {/* 项目2 */}
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
              <span style={{ fontSize: '32px', marginRight: '12px' }}>📱</span>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                跨平台移动应用
              </h3>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              使用 React Native 开发的企业级移动应用，支持离线同步和实时通讯
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {['React Native', 'TypeScript', 'Redux', 'Socket.io'].map(tech => (
                <span 
                  key={tech}
                  style={{
                    background: '#fef3c7',
                    color: '#92400e',
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
                background: '#fef3c7',
                color: '#92400e',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                测试阶段
              </span>
              <span style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                65% 完成
              </span>
            </div>
          </div>

          {/* 项目3 */}
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
              <span style={{ fontSize: '32px', marginRight: '12px' }}>☁️</span>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                云原生架构迁移
              </h3>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              将传统应用迁移到 Kubernetes 环境，实现自动扩缩容和高可用部署
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {['Kubernetes', 'Docker', 'Helm', 'Istio'].map(tech => (
                <span 
                  key={tech}
                  style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
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
                background: '#ddd6fe',
                color: '#581c87',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                规划中
              </span>
              <span style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                30% 完成
              </span>
            </div>
          </div>
        </div>

        {/* 技术研究领域 */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 24px 0',
            textAlign: 'center'
          }}>
            当前技术研究方向
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { name: '大模型应用', icon: '🧠', desc: 'LLM 集成与优化' },
              { name: '微服务架构', icon: '🔧', desc: '分布式系统设计' },
              { name: '前端技术', icon: '💻', desc: 'React/Vue 生态' },
              { name: '云原生技术', icon: '☁️', desc: 'Kubernetes & DevOps' },
              { name: '数据工程', icon: '📊', desc: '实时数据处理' },
              { name: '安全技术', icon: '🔒', desc: '应用安全与合规' }
            ].map(area => (
              <div 
                key={area.name}
                style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{area.icon}</div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 4px 0'
                }}>
                  {area.name}
                </h4>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  {area.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}