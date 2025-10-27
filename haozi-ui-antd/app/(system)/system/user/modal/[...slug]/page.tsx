'use client';

import { ReactRouteModal } from '@/components/ui/ReactRouteModal';
import UserCreateModal from '@/components/modals/UserCreateModal';
import UserEditModal from '@/components/modals/UserEditModal';

// 用户弹窗内容渲染组件
function UserModalContent({ params, close }: { params: any; close: () => void }) {
  const action = params.action;
  const id = params.id;

  switch (action) {
    case 'create':
      return <UserCreateModal onClose={close} />;

    case 'edit':
      return <UserEditModal userId={id} onClose={close} />;

    case 'view':
      return <UserEditModal userId={id} readOnly onClose={close} />;

    default:
      return <div>未知的操作类型: {action}</div>;
  }
}

export default function UserModalPage() {
  return (
    <ReactRouteModal
      basePath="system/user"
      actions={['create', 'edit', 'view']}
      defaultConfig={{
        width: 800,
        closable: true,
        maskClosable: false,
        destroyOnClose: true
      }}
    >
      {(params, close) => <UserModalContent params={params} close={close} />}
    </ReactRouteModal>
  );
}