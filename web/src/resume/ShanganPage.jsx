import React from 'react';
import InterviewPage, { SHANGAN_TABS } from './InterviewPage';

// 自然资源部信息中心专属页面（/shangan）
// 复用 InterviewPage 的渲染逻辑，只保留自然资源部相关 tab
export default function ShanganPage() {
  return <InterviewPage tabs={SHANGAN_TABS} />;
}
