import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { API } from "../api";

function initCustomFields(p) {
  if (p.custom_fields && p.custom_fields.length > 0) return p.custom_fields;
  const fields = [];
  if (p.title)   fields.push({ label: "企业职位",  type: "text", value: p.title });
  if (p.address) fields.push({ label: "企业所在地", type: "text", value: p.address });
  if (fields.length === 0) fields.push({ label: "", type: "text", value: "" });
  return fields;
}

function initIntroBlocks(p) {
  if (p.intro_blocks && p.intro_blocks.length > 0) return p.intro_blocks;
  const blocks = [];
  if (p.video_url) blocks.push({ type: "video", value: p.video_url });
  if (p.intro)     blocks.push({ type: "text",  value: p.intro });
  if (blocks.length === 0) blocks.push({ type: "text", value: "" });
  return blocks;
}

function UploadBtn({ accept, token, onUrl, label }) {
  const [loading, setLoading] = useState(false);
  const doUpload = async (file) => {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`${API}/api/upload`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const data = JSON.parse(await res.text());
      if (data.code === 0) onUrl(data.data.url);
      else alert("上传失败：" + data.msg);
    } catch (e) { alert("上传失败，请检查后端"); }
    setLoading(false);
  };
  return (
    <label style={{ padding: "8px 12px", background: "var(--blue)", color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>
      {loading ? "上传中…" : label}
      <input type="file" accept={accept} style={{ display: "none" }} onChange={e => doUpload(e.target.files[0])} />
    </label>
  );
}

// 单个职务卡片
function PositionCard({ p, i, isOnly, roles, token, onUpdate, onDelete }) {
  const updField = (fi, k, v) => onUpdate("custom_fields", p.custom_fields.map((f, x) => x === fi ? { ...f, [k]: v } : f));
  const addField = () => { if ((p.custom_fields||[]).length < 5) onUpdate("custom_fields", [...(p.custom_fields||[]), { label: "", type: "text", value: "" }]); };
  const delField = (fi) => onUpdate("custom_fields", p.custom_fields.filter((_, x) => x !== fi));

  const updBlock = (bi, k, v) => onUpdate("intro_blocks", p.intro_blocks.map((b, x) => x === bi ? { ...b, [k]: v } : b));
  const addBlock = () => onUpdate("intro_blocks", [...(p.intro_blocks||[]), { type: "text", value: "" }]);
  const delBlock = (bi) => onUpdate("intro_blocks", p.intro_blocks.filter((_, x) => x !== bi));

  return (
    <div style={{ marginBottom: 12, border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", background: "var(--navy)", position: "relative" }}>
      {/* 职务名 + 主要标签 + 删除 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <input
          className="fi" style={{ flex: 1, fontWeight: 500 }}
          value={p.role_label} placeholder="职务名称，如：名誉会长"
          onChange={e => onUpdate("role_label", e.target.value)}
          list="roles-datalist"
        />
        {i === 0 && <span style={{ fontSize: 11, color: "var(--blue3)", background: "rgba(58,143,232,.12)", padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>主要</span>}
        {!isOnly && <button onClick={onDelete} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 18, padding: "0 2px", lineHeight: 1 }}>✕</button>}
      </div>

      {/* 自定义字段 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 500, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>自定义字段（最多 5 个）</span>
          <span style={{ color: "var(--text3)" }}>{(p.custom_fields||[]).length}/5</span>
        </div>
        {(p.custom_fields||[]).map((f, fi) => (
          <div key={fi} style={{ marginBottom: 6, background: "rgba(255,255,255,.03)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input className="fi" style={{ width: 110, flexShrink: 0, fontSize: 12 }} value={f.label} placeholder="标签名" onChange={e => updField(fi, "label", e.target.value)} />
              <select className="fse" style={{ width: 74, flexShrink: 0, fontSize: 12, padding: "8px 6px" }} value={f.type} onChange={e => updField(fi, "type", e.target.value)}>
                <option value="text">文本</option>
                <option value="image">图片</option>
                <option value="video">视频</option>
              </select>
              {(p.custom_fields||[]).length > 1 && <button onClick={() => delField(fi)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 15, padding: "0 4px" }}>✕</button>}
            </div>
            {f.type === "text" && <input className="fi" style={{ fontSize: 13 }} value={f.value} placeholder="内容" onChange={e => updField(fi, "value", e.target.value)} />}
            {(f.type === "image" || f.type === "video") && (
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <input className="fi" style={{ flex: 1, fontSize: 12 }} value={f.value} placeholder="粘贴 URL 或点击上传" onChange={e => updField(fi, "value", e.target.value)} />
                <UploadBtn accept={f.type === "image" ? "image/*" : "video/*"} token={token} label="上传" onUrl={url => updField(fi, "value", url)} />
              </div>
            )}
          </div>
        ))}
        <button onClick={addField} disabled={(p.custom_fields||[]).length >= 5}
          style={{ width: "100%", padding: "6px", border: "1px dashed var(--border)", background: "none", color: (p.custom_fields||[]).length >= 5 ? "var(--text3)" : "var(--blue3)", borderRadius: 8, cursor: (p.custom_fields||[]).length >= 5 ? "not-allowed" : "pointer", fontSize: 12, marginTop: 4 }}>
          {(p.custom_fields||[]).length >= 5 ? "已达上限 5 个" : "＋ 添加字段"}
        </button>
      </div>

      {/* 公司信息 */}
      <div style={{ paddingTop: 10, borderTop: "1px solid var(--border)", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 500, marginBottom: 8 }}>公司信息</div>
        <div className="fg"><label className="fl">公司名称</label><input className="fi" value={p.company_name} onChange={e => onUpdate("company_name", e.target.value)} placeholder="公司全称" /></div>
        <ImageUploader label="公司 Logo" value={p.company_logo} onChange={v => onUpdate("company_logo", v)} token={token} />
      </div>

      {/* 企业介绍 */}
      <div style={{ paddingTop: 10, borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 500, marginBottom: 8 }}>企业介绍</div>
        {(p.intro_blocks||[]).map((b, bi) => (
          <div key={bi} style={{ marginBottom: 8, background: "rgba(255,255,255,.03)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <select className="fse" style={{ flex: 1, fontSize: 12, padding: "7px 8px" }} value={b.type} onChange={e => updBlock(bi, "type", e.target.value)}>
                <option value="text">📝 文本</option>
                <option value="image">🖼 图片</option>
                <option value="video">🎬 视频</option>
              </select>
              {(p.intro_blocks||[]).length > 1 && <button onClick={() => delBlock(bi)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 15, padding: "0 4px" }}>✕</button>}
            </div>
            {b.type === "text" && <textarea className="fta" style={{ minHeight: 72, fontSize: 13 }} value={b.value} placeholder="企业简介内容..." onChange={e => updBlock(bi, "value", e.target.value)} />}
            {(b.type === "image" || b.type === "video") && (
              <div>
                {b.value && b.type === "image" && <img src={b.value} style={{ width: "100%", maxHeight: 80, objectFit: "cover", borderRadius: 6, marginBottom: 6 }} alt="" onError={e => e.target.style.display="none"} />}
                {b.value && b.type === "video" && <video src={b.value} controls style={{ width: "100%", maxHeight: 120, borderRadius: 6, marginBottom: 6 }} />}
                <div style={{ display: "flex", gap: 6 }}>
                  <input className="fi" style={{ flex: 1, fontSize: 12 }} value={b.value} placeholder="粘贴 URL 或点击上传" onChange={e => updBlock(bi, "value", e.target.value)} />
                  <UploadBtn accept={b.type === "image" ? "image/*" : "video/*"} token={token} label="上传" onUrl={url => updBlock(bi, "value", url)} />
                </div>
              </div>
            )}
          </div>
        ))}
        <button onClick={addBlock}
          style={{ width: "100%", padding: "6px", border: "1px dashed var(--border)", background: "none", color: "var(--blue3)", borderRadius: 8, cursor: "pointer", fontSize: 12, marginTop: 2 }}>
          ＋ 添加介绍块
        </button>
      </div>
    </div>
  );
}

export default function MemberModal({ m, roles, onSave, onClose, token }) {
  const newPos = (label = "") => ({
    role_id:      roles.find(r => r.name === label)?.id || roles[0]?.id || 1,
    role_label:   label,
    company_name: "", company_logo: "",
    custom_fields: [{ label: "", type: "text", value: "" }],
    intro_blocks:  [{ type: "text", value: "" }],
  });

  const initPositions = () => {
    if (m.positions && m.positions.length > 0)
      return m.positions.map(p => ({
        ...p,
        role_label:    p.role_label || roles.find(r => r.id === p.role_id)?.name || "",
        custom_fields: initCustomFields(p),
        intro_blocks:  initIntroBlocks(p),
      }));
    return [{ ...newPos(roles.find(r => r.id === (m.roleId || m.role_id))?.name || ""),
      company_name: m.company || m.company_name || "",
      company_logo: m.companyLogo || m.company_logo || "",
      custom_fields: initCustomFields(m),
      intro_blocks:  initIntroBlocks(m),
    }];
  };

  const [name,      setName]  = useState(m.name || "");
  const [photo,     setPhoto] = useState(m.photo || "");
  const [active,    setActive]= useState(m.active !== false);
  const [positions, setPos]   = useState(initPositions);
  const [activeTab, setTab]   = useState(0);

  const updPos = (i, k, v) => setPos(ps => ps.map((p, idx) => idx === i ? { ...p, [k]: v } : p));
  const addPos = () => {
    const next = positions.length;
    setPos(ps => [...ps, newPos()]);
    setTab(next);
  };
  const delPos = (i) => {
    setPos(ps => ps.filter((_, idx) => idx !== i));
    setTab(t => Math.max(0, t > i ? t - 1 : t === i ? Math.max(0, i - 1) : t));
  };

  const findRole = label => roles.find(r => r.name === label)?.id || roles[0]?.id || 1;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...m, name, photo, active,
      role_id:   findRole(positions[0]?.role_label),
      roleId:    findRole(positions[0]?.role_label),
      is_active: active ? 1 : 0,
      positions: positions.map(p => ({
        ...p,
        role_id:   findRole(p.role_label),
        title:     p.custom_fields?.find(f => f.type==="text" && (f.label==="企业职位"||f.label==="职位"))?.value || "",
        address:   p.custom_fields?.find(f => f.type==="text" && (f.label==="企业所在地"||f.label==="所在地"))?.value || "",
        intro:     p.intro_blocks?.find(b => b.type==="text")?.value || "",
        video_url: p.intro_blocks?.find(b => b.type==="video")?.value || "",
        custom_fields: p.custom_fields || [],
        intro_blocks:  p.intro_blocks || [],
      })),
    });
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ width: 640, maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div className="modal-title">{m.id ? "编辑会员" : "新增会员"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ overflowY: "auto", maxHeight: "calc(90vh - 120px)" }}>

          {/* 基本信息 */}
          <div className="fg"><label className="fl">姓名 *</label><input className="fi" value={name} onChange={e => setName(e.target.value)} placeholder="请输入姓名" /></div>
          <ImageUploader label="头像照片" value={photo} onChange={setPhoto} token={token} />
          <div className="fg">
            <div className="toggle-row">
              <span style={{ fontSize: 13 }}>是否显示在前台</span>
              <label className="toggle"><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} /><span className="toggle-slider" /></label>
            </div>
          </div>

          {/* 职务标签栏 */}
          <div style={{ margin: "16px 0 12px", paddingBottom: 0, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", paddingBottom: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--blue3)", marginRight: 4 }}>职务 & 企业信息</span>

              {/* 职务 tab 标签 */}
              {positions.map((p, i) => (
                <div key={i} onClick={() => setTab(i)}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: "8px 8px 0 0", cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all .15s", marginBottom: -1,
                    background: activeTab === i ? "var(--navy)" : "transparent",
                    border: activeTab === i ? "1px solid var(--border)" : "1px solid transparent",
                    borderBottom: activeTab === i ? "1px solid var(--navy)" : "1px solid transparent",
                    color: activeTab === i ? "var(--text1)" : "var(--text3)",
                  }}>
                  {p.role_label || `职务${i+1}`}
                  {positions.length > 1 && (
                    <span onClick={e => { e.stopPropagation(); delPos(i); }}
                      style={{ marginLeft: 2, color: "#ef4444", fontSize: 13, lineHeight: 1, padding: "0 1px" }}>✕</span>
                  )}
                </div>
              ))}

              {/* ＋ 添加职务 */}
              <button onClick={addPos}
                style={{ padding: "4px 10px", borderRadius: "8px 8px 0 0", border: "1px dashed var(--border)", background: "none", color: "var(--blue3)", cursor: "pointer", fontSize: 18, lineHeight: 1, marginBottom: -1 }}>
                ＋
              </button>
            </div>
          </div>

          {/* datalist 供职务名称快速选择 */}
          <datalist id="roles-datalist">
            {roles.map(r => <option key={r.id} value={r.name} />)}
          </datalist>

          {/* 当前职务内容 */}
          {positions[activeTab] && (
            <PositionCard
              key={activeTab}
              p={positions[activeTab]}
              i={activeTab}
              isOnly={positions.length === 1}
              roles={roles}
              token={token}
              onUpdate={(k, v) => updPos(activeTab, k, v)}
              onDelete={() => delPos(activeTab)}
            />
          )}
        </div>

        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-primary" onClick={handleSave}>💾 保存</button>
        </div>
      </div>
    </div>
  );
}