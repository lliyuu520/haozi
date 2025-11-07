'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Modal } from 'antd';
import MenuForm from '@/app/(system)/system/menu/components/MenuForm';

interface MenuModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  menuId?: string;
  onClose: () => void;
}

export default function MenuModal({ isOpen, mode, menuId, onClose }: MenuModalProps) {
  const pathname = usePathname();

  // 处理成功回调
  const handleSuccess = () => {
    onClose();
    // 刷新页面数据
    window.location.reload();
  };

  return (
    <Modal
      title={`${mode === 'create' ? '创建' : mode === 'edit' ? '编辑' : '查看'}菜单`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={680}
      destroyOnHidden={true}
      maskClosable={true}
    >
      <MenuForm
        mode={mode}
        menuId={menuId}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
}