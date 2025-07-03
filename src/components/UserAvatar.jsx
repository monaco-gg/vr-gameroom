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
    
    return (
      <div 
        className={`bg-avatar-fallback rounded-full flex items-center justify-center text-avatar-fallback-text font-bold ${fallbackClassName}`}
        style={{ 
          width: size, 
          height: size,
          fontSize: `${size * 0.4}px` // Texto se adapta ao tamanho do elemento
        }}
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