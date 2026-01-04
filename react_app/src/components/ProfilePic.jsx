// Location: src/components/ProfilePic.jsx

import React, { useState } from 'react';

export default function ProfilePic() {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      <label htmlFor="profilePic" className="photo-placeholder">
        {preview ? <img src={preview} alt="Preview" /> : 'Upload Picture'}
      </label>
      <input
        type="file"
        id="profilePic"
        name="profilePic"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}
