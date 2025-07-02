import { useState, useEffect } from 'react';

export function useUserAvatar() {
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('fitchain_avatar');
    return saved || 'runner-basic';
  });

  const updateAvatar = (avatarId) => {
    setSelectedAvatar(avatarId);
    localStorage.setItem('fitchain_avatar', avatarId);
  };

  return {
    selectedAvatar,
    updateAvatar
  };
}