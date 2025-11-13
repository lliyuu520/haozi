'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Modal } from 'antd';
import RoleForm from '../../../components/RoleForm';

export default function EditRoleModal({ params }: { params: Promise<{ id: string }> }) {
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
      title="编辑角色"
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnHidden
      styles={{ body: { padding: '20px' } }}
    >
      <RoleForm
        mode="edit"
        roleId={resolvedParams.id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Modal>
  );
}