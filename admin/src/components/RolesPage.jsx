import { useState } from "react";
import Confirm from "./Confirm";

export default function RolesPage({ roles, members, toast, api, loadAll }) {
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);

  const sorted = [...roles].sort((a, b) => (a.sort_order || a.order || 0) - (b.sort_order || b.order || 0));

  const save = async r => {
    const body = { name: r.name, sort_order: r.sort_order || r.order || 0 };
    const res = r.id
      ? await api(`/api/admin/roles/${r.id}`, { method: "PUT",  body: JSON.stringify(body) })
      : await api("/api/admin/roles",          { method: "POST", body: JSON.stringify(body) });
    if (res.code === 0) { await loadAll(); setModal(null); toast.success("保存成功"); }
    else toast.error(res.msg || "失败");
  };

  const del = async id => {
    const res = await api(`/api/admin/roles/${id}`, { method: "DELETE" });
    if (res.code === 0) { await loadAll(); setConfirm(null); toast.success("已删除"); }
    else toast.error("该职务下还有会员，请先移除会员");
  };

  const move = async (idx, dir) => {
    const list = [...sorted];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    [list[idx], list[swapIdx]] = [list[swapIdx], list[idx]];
    await Promise.all(list.map((r, i) =>
      api(`/api/admin/roles/${r.id}`, { method: "PUT", body: JSON.stringify({ name: r.name, sort_order: i + 1 }) })
    ));
    await loadAll();
    toast.info("顺序已更新");
  };

  return (
    <div className="page-in">
      <div className="tbl-wrap">
        <div className="tbl-head">
          <div className="tbl-title">职务管理 <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 400 }}>（点箭头调整顺序）</span></div>
          <button className="btn btn-primary" onClick={() => setModal({ name: "", sort_order: sorted.length + 1 })}>＋ 新增职务</button>
        </div>
        <table>
          <thead><tr><th style={{ width: 90 }}>排序</th><th>职务名称</th><th>会员人数</th><th>操作</th></tr></thead>
          <tbody>
            {sorted.map((r, idx) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" style={{ height: 24, width: 24, fontSize: 12, opacity: idx === 0 ? .25 : 1 }} disabled={idx === 0} onClick={() => move(idx, -1)}>▲</button>
                      <button className="btn btn-ghost btn-sm btn-icon" style={{ height: 24, width: 24, fontSize: 12, opacity: idx === sorted.length - 1 ? .25 : 1 }} disabled={idx === sorted.length - 1} onClick={() => move(idx, 1)}>▼</button>
                    </div>
                    <span style={{ fontSize: 13, color: "var(--text3)", minWidth: 16, textAlign: "center" }}>{idx + 1}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</td>
                <td><span className="badge-role">{members.filter(m => m.roleId === r.id || m.role_id === r.id).length} 人</span></td>
                <td><div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setModal({ ...r })}>编辑</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirm(r)}>删除</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <div className="modal" style={{ width: 360 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hd">
              <div className="modal-title">{modal.id ? "编辑职务" : "新增职务"}</div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="fg"><label className="fl">职务名称</label><input className="fi" value={modal.name} onChange={e => setModal(m => ({ ...m, name: e.target.value }))} placeholder="如：名誉会长、荣誉顾问…" /></div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>顺序可在列表里用箭头调整，无需填数字</div>
            </div>
            <div className="modal-ft">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>取消</button>
              <button className="btn btn-primary" onClick={() => save(modal)}>💾 保存</button>
            </div>
          </div>
        </div>
      )}

      {confirm && <Confirm title="删除职务" msg={`确认删除职务「${confirm.name}」？`} onConfirm={() => del(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
