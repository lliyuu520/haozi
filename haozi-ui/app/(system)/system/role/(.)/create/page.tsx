'use client';

import { useRouter } from 'next/navigation';
import { Modal } from 'antd';
import RoleForm from '../../components/RoleForm';

export default function CreateRoleModal() {
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
      title="新建角色"
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnHidden
      styles={{ body: { padding: '20px' } }}
    >
      <RoleForm
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Modal>
  );
}