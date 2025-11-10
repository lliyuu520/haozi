'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Modal } from 'antd';
import MenuForm from '../../../components/MenuForm';

export default function EditMenuModal({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Modal
      open
      title="编辑菜单"
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnHidden
      styles={{ body: { padding: '20px' } }}
    >
      <MenuForm
        mode="edit"
        menuId={resolvedParams.id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Modal>
  );
}