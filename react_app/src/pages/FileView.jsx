import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFileContent } from "../api/files";
import "./FileView.css";
import { getUserIdFromToken } from "../utils/tokenUtils";
import EditFileForm from "./EditFileForm.jsx";

export default function FileView({ fileId, fileType, fileName, onClose, lang = "he" }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const isRtl = lang === "he";
  const navigate = useNavigate();
  const [editingFile, setEditingFile] = useState(false); // toggle edit form
  const SERVER_URL = "http://localhost:8080";

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      navigate("/login");
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const data = await getFileContent(fileId);
        setContent(data || ""); // make sure content is at least an empty string
      } catch (error) {
        console.error("Error loading file content:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fileId, navigate]);

  return (
    <div className="file-modal-overlay" onClick={onClose}>
      <div className="file-view-modal" onClick={(e) => e.stopPropagation()}>
        <header className="file-view-header">
          <div className="header-right">
            <span className="file-icon">{fileType === "image" ? "🖼️" : "📄"} </span>
            <h2>{fileName || (isRtl ? "צפייה בקובץ" : "File View")}</h2>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="drive-btn-primary"
              onClick={() => setEditingFile(true)}
            >
              {lang === "he" ? "ערוך קובץ" : "Edit File"}
            </button>
            <button className="close-x-btn" onClick={onClose}>✕</button>
          </div>
        </header>

        <div className={`document-paper ${fileType === "image" ? "is-image" : ""}`}>
          {loading ? (
            <div className="loading-spinner">{isRtl ? "טוען..." : "Loading..."}</div>
          ) : (
            fileType === "image" ? (
              <div className="image-view-container">
                <img
                  src={`${SERVER_URL}${content}`}
                  alt={fileName}
                  className="file-view-image"
                />
              </div>
            ) : (
              <textarea
                className="file-textarea"
                value={content}
                readOnly
                style={{ direction: isRtl ? "rtl" : "ltr" }}
              />
            )
          )}
        </div>

        {editingFile && (
          <EditFileForm
            file={{ id: fileId, name: fileName, type: fileType, content }}
            lang={lang}
            onClose={() => setEditingFile(false)}
            onEdit={(id, updated) => setContent(updated.content || "")}
          />
        )}
      </div>
    </div>
  );
}
