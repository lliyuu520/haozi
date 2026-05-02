import type { ReactNode } from 'react';
import { Typography } from 'antd';

type PageContainerProps = {
  title: string;
  description?: string;
  extra?: ReactNode;
  children: ReactNode;
};

/**
 * 业务页面统一容器。
 *
 * 负责固定标题、说明、右侧动作和内容堆叠的布局语义，避免迁移页面各自拼装导致间距和响应式行为不一致。
 */
export function PageContainer({ title, description, extra, children }: PageContainerProps) {
  return (
    <section className="page-container">
      <div className="page-container__header">
        <div className="page-container__heading">
          <Typography.Title level={2} className="page-container__title">
            {title}
          </Typography.Title>
          {description && (
            <Typography.Paragraph className="page-container__description">
              {description}
            </Typography.Paragraph>
          )}
        </div>
        {extra && <div className="page-container__extra">{extra}</div>}
      </div>
      <div className="page-stack">{children}</div>
    </section>
  );
}
