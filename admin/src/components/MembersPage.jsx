import { useState } from "react";
import { mkAv } from "../mockData";
import Confirm from "./Confirm";
import MemberModal from "./MemberModal";

const PAGE_SIZE = 10;

export default function MembersPage({ members, roles, toast, api, loadAll, token, settings }) {
  const [search,     setSearch]     = useState("");
  const [filterRole, setFilterRole] = useState(0);
  const [page,       setPage]       = useState(1);
  const [modal,      setModal]      = useState(null);
  const [confirm,    setConfirm]    = useState(null);

  const roleMap = Object.fromEntries(roles.map(r => [r.id, r.name]));

  const filtered = members.filter(m =>
    (!search || m.name.includes(search) || (m.company || m.company_name || "").includes(search)) &&
    (!filterRole || m.roleId === filterRole || m.role_id === filterRole)
  );
  const total  = filtered.length;
  const pages  = Math.ceil(total / PAGE_SIZE);
  const sliced = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const save = async m => {
    const body = {
      name:      m.name,
      role_id:   m.role_id || m.roleId,
      photo:     m.photo || "",
      is_active: m.active ? 1 : 0,
      positions: (m.positions || []).map(p => ({
        role_id:       p.role_id,
        title:         p.title || "",
        address:       p.address || "",
        company_name:  p.company_name || "",
        company_logo:  p.company_logo || "",
        intro:         p.intro || "",
        video_url:     p.video_url || "",
        custom_fields: p.custom_fields || null,
        intro_blocks:  p.intro_blocks  || null,
      })),
    };
    const r = m.id
      ? await api(`/api/admin/members/${m.id}`, { method: "PUT",  body: JSON.stringify(body) })
      : await api("/api/admin/members",          { method: "POST", body: JSON.stringify(body) });
    if (r.code === 0) { await loadAll(); setModal(null); toast.success(m.id ? "修改成功" : "新增成功"); }
    else toast.error(r.msg || "操作失败");
  };

  const del = async id => {
    const r = await api(`/api/admin/members/${id}`, { method: "DELETE" });
    if (r.code === 0) { await loadAll(); setConfirm(null); toast.success("已删除"); }
    else toast.error(r.msg || "删除失败");
  };

  const toggle = async m => {
    const detail = await api(`/api/members/${m.id}`);
    const positions = detail.code === 0 && detail.data.positions?.length ? detail.data.positions : [];
    const body = { name: m.name, role_id: m.roleId || m.role_id, photo: m.photo || "", is_active: m.active ? 0 : 1, positions };
    const r = await api(`/api/admin/members/${m.id}`, { method: "PUT", body: JSON.stringify(body) });
    if (r.code === 0) { await loadAll(); toast.info(`已${m.active ? "停用" : "启用"}：${m.name}`); }
    else toast.error(r.msg || "操作失败");
  };

  const openEdit = async m => {
    const r = await api(`/api/members/${m.id}`);
    if (r.code === 0) {
      const d = r.data;
      const positions = (d.positions && d.positions.length > 0) ? d.positions : [{
        role_id: d.role_id, title: d.title || "", address: d.address || "",
        company_name: d.company_name || "", company_logo: d.company_logo || "",
        intro: d.intro || "", video_url: d.video_url || "",
      }];
      setModal({ ...m, ...d, active: !!d.is_active, positions });
    } else setModal({ ...m });
  };

  return (
    <div className="page-in">
      <div className="tbl-wrap">
        <div className="tbl-head">
          <div className="tbl-title">会员管理 <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 400 }}>({total}人)</span></div>
          <div className="tbl-actions">
            <select className="fi" style={{ width: 120, padding: "7px 10px" }} value={filterRole} onChange={e => { setFilterRole(+e.target.value); setPage(1); }}>
              <option value={0}>全部职务</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div className="search-box">
              <span style={{ color: "var(--text3)" }}>🔍</span>
              <input placeholder="搜索姓名或公司" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <button className="btn btn-primary" onClick={() => setModal({ name: "", roleId: roles[0]?.id || 1, title: "", address: "", company: "", companyLogo: "", intro: "", photo: "", active: true })}>
              ＋ 新增会员
            </button>
          </div>
        </div>
        <table>
          <thead><tr><th>姓名</th><th>职务</th><th>企业职位</th><th>公司</th><th>状态</th><th style={{ width: 160 }}>操作</th></tr></thead>
          <tbody>
            {sliced.length === 0 ? (
              <tr><td colSpan={6}><div className="empty"><div className="empty-icon">🔍</div><div className="empty-text">没有找到匹配的会员</div></div></td></tr>
            ) : sliced.map(m => (
              <tr key={m.id}>
                <td><div className="td-name"><img src={m.photo || mkAv(m.name)} className="td-av" alt="" /><div className="td-nm">{m.name}</div></div></td>
                <td><span className="badge-role">{roleMap[m.roleId] || roleMap[m.role_id]}</span></td>
                <td style={{ color: "var(--text2)" }}>{m.title}</td>
                <td style={{ color: "var(--text2)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.company || m.company_name}</td>
                <td><span className={`badge-role ${m.active ? "badge-on" : "badge-off"}`}>{m.active ? "启用" : "停用"}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm"   onClick={() => openEdit(m)}>编辑</button>
                    <button className="btn btn-warn btn-sm"    onClick={() => toggle(m)}>{m.active ? "停用" : "启用"}</button>
                    <button className="btn btn-danger btn-sm"  onClick={() => setConfirm(m)}>删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages > 1 && (
          <div className="pagination">
            <div className="page-info">共 {total} 条，第 {page}/{pages} 页</div>
            <div className="page-btns">
              <button className="pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`pg-btn${p === page ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="pg-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {modal   && <MemberModal m={modal} roles={roles} onSave={save} onClose={() => setModal(null)} token={token} settings={settings} />}
      {confirm && <Confirm title="确认删除" msg={`即将删除会员「${confirm.name}」，此操作不可恢复。`} onConfirm={() => del(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}