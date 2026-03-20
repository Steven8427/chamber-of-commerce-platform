import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";

export default function SettingsPage({ settings, setSettings, toast, api, token }) {
  const [form, setForm] = useState({ ...settings });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { setForm({ ...settings }); }, [settings]);

  const save = async () => {
    const r = await api("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({
        orgName: form.orgName, orgSubtitle: form.orgSubtitle, orgLogo: form.orgLogo,
        fieldTitle: form.fieldTitle, fieldAddress: form.fieldAddress,
      }),
    });
    if (r.code === 0) { setSettings(form); toast.success("设置已保存 ✓"); }
    else toast.error(r.msg || "保存失败");
  };

  return (
    <div className="page-in">
      <div className="tbl-wrap" style={{ marginBottom: 16 }}>
        <div className="tbl-head"><div className="tbl-title">前台展示设置</div></div>
        <div style={{ padding: 24 }}>

          {/* Logo 预览 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12, fontWeight: 500 }}>Logo 预览</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--navy)", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)", width: "fit-content" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0d3a8e,#2575e8)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 2px 8px rgba(18,85,163,.4)", flexShrink: 0 }}>
                {form.orgLogo ? (
                  <img src={form.orgLogo} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} onError={e => e.target.style.display = "none"} alt="logo" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
                    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ color: "var(--text1)", fontSize: 14, fontWeight: 600 }}>{form.orgName || "商会名称"}</span>
            </div>
          </div>

          <div className="frow">
            <div className="fg"><label className="fl">商会名称</label><input className="fi" value={form.orgName || ""} onChange={e => s("orgName", e.target.value)} placeholder="如：开封市示范区城西商会" /></div>
            <div className="fg"><label className="fl">副标题</label><input className="fi" value={form.orgSubtitle || ""} onChange={e => s("orgSubtitle", e.target.value)} placeholder="如：诚挚邀请" /></div>
          </div>

          <ImageUploader label="Logo 图片" value={form.orgLogo || ""} onChange={v => s("orgLogo", v)} token={token} />

          <div style={{ marginTop: 8 }}>
            <button className="btn btn-primary" style={{ padding: "11px 32px", fontSize: 14 }} onClick={save}>💾 保存设置</button>
          </div>
        </div>
      </div>

      <div className="tbl-wrap">
        <div className="tbl-head"><div className="tbl-title">前台访问地址</div></div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--navy3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ fontSize: 20 }}>📱</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)" }}>手机端展示页</div>
              <div style={{ fontSize: 12, color: "var(--blue3)", marginTop: 3 }}>http://192.168.0.110:5173</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 10 }}>修改设置后，前台页面刷新即可看到最新效果</div>
        </div>
      </div>
    </div>
  );
}