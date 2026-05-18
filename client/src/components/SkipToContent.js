import React from 'react';

const SkipToContent = () => {
  return (
    <a
      href="/goods"
      className="skip-to-content"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '0',
        background: '#1db954',
        color: 'white',
        padding: '8px 16px',
        textDecoration: 'none',
        zIndex: 9999,
        transition: 'top 0.2s'
      }}
      onFocus={(e) => e.currentTarget.style.top = '10px'}
      onBlur={(e) => e.currentTarget.style.top = '-40px'}
    >
      Перейти к основному содержанию
    </a>
  );
};

export default SkipToContent;