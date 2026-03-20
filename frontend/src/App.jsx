import { useState, useEffect } from "react";
import { API } from "./api";
import { DEFAULT_SETTINGS, INIT_BANNERS, INIT_ROLES, INIT_MEMBERS } from "./mockData";
import styles from "./styles";
import ListPage   from "./components/ListPage";
import DetailPage from "./components/DetailPage";

export default function App() {
  const [detail,   setDetail]   = useState(null);
  const [banners,  setBanners]  = useState([]);
  const [roles,    setRoles]    = useState([]);
  const [members,  setMembers]  = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading,  setLoading]  = useState(true);

  const { orgName, orgLogo } = settings;

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = styles;
    document.head.appendChild(el);

    let vp = document.querySelector('meta[name="viewport"]');
    if (!vp) { vp = document.createElement("meta"); vp.name = "viewport"; document.head.appendChild(vp); }
    vp.content = "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover";

    Promise.all([
      fetch(`${API}/api/banners`).then(r => r.json()),
      fetch(`${API}/api/roles`).then(r => r.json()),
      fetch(`${API}/api/members`).then(r => r.json()),
      fetch(`${API}/api/settings`).then(r => r.json()),
    ]).then(([b, r, m, s]) => {
      if (b.code === 0) setBanners(b.data);
      if (r.code === 0) setRoles(r.data.map(x => ({ ...x, order: x.sort_order })));
      if (m.code === 0) setMembers(m.data.map(x => ({
        ...x, roleId: x.role_id,
        company: x.company_name || "", companyLogo: x.company_logo || "",
      })));
      if (s.code === 0 && s.data) setSettings(prev => ({ ...prev, ...s.data }));
      setLoading(false);
    }).catch(() => {
      setBanners(INIT_BANNERS); setRoles(INIT_ROLES); setMembers(INIT_MEMBERS);
      setLoading(false);
    });

    return () => document.head.removeChild(el);
  }, []);

  if (loading) return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f7fb" }}>
      <div style={{ textAlign: "center", color: "#6b84a3" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🏛</div>
        <div style={{ fontSize: 14 }}>加载中...</div>
      </div>
    </div>
  );

  return (
    <div className="shell">
      <div className="org-bar">
        <div className="org-icon">
          {orgLogo ? <img src={orgLogo} alt="logo" /> : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"
                stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div className="org-name">{orgName}</div>
      </div>
      {detail ? (
        <DetailPage member={detail} roles={roles} onBack={() => setDetail(null)} settings={settings} />
      ) : (
        <ListPage banners={banners} roles={roles} members={members} onSelect={m => setDetail(m)} />
      )}
    </div>
  );
}