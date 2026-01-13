import { useState, useRef } from "react";
import { patchFileById, deleteFileOrFolder } from "../api/files";
import "../components/CreateFileForm.css";

export default function EditFileForm({ file, onClose, onEdit, lang }) {
  const [content, setContent] = useState(file.content || "");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(file.type === "image" ? `http://localhost:8080${file.content}` : null);
  const fileInputRef = useRef(null);

  const isImage = file.type === "image";

  // טיפול בבחירת תמונה חדשה
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setContent(reader.result); // שומר את ה-Base64 החדש ב-content
      setPreview(reader.result); // מציג תצוגה מקדימה
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDelete = async () => {
    const confirmMsg = lang === "he" ? "האם אתה בטוח שברצונך למחוק?" : "Are you sure you want to delete?";
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      await deleteFileOrFolder(file.id);
      window.location.reload(); // רענון פשוט לעדכון הרשימה
    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedFile = await patchFileById(file.id, { content });

      onEdit && onEdit(file.id, { content: updatedFile.content });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{lang === "he" ? (isImage ? "ניהול תמונה" : "ערוך קובץ") : (isImage ? "Manage Image" : "Edit File")}</h2>

        <form onSubmit={handleSubmit} className="drive-form">
          <div className="form-group">
            {isImage ? (
              <div className="image-edit-section" style={{ textAlign: "center" }}>
                <label>{lang === "he" ? "תצוגה מקדימה:" : "Preview:"}</label>
                <div className="edit-preview-box" style={{ margin: "15px 0" }}>
                  <img src={preview} alt="preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }} />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                <button
                  type="button"
                  className="drive-btn-secondary"
                  onClick={() => fileInputRef.current.click()}
                >
                  {lang === "he" ? "החלף תמונה" : "Replace Image"}
                </button>
              </div>
            ) : (
              <>
                <label>{lang === "he" ? "תוכן" : "Content"}:</label>
                <textarea
                  className="drive-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ minHeight: "200px" }}
                />
              </>
            )}
          </div>

          <div className="form-actions" style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
            {/* כפתור מחיקה בצד אחד */}
            <button
              type="button"
              className="drive-btn-danger"
              onClick={handleDelete}
              style={{ backgroundColor: "#d93025", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}
            >
              {lang === "he" ? "מחק" : "Delete"}
            </button>

            {/* כפתורי אישור וביטול בצד שני */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="drive-btn-secondary" onClick={onClose}>
                {lang === "he" ? "ביטול" : "Cancel"}
              </button>
              <button type="submit" className="drive-btn-primary" disabled={loading}>
                {loading ? (lang === "he" ? "מעדכן..." : "Updating...") : (lang === "he" ? "שמור" : "Save")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
