import { mkAv } from "../mockData";

export default function Dashboard({ members, roles, banners }) {
  const roleMap = Object.fromEntries(roles.map(r => [r.id, r.name]));
  const stats = [
    { label: "总会员数", num: members.length,  icon: "👥", color: "rgba(26,111,212,.2)" },
    { label: "轮播广告", num: banners.length,   icon: "🖼",  color: "rgba(0,201,167,.15)" },
    { label: "职务分类", num: roles.length,     icon: "🏷",  color: "rgba(240,165,0,.15)" },
    { label: "启用会员", num: members.filter(m => m.active).length, icon: "📈", color: "rgba(90,174,255,.15)" },
  ];
  const recent = [...members].reverse().slice(0, 5);

  return (
    <div className="page-in">
      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div><div className="stat-num">{s.num}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="tbl-wrap">
        <div className="tbl-head"><div className="tbl-title">最近添加的会员</div></div>
        <table>
          <thead><tr><th>姓名</th><th>职务</th><th>公司</th><th>状态</th></tr></thead>
          <tbody>
            {recent.map(m => (
              <tr key={m.id}>
                <td><div className="td-name"><img src={m.photo || mkAv(m.name)} className="td-av" alt="" /><div className="td-nm">{m.name}</div></div></td>
                <td><span className="badge-role">{roleMap[m.roleId] || roleMap[m.role_id]}</span></td>
                <td style={{ color: "var(--text2)" }}>{m.company || m.company_name}</td>
                <td><span className={`badge-role ${m.active ? "badge-on" : "badge-off"}`}>{m.active ? "启用" : "停用"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
