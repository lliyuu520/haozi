'use client';

import { ReactRouteModal } from '@/components/ui/ReactRouteModal';
import MenuForm from '@/app/(system)/system/menu/components/MenuForm';

// 菜单弹窗内容渲染组件
function MenuModalContent({ params, close }: { params: any; close: () => void }) {
  const { action, id } = params;

  const getMode = (actionType: string): 'create' | 'edit' | 'view' => {
    switch (actionType) {
      case 'create':
        return 'create';
      case 'edit':
        return 'edit';
      case 'view':
        return 'view';
      default:
        return 'create';
    }
  };

  const mode = getMode(action);

  return (
    <MenuForm
      mode={mode}
      menuId={id}
      onSuccess={close}
      onCancel={close}
    />
  );
}

export default function MenuModalPage() {
  return (
    <ReactRouteModal
      basePath="system/menu"
      actions={['create', 'edit', 'view']}
      defaultConfig={{
        width: 680,
        closable: true,
        maskClosable: false,
        destroyOnClose: true
      }}
    >
      {(params, close) => <MenuModalContent params={params} close={close} />}
    </ReactRouteModal>
  );
}