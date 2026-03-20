import { useState, useRef } from "react";
import { API } from "../api";

export default function ImageUploader({ value, onChange, label, token }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const doUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.code === 0) onChange(data.data.url);
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  return (
    <div className="fg">
      <label className="fl">{label}</label>
      <div
        style={{
          border: `2px dashed ${dragging ? "#3a8fe8" : "var(--border)"}`,
          borderRadius: 10, padding: "12px 14px", cursor: "pointer",
          background: dragging ? "rgba(58,143,232,.08)" : "var(--navy)",
          transition: "all .2s", position: "relative",
        }}
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); doUpload(e.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={e => doUpload(e.target.files[0])} />
        {value ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={value} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }}
              onError={e => e.target.style.display = "none"} alt="" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>已上传 / 当前URL</div>
              <input className="fi" style={{ fontSize: 11, padding: "4px 8px" }} value={value}
                onChange={e => onChange(e.target.value)} onClick={e => e.stopPropagation()} placeholder="https://..." />
            </div>
            <button style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 16, padding: 4 }}
              onClick={e => { e.stopPropagation(); onChange(""); }}>✕</button>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "var(--text3)" }}>
            {uploading ? (
              <div style={{ fontSize: 13 }}>上传中...</div>
            ) : (
              <>
                <div style={{ fontSize: 24, marginBottom: 4 }}>📁</div>
                <div style={{ fontSize: 12 }}>拖拽图片到此处，或<span style={{ color: "#3a8fe8" }}>点击选择</span></div>
                <div style={{ fontSize: 11, marginTop: 4 }}>也可直接粘贴 URL：</div>
                <input className="fi" style={{ marginTop: 6, fontSize: 11, padding: "4px 8px" }}
                  value={value || ""} onChange={e => onChange(e.target.value)}
                  onClick={e => e.stopPropagation()} placeholder="https://..." />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
