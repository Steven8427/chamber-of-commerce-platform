import { useState, useEffect } from "react";
import { API } from "./api";
import { mkAv, MOCK_SETTINGS } from "./mockData";
import styles from "./styles";
import { useToast, ToastContainer } from "./hooks/useToast.jsx";

import LoginPage    from "./components/LoginPage";
import Dashboard    from "./components/Dashboard";
import MembersPage  from "./components/MembersPage";
import BannersPage  from "./components/BannersPage";
import RolesPage    from "./components/RolesPage";
import AdminsPage   from "./components/AdminsPage";
import SettingsPage from "./components/SettingsPage";

const NAV_ITEMS = [
  { key: "dashboard", icon: "📊", label: "数据概览" },
  { key: "members",   icon: "👥", label: "会员管理" },
  { key: "banners",   icon: "🖼",  label: "轮播广告" },
  { key: "roles",     icon: "🏷",  label: "职务管理" },
  { key: "admins",    icon: "🔐", label: "管理员账号" },
  { key: "settings",  icon: "⚙️",  label: "网站设置" },
];

const PAGE_TITLES = {
  dashboard: "数据概览", members: "会员管理", banners: "轮播广告",
  roles: "职务管理", admins: "管理员账号", settings: "网站设置",
};

export default function App() {
  // ── 持久化登录 ──────────────────────────────────────────
  const savedToken = localStorage.getItem("admin_token");
  const savedAdmin = (() => { try { return JSON.parse(localStorage.getItem("admin_info")); } catch { return null; } })();

  const [currentAdmin, setCurrentAdmin] = useState(savedAdmin);
  const [token,        setToken]        = useState(savedToken || "");
  const [page,         setPage]         = useState("dashboard");
  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  // ── 数据 ────────────────────────────────────────────────
  const [admins,   setAdmins]   = useState([]);
  const [members,  setMembers]  = useState([]);
  const [roles,    setRoles]    = useState([]);
  const [banners,  setBanners]  = useState([]);
  const [settings, setSettings] = useState(MOCK_SETTINGS);

  const toast = useToast();

  // ── 带 token 的请求封装 ──────────────────────────────────
  const api = async (path, options = {}) => {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, ...options.headers },
    });
    return res.json();
  };

  // ── 加载所有数据 ─────────────────────────────────────────
  const loadAll = async (tk) => {
    const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${tk}` };
    const [r1, r2, r3, r4, r5] = await Promise.all([
      fetch(`${API}/api/roles`).then(r => r.json()),
      fetch(`${API}/api/admin/banners`, { headers }).then(r => r.json()),
      fetch(`${API}/api/admin/members`, { headers }).then(r => r.json()),
      fetch(`${API}/api/admin/admins`,  { headers }).then(r => r.json()),
      fetch(`${API}/api/settings`).then(r => r.json()),
    ]);
    if (r1.code === 0) setRoles(r1.data);
    if (r2.code === 0) setBanners(r2.data);
    if (r3.code === 0) setMembers(r3.data.map(m => ({ ...m, roleId: m.role_id, company: m.company_name, companyLogo: m.company_logo, active: !!m.is_active })));
    if (r4.code === 0) setAdmins(r4.data);
    if (r5.code === 0 && r5.data) setSettings(s => ({ ...s, ...r5.data }));
  };

  // ── 登录 / 登出 ──────────────────────────────────────────
  const handleLogin = async (admin, tk) => {
    setCurrentAdmin(admin);
    setToken(tk);
    localStorage.setItem("admin_token", tk);
    localStorage.setItem("admin_info", JSON.stringify(admin));
    await loadAll(tk);
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    setToken("");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");
  };

  // ── 初始化 ───────────────────────────────────────────────
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = styles;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    if (savedToken && savedAdmin) loadAll(savedToken);
  }, []);

  // ── 登录页 ───────────────────────────────────────────────
  if (!currentAdmin) return (
    <>
      <ToastContainer toasts={toast.toasts} />
      <LoginPage onLogin={handleLogin} />
    </>
  );

  // ── 主界面 ───────────────────────────────────────────────
  return (
    <>
      <ToastContainer toasts={toast.toasts} />
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 49 }} />}

      <div className="layout">
        {/* ── 侧边栏 ── */}
        <aside className={`sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}>
          <div className="sb-logo">
            <div className="sb-logo-mark">会</div>
            {!collapsed && (
              <div>
                <div className="sb-logo-text">{settings.orgName ? settings.orgName.slice(0, 4) : "城西商会"}</div>
                <div className="sb-logo-sub">后台管理系统</div>
              </div>
            )}
          </div>
          <nav className="sb-nav">
            {!collapsed && <div className="sb-section">主菜单</div>}
            {NAV_ITEMS.map(n => (
              <button key={n.key} className={`sb-item${page === n.key ? " active" : ""}`} onClick={() => { setPage(n.key); setMobileOpen(false); }}>
                <span className="ic">{n.icon}</span>
                {!collapsed && <span>{n.label}</span>}
                {!collapsed && n.key === "members" && <span className="badge">{members.filter(m => m.active).length}</span>}
              </button>
            ))}
          </nav>
          <div className="sb-bottom">
            {!collapsed && (
              <div className="sb-user" onClick={handleLogout} title="点击退出登录">
                <img src={mkAv(currentAdmin.name, 180)} className="sb-avatar" alt="" />
                <div>
                  <div className="sb-uname">{currentAdmin.name}</div>
                  <div className="sb-urole">{currentAdmin.role === "superadmin" ? "超级管理员" : "内容管理员"}</div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── 主内容区 ── */}
        <main className="main">
          <div className="topbar">
            <button className="tb-toggle" onClick={() => { if (window.innerWidth <= 768) setMobileOpen(o => !o); else setCollapsed(c => !c); }}>☰</button>
            <div className="tb-title">{PAGE_TITLES[page]}</div>
            <div className="tb-right">
              <span style={{ fontSize: 13, color: "var(--text2)" }}>你好，{currentAdmin.name}</span>
              <button className="btn tb-logout" onClick={handleLogout}>退出登录</button>
            </div>
          </div>
          <div className="content">
            {page === "dashboard" && <Dashboard  members={members} roles={roles} banners={banners} />}
            {page === "members"   && <MembersPage members={members} roles={roles} toast={toast} api={api} loadAll={() => loadAll(token)} token={token} settings={settings} />}
            {page === "banners"   && <BannersPage banners={banners} toast={toast} api={api} loadAll={() => loadAll(token)} token={token} />}
            {page === "roles"     && <RolesPage   roles={roles} members={members} toast={toast} api={api} loadAll={() => loadAll(token)} />}
            {page === "admins"    && <AdminsPage  admins={admins} currentAdmin={currentAdmin} toast={toast} api={api} loadAll={() => loadAll(token)} />}
            {page === "settings"  && <SettingsPage settings={settings} setSettings={setSettings} toast={toast} api={api} token={token} />}
          </div>
        </main>
      </div>
    </>
  );
}