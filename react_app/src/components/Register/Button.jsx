// src/components/Button.jsx
import React from 'react';

export default function Button({ type = 'button', onClick, children, className }) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
