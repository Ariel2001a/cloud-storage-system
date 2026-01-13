import { useState } from "react";
import { patchFileById } from "../api/files"; // PATCH API
import "../components/CreateFileForm.css"; // reuse same styles

export default function EditFileForm({ file, onClose, onEdit, lang }) {
  const [content, setContent] = useState(file.content || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert(lang === "he" ? "התוכן דרוש!" : "Content is required!");

    setLoading(true);
    try {
      // PATCH only the content
      await patchFileById(file.id, { content });

      onEdit && onEdit(file.id, { content }); // update parent view
      onClose();
    } catch (err) {
      console.error(err);
      alert((lang === "he" ? "עדכון נכשל: " : "Update failed: ") + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{lang === "he" ? "ערוך קובץ" : "Edit File"}</h2>
        <form onSubmit={handleSubmit} className="drive-form">

          {/* Content input only */}
          <div className="form-group">
            <label>{lang === "he" ? "תוכן" : "Content"}:</label>
            <textarea
              className="drive-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ minHeight: "200px" }}
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="drive-btn-secondary"
              onClick={onClose}
            >
              {lang === "he" ? "ביטול" : "Cancel"}
            </button>
            <button
              type="submit"
              className="drive-btn-primary"
              disabled={loading}
            >
              {loading
                ? lang === "he" ? "מעדכן..." : "Updating..."
                : lang === "he" ? "ערוך קובץ" : "Edit File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
