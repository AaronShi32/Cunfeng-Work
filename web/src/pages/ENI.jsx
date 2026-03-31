import React from 'react';
import { PageLayout, LinkButton, TechStackBar } from '../components';
import layout from '../styles/layout.module.css';
import anim from '../styles/animation.module.css';

const TECHS = [
  { name: 'Java', icon: '☕' },
  { name: 'Distributed System', icon: '⚡' },
  { name: 'Alibaba Cloud', icon: '☁️' },
  { name: 'VPC/Network', icon: '🌐' },
];

const PRODUCT_LINKS = [
  { href: 'https://help.aliyun.com/zh/ecs/user-guide/eni-overview', icon: '🔗', label: '阿里云 ENI 产品介绍' },
  { href: 'https://help.aliyun.com/zh/ecs/user-guide/attach-an-eni', icon: '📚', label: 'ENI 绑定与管理指南' },
];

const API_LINKS = [
  { href: 'https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-createnetworkinterface', icon: '🔧', label: 'CreateNetworkInterface API' },
  { href: 'https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-attachnetworkinterface', icon: '🔗', label: 'AttachNetworkInterface API' },
  { href: 'https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-describenetworkinterfaces', icon: '📊', label: 'DescribeNetworkInterfaces API' },
];

const API_LIST = [
  'CreateNetworkInterface - 创建弹性网络接口',
  'AttachNetworkInterface - 绑定弹性网络接口',
  'DetachNetworkInterface - 解绑弹性网络接口',
  'DeleteNetworkInterface - 删除弹性网络接口',
  'DescribeNetworkInterfaces - 查询弹性网络接口',
];

export default function ENI() {
  return (
    <PageLayout title="ENI (弹性网卡)" subtitle="阿里云弹性网卡项目经历与技术实现" backTo="/alibaba">
      <div className={layout.contentGrid}>
        <div className={`${layout.section} ${anim.animateSection}`}>
          <div className={layout.sectionHeader}>
            <div className={layout.sectionIcon}>📖</div>
            <h2 className={layout.sectionTitle}>项目介绍</h2>
          </div>
          <p className={layout.paragraph}>
            弹性网卡（ENI）是阿里云提供的一种虚拟网络接口，可以在专有网络VPC中自由移动，提供高可用性和灵活性。
          </p>
          <p className={layout.paragraph}>
            在项目中负责 ENI 的核心功能开发，包括网络接口的创建、绑定、解绑、RDMA 等关键特性。
          </p>
          <h3 className={layout.linksGroupTitle}>相关链接</h3>
          <div className={layout.linksGroup}>
            {PRODUCT_LINKS.map(link => (
              <LinkButton key={link.href} href={link.href} icon={link.icon} variant="alibaba">{link.label}</LinkButton>
            ))}
          </div>
        </div>

        <div className={`${layout.section} ${anim.animateSectionDelay1}`}>
          <div className={layout.sectionHeader}>
            <div className={layout.sectionIcon}>⚙️</div>
            <h2 className={layout.sectionTitle}>涉及的 API</h2>
          </div>
          <p className={layout.paragraph}>在 ENI 项目开发过程中，主要使用了以下阿里云 ECS API 接口：</p>
          <ul className={layout.apiList}>
            {API_LIST.map(item => <li key={item}>{item}</li>)}
          </ul>
          <h3 className={layout.linksGroupTitle}>API 文档链接</h3>
          <div className={layout.linksGroup}>
            {API_LINKS.map(link => (
              <LinkButton key={link.href} href={link.href} icon={link.icon} variant="microsoft">{link.label}</LinkButton>
            ))}
          </div>
        </div>
      </div>

      <TechStackBar techs={TECHS} />
    </PageLayout>
  );
}
