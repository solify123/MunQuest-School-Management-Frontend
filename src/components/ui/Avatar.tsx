import React, { useState, useEffect } from 'react';
import { getUserAvatar, getDefaultAvatar, getUserType } from '../../utils/avatarUtils';

interface AvatarProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
  showBorder?: boolean;
  forceRefresh?: boolean; // New prop to force refresh
}

const Avatar: React.FC<AvatarProps> = ({ 
  size = 'medium', 
  className = '', 
  onClick,
  showBorder = false,
  forceRefresh = false
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastAvatarCheck, setLastAvatarCheck] = useState<number>(Date.now());

  const loadAvatar = async () => {
    try {
      setIsLoading(true);
      const avatar = await getUserAvatar();
      setAvatarUrl(avatar);
      setLastAvatarCheck(Date.now());
    } catch (error) {
      console.error('Error loading avatar:', error);
      // Fallback to default avatar
      const userType = getUserType();
      setAvatarUrl(getDefaultAvatar(userType));
      setLastAvatarCheck(Date.now());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  // Listen for changes in localStorage to refresh avatar
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Avatar: Storage change detected, reloading avatar');
      setLastAvatarCheck(Date.now());
      loadAvatar();
    };

    const handleAvatarUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Avatar: avatarUpdated event received', customEvent.detail);
      // Force reload avatar immediately
      setLastAvatarCheck(Date.now());
      loadAvatar();
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom avatar update events
    window.addEventListener('avatarUpdated', handleAvatarUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarUpdated', handleAvatarUpdated);
    };
  }, []);

  // Force refresh when forceRefresh prop changes
  useEffect(() => {
    if (forceRefresh) {
      loadAvatar();
    }
  }, [forceRefresh]);

  // Periodic check for avatar changes as a fallback
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const currentTime = Date.now();
      // Check every 2 seconds if there's a new avatar
      if (currentTime - lastAvatarCheck > 2000) {
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar && storedAvatar !== avatarUrl) {
          console.log('Avatar: Periodic check detected new avatar, reloading');
          loadAvatar();
        }
        setLastAvatarCheck(currentTime);
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  }, [avatarUrl, lastAvatarCheck]);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const borderClasses = showBorder 
    ? 'border-2 border-white shadow-lg' 
    : '';

  if (isLoading) {
    return (
      <div 
        className={`${sizeClasses[size]} bg-gray-200 rounded-full flex items-center justify-center ${className}`}
        onClick={onClick}
      >
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center cursor-pointer ${borderClasses} ${className}`}
      onClick={onClick}
    >
      <img
        src={avatarUrl}
        alt="User Avatar"
        className="w-full h-full rounded-full object-cover"
        onError={(e) => {
          // If image fails to load, show default avatar
          const userType = getUserType();
          e.currentTarget.src = getDefaultAvatar(userType);
        }}
      />
    </div>
  );
};

export default Avatar;
