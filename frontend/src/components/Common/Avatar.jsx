import React, { useState } from 'react';

const Avatar = ({ url, name, className }) => {
  const [error, setError] = useState(false);

  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  if (!url || error) {
    return (
      <div 
        className={`avatar-placeholder ${className || ''}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--primary)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '50%',
          fontSize: '1.2rem'
        }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img 
      src={url} 
      alt={name} 
      className={className} 
      onError={() => setError(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
    />
  );
};

export default Avatar;
