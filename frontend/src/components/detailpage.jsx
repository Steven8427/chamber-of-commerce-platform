import { useState, useEffect } from "react";
import { API } from "../api";
import { mkPhoto } from "../utils";

function safeJSON(v) {
  if (!v) return null;
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return null; }
}

export default function DetailPage({ member, roles, onBack }) {
  const [detail, setDetail]       = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    fetch(`${API}/api/members/${member.id}`)
      .then(r => r.json())
      .then(d => { if (d.code === 0) setDetail(d.data); })
      .catch(() => {});
  }, [member.id]);

  const data = detail || member;
  const positions = (data.positions && data.positions.length > 0)
    ? data.positions
    : [{
        role_id:      data.role_id || data.roleId,
        title:        data.title || "",
        address:      data.address || "",
        company_name: data.company_name || data.company || "",
        company_logo: data.company_logo || data.companyLogo || "",
        intro:        data.intro || "",
        video_url:    data.video_url || "",
      }];

  const getRoleName = id => roles.find(r => r.id === id)?.name || "";
  const cur = positions[Math.min(activeIdx, positions.length - 1)];

  const cfRaw = safeJSON(cur.custom_fields);
  const ibRaw = safeJSON(cur.intro_blocks);

  // 自定义字段：有存新数据用新数据，否则从旧 title/address 迁移
  const customFields = (() => {
    const cf = cfRaw?.filter(f => f.value?.trim());
    if (cf && cf.length > 0) return cf;
    const fields = [];
    if (cur.title?.trim())   fields.push({ label: "企业职位",  type: "text", value: cur.title });
    if (cur.address?.trim()) fields.push({ label: "企业所在地", type: "text", value: cur.address });
    return fields;
  })();

  // 企业介绍区块：有存新数据用新数据，否则从旧 video_url/intro 迁移
  const introBlocks = (() => {
    const ib = ibRaw?.filter(b => b.value?.trim());
    if (ib && ib.length > 0) return ib;
    const blocks = [];
    if (cur.video_url?.trim()) blocks.push({ type: "video", value: cur.video_url });
    if (cur.intro?.trim())     blocks.push({ type: "text",  value: cur.intro });
    return blocks;
  })();

  return (
    <div className="det-page">
      <div className="det-header">
        <button className="det-back" onClick={onBack}>‹</button>
        <div className="det-header-title">会员详情</div>
        <div style={{ width: 34 }} />
      </div>

      <div style={{ height: 10 }} />

      {/* 个人信息卡片 */}
      <div className="det-profile">
        <img src={data.photo || mkPhoto(data.name)} className="det-avatar" alt={data.name} />
        <div className="det-info">
          <div className="det-name">{data.name}</div>

          {/* 多职务标签 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, margin: "8px 0 10px" }}>
            {positions.map((p, i) => (
              <span key={i} onClick={() => setActiveIdx(i)} style={{
                display: "inline-block", padding: "4px 12px", borderRadius: 20,
                fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "all .15s",
                background: activeIdx === i ? "linear-gradient(135deg,#1255a3,#3a8fe8)" : "#e8f0fe",
                color: activeIdx === i ? "#fff" : "#1a6fd4",
                boxShadow: activeIdx === i ? "0 2px 6px rgba(18,85,163,.3)" : "none",
              }}>
                {getRoleName(p.role_id)}
              </span>
            ))}
          </div>

          {/* 文本类自定义字段 */}
          {customFields.filter(f => f.type === "text" || !f.type).map((f, i) => (
            <div key={i} className="det-meta" style={{ marginTop: i > 0 ? 3 : 0 }}>
              {f.label && <span>{f.label}：</span>}<b>{f.value}</b>
            </div>
          ))}
        </div>
      </div>

      {/* 图片类自定义字段 */}
      {customFields.filter(f => f.type === "image").map((f, i) => (
        <div key={i} style={{ margin: "8px 16px" }}>
          {f.label && <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{f.label}</div>}
          <img src={f.value} style={{ width: "100%", borderRadius: 8 }} alt={f.label} onError={e => e.target.style.display = "none"} />
        </div>
      ))}

      {/* 公司信息 */}
      <div className="det-company">
        <div className="co-logo">
          {cur.company_logo ? <img src={cur.company_logo} alt="" /> : "🏢"}
        </div>
        <div className="co-name">{cur.company_name || "—"}</div>
      </div>

      {/* 企业介绍 */}
      {introBlocks.length > 0 && (
        <div className="det-intro">
          <div className="intro-sec-hd">
            <div className="sec-ic">📋</div>
            <div className="sec-title">企业介绍</div>
          </div>
          {introBlocks.map((b, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              {b.type === "text"  && <div className="intro-text">{b.value}</div>}
              {b.type === "video" && <video src={b.value} controls style={{ width: "100%", borderRadius: 8, background: "#0d1f4e" }} />}
              {b.type === "image" && <img src={b.value} style={{ width: "100%", borderRadius: 8 }} alt="" onError={e => e.target.style.display = "none"} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}