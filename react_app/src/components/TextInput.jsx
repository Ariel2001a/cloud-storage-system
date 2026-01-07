// src/components/TextInput.jsx
import React from 'react';

export default function TextInput({ id, placeholder, type = 'text', value, onChange }) {
  return (
    <div id={id}>
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
