import Banner from "./banner";
import { mkPhoto } from "../utils";

export default function ListPage({ banners, roles, members, onSelect }) {
  const grouped = [...roles]
    .sort((a, b) => (a.order || a.sort_order || 0) - (b.order || b.sort_order || 0))
    .map(r => ({ role: r, items: members.filter(m => m.roleId === r.id) }))
    .filter(g => g.items.length > 0);

  return (
    <div className="scroll">
      <Banner banners={banners} />

      <div className="sec-wrap">
        <div className="sec-hd">
          <div className="sec-ic">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="7" r="3" stroke="white" strokeWidth="1.6"/>
              <path d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="17" cy="8" r="2.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
              <path d="M21 20c0-2.761-1.791-5-4-5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="sec-title">会员风采</div>
        </div>

        {grouped.map(({ role, items }) => (
          <div key={role.id} className="role-row">
            <div className="role-label">{role.name}：</div>
            <div className="members-grid">
              {items.map(m => (
                <div key={m.id} className="member-card" onClick={() => onSelect(m)}>
                  <img src={m.photo || mkPhoto(m.name)} className="m-photo" alt={m.name} />
                  <div className="m-name">{m.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-pad" />
    </div>
  );
}