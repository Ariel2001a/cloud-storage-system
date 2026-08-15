import React, { useState, useEffect } from "react";
import "./emailPrompt.css";
import { checkPermission, starOrUnstarFileOrPublic } from "../api/files.js"

export function EmailPromptModal({ defaultDomain = "@ead.com", file, onSubmit, onCancel, isRtl }) {
  const [username, setUsername] = useState("");
  const [permission, setPermission] = useState("read");
  const [isPublic, setIsPublic] = useState(false);

  const isSharedPage = window.location.pathname.includes("share");

  useEffect(() => {
    if (!file) return;

    setIsPublic(file.pub);

    if (!file.pub && isSharedPage) {
      alert(isRtl ? "אין הרשאה לשתף קובץ זה" : "You are not allowed to share this file");
      onCancel();
    }
  }, [file, isSharedPage]);


  const handleSubmit = async () => {
    if (!username.trim()) return alert("Enter username");

    try {

      if (permission === "write") {
        const canRead = await checkPermission(username, file.id, "read");
        if (!canRead) onSubmit(`${username}${defaultDomain}`, "read");
      }

      const hasPermission = await checkPermission(username, file.id, permission);
      if (!hasPermission) {
        onSubmit(`${username}${defaultDomain}`, permission);
      }

      else
        alert("permission already exist!")

      if (isPublic) {
        await starOrUnstarFileOrPublic(file.id, "public");
      }


      setUsername("");
      setPermission("read");
      setIsPublic(false);

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  let isFolder = false;
  if (file.type === "folder")
    isFolder = true;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isRtl ? "שיתוף" : "Share"} "{file?.name}"</h3>

        <div style={{ position: "relative", display: "inline-block", width: "100%", marginBottom: "10px" }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={isRtl ? "שם משתמש" : "username"}
            style={{ width: "100%", paddingRight: "80px", boxSizing: "border-box" }}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#555",
            }}
          >
            {isRtl ? "ead.com@" : defaultDomain}

          </span>
        </div>

        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >

          <option value="read">{isRtl ? "קריאה" : "Read"}</option>
          <option value="write">{isRtl ? "כתיבה" : "Write"}</option>
          {isFolder && <option value="share">{isRtl ? "שיתוף" : "Share"}</option>}
        </select>


        {!isSharedPage && !file.pub && <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            {isRtl ? "קובץ ציבורי" : "Make Public"}
          </label>
        </div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onCancel}>{isRtl ? "ביטול" : "Cancel"}</button>
          <button onClick={handleSubmit}>{isRtl ? "אישור" : "Ok"}</button>
        </div>
      </div>
    </div>
  );
}
