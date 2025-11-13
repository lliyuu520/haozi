'use client';

import { Suspense } from 'react';
import { Spin } from 'antd';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="user-management">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}