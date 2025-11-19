import React from 'react';
import { fcsTheme } from '../../data/fcsData';

export default function TableSection({ title, tableTitle, subtitle, columns, data }) {
  return (
    <div style={{
      background: fcsTheme.colors.cardBackground,
      borderRadius: '16px',
      padding: fcsTheme.spacing.cardPadding,
      marginBottom: fcsTheme.spacing.sectionMargin,
      boxShadow: fcsTheme.shadows.card,
      border: `1px solid ${fcsTheme.colors.border}`
    }}>
      <h2 style={{
        fontSize: fcsTheme.typography.sectionTitle.fontSize,
        fontWeight: fcsTheme.typography.sectionTitle.fontWeight,
        color: fcsTheme.colors.textPrimary,
        margin: '0 0 24px 0',
        textAlign: 'center'
      }}>
        {title}
      </h2>

      {tableTitle && (
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: fcsTheme.colors.textSecondary,
          margin: '0 0 12px 0',
          textAlign: 'center'
        }}>
          {tableTitle}
        </h3>
      )}

      {subtitle && (
        <p style={{
          fontSize: fcsTheme.typography.body.fontSize,
          color: fcsTheme.colors.textMuted,
          margin: '0 0 24px 0',
          textAlign: 'center'
        }}>
          {subtitle}
        </p>
      )}

      {/* 表格容器 - 支持横向滚动 */}
      <div style={{
        overflowX: 'auto',
        borderRadius: '8px',
        border: `1px solid ${fcsTheme.colors.border}`
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: fcsTheme.typography.body.fontSize,
          minWidth: '800px'
        }}>
          {/* 表头 */}
          <thead>
            <tr style={{
              background: fcsTheme.colors.imagePlaceholder
            }}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    padding: '16px 12px',
                    textAlign: column.key === 'rank' ? 'center' : 'left',
                    fontWeight: '600',
                    color: fcsTheme.colors.textPrimary,
                    borderBottom: `2px solid ${fcsTheme.colors.border}`,
                    width: column.width || 'auto',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* 表体 */}
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                style={{
                  background: index % 2 === 0 ? '#ffffff' : '#fefce8',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fef3c7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#fefce8';
                }}
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  const isRank = column.key === 'rank';
                  const isMethod = column.key === 'method';
                  
                  return (
                    <td
                      key={column.key}
                      style={{
                        padding: '12px',
                        textAlign: isRank ? 'center' : 'left',
                        color: fcsTheme.colors.textSecondary,
                        borderBottom: `1px solid ${fcsTheme.colors.border}`,
                        fontFamily: isMethod ? 'monospace' : 'inherit',
                        fontWeight: isRank ? '600' : 'normal',
                        fontSize: isRank ? '16px' : fcsTheme.typography.body.fontSize
                      }}
                    >
                      {isMethod ? (
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: value === 'GET' ? '#dcfce7' : 
                                     value === 'POST' ? '#dbeafe' : 
                                     value === 'PUT' ? '#fef3c7' : 
                                     value === 'DELETE' ? '#fee2e2' : '#f3f4f6',
                          color: value === 'GET' ? '#166534' : 
                                 value === 'POST' ? '#1e40af' : 
                                 value === 'PUT' ? '#92400e' : 
                                 value === 'DELETE' ? '#991b1b' : '#1f2937',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {value}
                        </span>
                      ) : isRank && value <= 3 ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: value === 1 ? '#fef08a' : 
                                     value === 2 ? '#e2e8f0' : 
                                     '#fdba74',
                          color: value === 1 ? '#854d0e' : 
                                 value === 2 ? '#475569' : 
                                 '#9a3412',
                          fontWeight: '700'
                        }}>
                          {value}
                        </span>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 表格说明 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: fcsTheme.colors.imagePlaceholder,
        borderRadius: '8px',
        border: `1px solid ${fcsTheme.colors.imageBorder}`,
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: fcsTheme.typography.body.fontSize,
          color: fcsTheme.colors.textMuted,
          margin: 0,
          lineHeight: '1.5'
        }}>
          📈 以上数据统计自 FCS API 接口最近 30 天的实际请求情况
          <br />
          QPS (Queries Per Second) 表示每秒查询率，反映了系统的负载和性能表现
        </p>
      </div>
    </div>
  );
}
