import React, { useState } from 'react';
import Image from 'next/image';

const UserAvatar = ({ 
  user, 
  size = 40, 
  className = "",
  fallbackClassName = ""
}) => {
  const [imageError, setImageError] = useState(false);

  // Se não há usuário ou nome, retorna null
  if (!user || !user.name) {
    return null;
  }

  // Se a imagem falhou ao carregar ou não existe, mostra a primeira letra
  if (imageError || !user.image) {
    const firstLetter = user.name.charAt(0).toUpperCase();
    const sizeClass = size <= 24 ? 'text-xs' : size <= 32 ? 'text-sm' : size <= 48 ? 'text-base' : 'text-lg';
    
    return (
      <div 
        className={`bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold ${sizeClass} ${fallbackClassName}`}
        style={{ width: size, height: size }}
      >
        {firstLetter}
      </div>
    );
  }

  // Se tem imagem, tenta carregar
  return (
    <Image
      src={user.image}
      alt={`Avatar de ${user.name}`}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default UserAvatar; 