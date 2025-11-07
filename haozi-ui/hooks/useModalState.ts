'use client';

import { useState, useEffect } from 'react';

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  itemId?: string;
}

export function useModalState() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create'
  });

  // 打开模态框
  const openModal = (mode: 'create' | 'edit' | 'view', itemId?: string) => {
    setModalState({ isOpen: true, mode, itemId });

    // 简单的URL管理
    if (mode === 'create') {
      window.history.pushState({}, '', '/system/menu/modal/create');
    } else if (itemId) {
      window.history.pushState({}, '', `/system/menu/modal/${mode}/${itemId}`);
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'create' });
    window.history.pushState({}, '', '/system/menu/page');
  };

  // 监听浏览器前进后退
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/system/menu/modal/')) {
        const segments = path.split('/');
        const modalIndex = segments.indexOf('modal');
        if (modalIndex !== -1) {
          const mode = segments[modalIndex + 1] as 'create' | 'edit' | 'view';
          const itemId = segments[modalIndex + 2];
          setModalState({ isOpen: true, mode, itemId });
        }
      } else {
        setModalState({ isOpen: false, mode: 'create' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    modalState,
    openModal,
    closeModal
  };
}