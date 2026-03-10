import React from 'react';
import { PageLayout, LinkButton } from '../components';
import layout from '../styles/layout.module.css';
import anim from '../styles/animation.module.css';

const PRODUCT_LINKS = [
  { href: 'https://help.aliyun.com/zh/ecs/user-guide/migrate-an-ecs-instance', icon: '🔄', label: 'ECS 实例迁移指南' },
  { href: 'https://help.aliyun.com/zh/ecs/user-guide/overview-of-instance-families', icon: '🏗️', label: '可用区与实例规格说明' },
  { href: 'https://help.aliyun.com/zh/ecs/user-guide/migrate-ecs-instances-from-the-classic-network-to-a-vpc', icon: '🛡️', label: 'ECS 实例从经典网络迁移到专有网络' },
];

const API_LINKS = [
  { href: 'https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-modifyinstanceattribute', icon: '🔧', label: 'ModifyInstanceAttribute API' },
  { href: 'https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-createsnapshot', icon: '📷', label: 'CreateSnapshot API' },
  { href: 'https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-runinstances', icon: '🚀', label: 'RunInstances API' },
  { href: 'https://help.aliyun.com/zh/ecs/developer-reference/api-ecs-2014-05-26-copyimage', icon: '📋', label: 'CopyImage API' },
];

const API_LIST = [
  'ModifyInstanceAttribute - 修改实例属性',
  'CreateSnapshot - 创建磁盘快照',
  'CreateImage - 创建自定义镜像',
  'RunInstances - 在目标可用区创建实例',
  'CopyImage - 跨可用区复制镜像',
  'StartInstance / StopInstance - 实例启停控制',
  'DescribeInstanceStatus - 监控迁移状态',
];

export default function InstanceMigration() {
  return (
    <PageLayout title="跨可用区实例迁移" subtitle="阿里云跨可用区实例迁移项目经历与技术实现" backTo="/alibaba">
      <div className={layout.contentGrid}>
        <div className={`${layout.section} ${anim.animateSection}`}>
          <div className={layout.sectionHeader}>
            <div className={layout.sectionIcon}>🏗️</div>
            <h2 className={layout.sectionTitle}>项目介绍</h2>
          </div>
          <p className={layout.paragraph}>
            跨可用区实例迁移是阿里云提供的一项关键服务，允许用户将 ECS 实例从一个可用区迁移到另一个可用区，确保业务的高可用性和灾难恢复能力。
          </p>
          <p className={layout.paragraph}>
            在项目中主要负责迁移策略设计、数据一致性保障、网络类型转换、以及迁移过程中的状态管理和异常处理机制。
          </p>
          <p className={layout.paragraph}>
            实现了批量整体、迁移网络互通、增量数据同步、以及迁移过程的实时监控等核心功能。
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
          <p className={layout.paragraph}>
            在跨可用区实例迁移项目开发过程中，主要使用了以下阿里云 ECS 和相关服务的 API 接口：
          </p>
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
    </PageLayout>
  );
}
