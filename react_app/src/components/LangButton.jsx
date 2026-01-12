// src/components/LangButton.jsx
import React from 'react';

export default function LangButton({ lang, setLang }) {
  if (!setLang) return null; // safety if props missing

  const isRtl = lang === 'he';

  return (
    <button
      onClick={() => setLang(isRtl ? 'en' : 'he')}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 999999,
        background: '#34a853',
        color: '#fff',
        border: 'none',
        padding: '10px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      {isRtl ? 'English' : 'עברית'}
    </button>
  );
}
