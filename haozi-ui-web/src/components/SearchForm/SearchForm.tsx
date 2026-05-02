import type { ReactNode } from 'react';
import { Card, Form } from 'antd';
import type { FormProps } from 'antd';

type SearchFormProps<T extends object> = Omit<FormProps<T>, 'layout'> & {
  children: ReactNode;
};

/**
 * 列表查询区统一包装。
 *
 * 固定 inline 表单、卡片和换行策略，迁移页只声明查询字段与动作，避免窄屏或长字段时挤压主表格。
 */
export function SearchForm<T extends object>({ children, className, ...props }: SearchFormProps<T>) {
  const mergedClassName = ['search-form', className].filter(Boolean).join(' ');

  return (
    <Card className="search-card">
      <Form<T> {...props} layout="inline" className={mergedClassName}>
        {children}
      </Form>
    </Card>
  );
}
