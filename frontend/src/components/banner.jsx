import { useState, useEffect, useRef } from "react";

export default function Banner({ banners }) {
  const [idx, setIdx] = useState(0);
  const touchX = useRef(null);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % banners.length), 3800);
    return () => clearInterval(t);
  }, [banners.length]);

  const prev = () => setIdx(i => (i - 1 + banners.length) % banners.length);
  const next = () => setIdx(i => (i + 1) % banners.length);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchX.current = null;
  };

  return (
    <div className="banner" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`bn-slide${i === idx ? " on" : ""}`}
          style={{ background: `linear-gradient(160deg, ${b.bg || "#0d1f4e"} 0%, ${b.bg || "#0d1f4e"}dd 100%)` }}
        >
          {b.image_url && (
            <img src={b.image_url} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
          )}
          {b.video_url && !b.image_url && (
            <video src={b.video_url} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
          )}
          {!b.image_url && !b.video_url && (
            <>
              <div className="bn-circuit" />
              <div className="bn-grid" />
              <div className="bn-glow" />
            </>
          )}
          {(b.text || b.sub) && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
              ...(b.image_url || b.video_url ? { background: "rgba(0,0,0,.35)" } : {})
            }}>
              {!b.image_url && !b.video_url && <div className="bn-label">TECHNOLOGY CREATES THE FUTURE</div>}
              {b.text && <div className="bn-title">{b.text}</div>}
              {b.sub  && <div className="bn-badge">{b.sub}</div>}
            </div>
          )}
        </div>
      ))}
      <div className="bn-dots">
        {banners.map((_, i) => (
          <div key={i} className={`bdot${i === idx ? " on" : ""}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  );
}