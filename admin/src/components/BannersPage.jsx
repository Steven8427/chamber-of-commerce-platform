import { useState } from "react";
import Confirm from "./Confirm";
import ImageUploader from "./ImageUploader";

export default function BannersPage({ banners, toast, api, loadAll, token }) {
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);

  const save = async b => {
    const body = { text: b.text || "", sub: b.sub || "", bg: b.bg || "#0d1f4e", image_url: b.image_url || "", video_url: b.video_url || "", sort_order: b.sort_order || 0, is_active: b.active ? 1 : 0 };
    const r = b.id
      ? await api(`/api/admin/banners/${b.id}`, { method: "PUT",  body: JSON.stringify(body) })
      : await api("/api/admin/banners",          { method: "POST", body: JSON.stringify(body) });
    if (r.code === 0) { await loadAll(); setModal(null); toast.success("保存成功"); }
    else toast.error(r.msg || "失败");
  };

  const del = async id => {
    const r = await api(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (r.code === 0) { await loadAll(); setConfirm(null); toast.success("已删除"); }
    else toast.error(r.msg || "失败");
  };

  return (
    <div className="page-in">
      <div className="tbl-wrap">
        <div className="tbl-head">
          <div className="tbl-title">轮播广告管理 <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 400 }}>({banners.length}条)</span></div>
          <button className="btn btn-primary" onClick={() => setModal({ text: "", sub: "", bg: "#0d1f4e", image_url: "", video_url: "", active: true })}>＋ 新增</button>
        </div>
        <table>
          <thead><tr><th>预览</th><th>主标题</th><th>副标题</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {banners.map(b => (
              <tr key={b.id}>
                <td>
                  <div style={{ width: 100, height: 56, borderRadius: 8, overflow: "hidden", background: `linear-gradient(135deg,${b.bg || "#0d1f4e"},${b.bg || "#0d1f4e"}99)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {b.image_url ? <img src={b.image_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> :
                     b.video_url ? <span style={{ color: "#fff", fontSize: 20 }}>🎬</span> :
                     <span style={{ color: "rgba(255,255,255,.7)", fontSize: 11, fontFamily: "'Noto Serif SC',serif" }}>{(b.text || "").slice(0, 5)}</span>}
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{b.text || <span style={{ color: "var(--text3)" }}>（无文字）</span>}</td>
                <td style={{ color: "var(--text2)" }}>{b.sub}</td>
                <td><span className={`badge-role ${(b.active || b.is_active) ? "badge-on" : "badge-off"}`}>{(b.active || b.is_active) ? "启用" : "停用"}</span></td>
                <td><div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setModal({ ...b, active: !!(b.active || b.is_active) })}>编辑</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirm(b)}>删除</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <div className="modal" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hd">
              <div className="modal-title">{modal.id ? "编辑轮播图" : "新增轮播图"}</div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ overflowY: "auto", maxHeight: "70vh" }}>
              {/* 预览 */}
              <div style={{ height: 72, borderRadius: 10, background: `linear-gradient(135deg,${modal.bg || "#0d1f4e"},${modal.bg || "#0d1f4e"}88)`, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {modal.image_url
                  ? <img src={modal.image_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  : <span style={{ color: "rgba(255,255,255,.8)", fontFamily: "'Noto Serif SC',serif", fontSize: 16 }}>{modal.text || "预览"}</span>}
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--blue3)", marginBottom: 10 }}>背景内容（三选一）</div>
              <ImageUploader label="背景图片（推荐）" value={modal.image_url || ""} onChange={v => setModal(m => ({ ...m, image_url: v }))} token={token} />
              <div className="fg">
                <label className="fl">视频 URL（可选）</label>
                <input className="fi" value={modal.video_url || ""} onChange={e => setModal(m => ({ ...m, video_url: e.target.value }))} placeholder="http://192.168.0.110:3000/uploads/xxx.mp4" />
              </div>
              <div className="fg">
                <label className="fl">纯色背景（无图片时使用）</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="color" value={modal.bg || "#0d1f4e"} onChange={e => setModal(m => ({ ...m, bg: e.target.value }))} style={{ width: 40, height: 34, borderRadius: 6, border: "none", cursor: "pointer", padding: 2 }} />
                  <input className="fi" style={{ flex: 1 }} value={modal.bg || "#0d1f4e"} onChange={e => setModal(m => ({ ...m, bg: e.target.value }))} placeholder="#0d1f4e" />
                </div>
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--blue3)", margin: "12px 0 10px" }}>文字内容（可选）</div>
              <div className="fg"><label className="fl">主标题</label><input className="fi" value={modal.text || ""} onChange={e => setModal(m => ({ ...m, text: e.target.value }))} placeholder="科技赋能共创未来" /></div>
              <div className="fg"><label className="fl">副标题</label><input className="fi" value={modal.sub || ""} onChange={e => setModal(m => ({ ...m, sub: e.target.value }))} placeholder="副标题文字" /></div>
              <div className="toggle-row"><span style={{ fontSize: 13 }}>是否启用</span><label className="toggle"><input type="checkbox" checked={!!modal.active} onChange={e => setModal(m => ({ ...m, active: e.target.checked }))} /><span className="toggle-slider" /></label></div>
            </div>
            <div className="modal-ft">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>取消</button>
              <button className="btn btn-primary" onClick={() => save(modal)}>💾 保存</button>
            </div>
          </div>
        </div>
      )}

      {confirm && <Confirm title="删除轮播图" msg="确认删除这条轮播图？" onConfirm={() => del(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
