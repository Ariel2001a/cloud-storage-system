import React, { useState } from "react";
import "./emailPrompt.css";

export function EmailPromptModal({ defaultDomain = "@ead.com", file, onSubmit, onCancel }) {
  const [username, setUsername] = useState("");
  const [permission, setPermission] = useState("read");

  if (!file) return null;

  const handleSubmit = () => {
    if (!username.trim()) return alert("Enter username");
    onSubmit(`${username}${defaultDomain}`, permission);
    setUsername("");
    setPermission("read");
  };

  let isFolder = false;
  if (file.type === "folder")
    isFolder = true;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Share "{file?.name}"</h3>

        <div style={{ position: "relative", display: "inline-block", width: "100%", marginBottom: "10px" }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
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
            {defaultDomain}
          </span>
        </div>

        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="read">Read</option>
          <option value="write">Write</option>
          <option value= "owner">Owner</option>
          {isFolder && <option value= "share">Share</option>}
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleSubmit}>OK</button>
        </div>
      </div>
    </div>
  );
}
