import { useState } from "react";
import { mkAv } from "../mockData";
import Confirm from "./Confirm";

export default function AdminsPage({ admins, currentAdmin, toast, api, loadAll }) {
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);

  const isSuperAdmin = currentAdmin.role === "superadmin";

  const save = async a => {
    if (!a.name.trim() || !a.username.trim()) return toast.error("姓名和用户名不能为空");
    if (!a.id && !a.password?.trim()) return toast.error("新增管理员必须设置密码");
    const body = { username: a.username, name: a.name, role: a.role, ...(a.password ? { password: a.password } : {}) };
    const r = a.id
      ? await api(`/api/admin/admins/${a.id}`, { method: "PUT",  body: JSON.stringify(body) })
      : await api("/api/admin/admins",          { method: "POST", body: JSON.stringify(body) });
    if (r.code === 0) { await loadAll(); setModal(null); toast.success("保存成功"); }
    else toast.error(r.msg || "操作失败");
  };

  const del = async id => {
    if (id === currentAdmin.id) { toast.error("不能删除当前登录的账号"); return; }
    const r = await api(`/api/admin/admins/${id}`, { method: "DELETE" });
    if (r.code === 0) { await loadAll(); setConfirm(null); toast.success("已删除"); }
    else toast.error(r.msg || "操作失败");
  };

  return (
    <div className="page-in">
      <div className="tbl-wrap">
        <div className="tbl-head">
          <div className="tbl-title">管理员账号</div>
          {isSuperAdmin && (
            <button className="btn btn-primary" onClick={() => setModal({ username: "", password: "", name: "", role: "editor" })}>
              ＋ 新增管理员
            </button>
          )}
        </div>
        <table>
          <thead><tr><th>管理员</th><th>用户名</th><th>角色</th><th>操作</th></tr></thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id}>
                <td>
                  <div className="td-name">
                    <img src={mkAv(a.name, 180)} className="td-av" style={{ borderRadius: "50%" }} alt="" />
                    <div className="td-nm">
                      {a.name}
                      {a.id === currentAdmin.id && <span style={{ fontSize: 11, color: "var(--accent)", marginLeft: 6 }}>(当前)</span>}
                    </div>
                  </div>
                </td>
                <td style={{ fontFamily: "monospace", color: "var(--blue3)" }}>{a.username}</td>
                <td>
                  <span className="badge-role" style={a.role === "superadmin" ? { background: "rgba(240,165,0,.15)", color: "var(--warn)", borderColor: "rgba(240,165,0,.25)" } : {}}>
                    {a.role === "superadmin" ? "超级管理员" : "内容管理员"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setModal({ ...a, password: "" })}>编辑</button>
                    {isSuperAdmin && a.id !== currentAdmin.id && (
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm(a)}>删除</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <div className="modal" style={{ width: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hd">
              <div className="modal-title">{modal.id ? "编辑管理员" : "新增管理员"}</div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="fg"><label className="fl">显示名称</label><input className="fi" value={modal.name} onChange={e => setModal(m => ({ ...m, name: e.target.value }))} placeholder="管理员姓名" /></div>
              <div className="frow">
                <div className="fg">
                  <label className="fl">用户名</label>
                  <input className="fi" value={modal.username} onChange={e => setModal(m => ({ ...m, username: e.target.value }))} placeholder="登录用户名" disabled={!!modal.id} />
                </div>
                <div className="fg">
                  <label className="fl">{modal.id ? "新密码（留空不修改）" : "密码"}</label>
                  <input className="fi" type="password" value={modal.password || ""} onChange={e => setModal(m => ({ ...m, password: e.target.value }))} placeholder={modal.id ? "留空则不修改密码" : "登录密码"} />
                </div>
              </div>
              <div className="fg">
                <label className="fl">角色权限</label>
                <select className="fse" value={modal.role} onChange={e => setModal(m => ({ ...m, role: e.target.value }))}>
                  <option value="superadmin">超级管理员（全部权限）</option>
                  <option value="editor">内容管理员（编辑权限）</option>
                </select>
              </div>
            </div>
            <div className="modal-ft">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>取消</button>
              <button className="btn btn-primary" onClick={() => save(modal)}>💾 保存</button>
            </div>
          </div>
        </div>
      )}

      {confirm && <Confirm title="删除管理员" msg={`确认删除管理员「${confirm.name}」？`} onConfirm={() => del(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
