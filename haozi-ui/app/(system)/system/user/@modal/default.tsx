'use client';

import { Modal } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

export default function UserModal() {
  const pathname = usePathname();
  const router = useRouter();

  // 获取用户ID和操作类型
  const pathSegments = pathname.split('/');
  const userId = pathSegments[pathSegments.length - 2]; // [id] segment
  const action = pathSegments[pathSegments.length - 1]; // view or edit

  const handleClose = () => {
    router.push('/system/user');
  };

  const getModalTitle = () => {
    switch (action) {
      case 'view':
        return '查看用户';
      case 'edit':
        return '编辑用户';
      default:
        return '用户详情';
    }
  };

  return (
    <Modal
      open={true}
      title={getModalTitle()}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
      styles={{
        body: { maxHeight: '70vh', overflow: 'auto' },
      }}
    >
      <div>
        {/* 这里可以渲染用户表单内容 */}
        {/* 暂时留空，可以通过路由动态加载组件 */}
      </div>
    </Modal>
  );
}