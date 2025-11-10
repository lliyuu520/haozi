'use client';

import { useRouter } from 'next/navigation';
import { Modal } from 'antd';
import MenuForm from '../../components/MenuForm';

export default function CreateMenuModal() {
  const router = useRouter();

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Modal
      open
      title="新建菜单"
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnHidden
      styles={{ body: { padding: '20px' } }}
    >
      <MenuForm
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Modal>
  );
}