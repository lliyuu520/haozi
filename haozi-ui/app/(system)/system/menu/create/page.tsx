'use client';

import { useRouter } from 'next/navigation';
import MenuForm from '../components/MenuForm';

export default function CreateMenuPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/system/menu');
  };

  const handleCancel = () => {
    router.push('/system/menu');
  };

  return (
    <div className="page-container">
      <MenuForm
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}