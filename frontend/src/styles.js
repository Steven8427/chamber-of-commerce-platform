const styles = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{height:100%;background:#c8d4e0}
:root{
  --blue-dark:#0d1f4e;
  --blue-mid:#1255a3;
  --blue-light:#3a8fe8;
  --blue-pale:#dde9f8;
  --text-main:#0d1f3c;
  --text-sub:#6b84a3;
  --border:#d4e3f5;
  --bg:#eef2f8;
  --white:#ffffff;
}
body{font-family:'Noto Sans SC',sans-serif;color:var(--text-main)}
::-webkit-scrollbar{display:none}

.shell{
  position:fixed;inset:0;
  width:100%;max-width:100%;
  background:var(--white);
  display:flex;flex-direction:column;
  overflow:hidden;
}
@media(min-width:600px){
  .shell{
    max-width:390px;
    left:50%;right:auto;
    transform:translateX(-50%);
    box-shadow:0 0 40px rgba(0,0,0,.25);
  }
}
.org-bar{
  background:var(--white);
  padding:10px 14px;
  display:flex;align-items:center;gap:8px;
  border-bottom:1px solid #e8eef8;
  flex-shrink:0;
}
.org-icon{
  width:32px;height:32px;border-radius:8px;
  background:linear-gradient(135deg,#0d3a8e,#2575e8);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  box-shadow:0 2px 8px rgba(18,85,163,.35);
  overflow:hidden;
}
.org-icon img{width:100%;height:100%;object-fit:cover;border-radius:8px}
.org-icon svg{width:20px;height:20px}
.org-name{
  font-family:'Noto Serif SC',serif;
  font-size:14px;font-weight:600;
  color:var(--text-main);letter-spacing:.5px;
}
.scroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#f4f7fb}

/* Banner */
.banner{position:relative;height:176px;overflow:hidden;background:var(--blue-dark);}
.bn-slide{
  position:absolute;inset:0;overflow:hidden;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  opacity:0;transition:opacity .8s;padding:16px;
}
.bn-slide.on{opacity:1}
.bn-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(120,170,255,.08) 1px,transparent 1px),
    linear-gradient(90deg,rgba(120,170,255,.08) 1px,transparent 1px);
  background-size:32px 32px;
}
.bn-glow{
  position:absolute;inset:0;
  background:
    radial-gradient(ellipse at 25% 55%,rgba(58,143,232,.18),transparent 55%),
    radial-gradient(ellipse at 78% 25%,rgba(18,85,163,.22),transparent 50%);
}
.bn-circuit{
  position:absolute;top:0;right:0;width:130px;height:130px;opacity:.08;
  background-image:
    repeating-linear-gradient(0deg,#64b5f6 0,#64b5f6 1px,transparent 0,transparent 18px),
    repeating-linear-gradient(90deg,#64b5f6 0,#64b5f6 1px,transparent 0,transparent 18px);
}
.bn-label{font-size:10px;color:rgba(255,255,255,.5);letter-spacing:3px;position:relative;z-index:2;margin-bottom:8px;}
.bn-title{
  font-family:'Noto Serif SC',serif;
  font-size:26px;font-weight:700;color:#fff;
  letter-spacing:4px;position:relative;z-index:2;
  text-shadow:0 0 32px rgba(58,143,232,.6),0 2px 6px rgba(0,0,0,.3);
}
.bn-badge{
  position:relative;z-index:2;margin-top:14px;
  border:1px solid rgba(255,255,255,.2);border-radius:20px;
  padding:5px 18px;font-size:12px;
  color:rgba(255,255,255,.82);background:rgba(255,255,255,.06);letter-spacing:.5px;
}
.bn-dots{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:5px;z-index:3;}
.bdot{width:5px;height:5px;border-radius:3px;background:rgba(255,255,255,.28);cursor:pointer;transition:.35s}
.bdot.on{width:18px;background:#5ab4ff}

/* Section */
.sec-wrap{background:var(--white);border-radius:10px;margin:10px 10px 10px;overflow:hidden;box-shadow:0 1px 8px rgba(13,31,78,.06);}
.sec-hd{background:linear-gradient(90deg,#ddeaf8 0%,#eaf3ff 100%);padding:10px 14px;display:flex;align-items:center;gap:8px;}
.sec-ic{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#1255a3,#3a8fe8);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(18,85,163,.3);}
.sec-ic svg{width:17px;height:17px}
.sec-title{font-family:'Noto Serif SC',serif;font-size:15px;font-weight:700;color:#0a2264;}
.role-row{display:flex;align-items:flex-start;padding:12px 10px 12px 12px;}
.role-row:last-child{padding-bottom:16px}
.role-label{width:76px;min-width:76px;max-width:76px;font-size:12px;font-weight:500;color:var(--text-sub);padding-top:9px;padding-right:6px;flex-shrink:0;white-space:nowrap;text-align:right;}
.members-grid{display:grid;grid-template-columns:repeat(4,64px);grid-auto-rows:auto;gap:8px;align-items:start;justify-content:start;margin-left:8px;}
.member-card{display:flex;flex-direction:column;align-items:center;cursor:pointer;width:64px;}
.member-card:active .m-photo{transform:scale(.93)}
.m-photo{width:64px;height:80px;border-radius:6px;object-fit:cover;border:1.5px solid #c8ddf5;transition:transform .15s;background:#1a3060;display:block;}
.m-name{font-size:10px;color:var(--text-sub);margin-top:4px;text-align:center;width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* Detail page */
.det-page{position:absolute;inset:0;background:#f0f4fa;overflow-y:auto;-webkit-overflow-scrolling:touch;animation:slideIn .28s ease;}
@keyframes slideIn{from{transform:translateX(100%);opacity:.5}to{transform:translateX(0);opacity:1}}
.det-header{background:linear-gradient(135deg,#0a1628 0%,#1a3a6e 100%);padding:14px 16px;display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:10;}
.det-back{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.12);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.det-header-title{font-family:'Noto Serif SC',serif;font-size:16px;font-weight:700;color:#fff;flex:1;text-align:center;}
.det-profile{background:#fff;border-radius:14px;margin:12px 12px 10px;padding:18px;display:flex;gap:16px;box-shadow:0 2px 12px rgba(13,31,78,.08);}
.det-avatar{width:108px;height:136px;border-radius:10px;object-fit:cover;flex-shrink:0;border:3px solid #c8ddf5;background:#1a3060;}
.det-info{flex:1;min-width:0}
.det-name{font-family:'Noto Serif SC',serif;font-size:24px;font-weight:700;color:var(--text-main);}
.det-role-badge{display:inline-block;background:linear-gradient(135deg,var(--blue-mid),var(--blue-light));color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;margin:8px 0 12px;}
.det-meta{font-size:13px;color:var(--text-sub);line-height:2.1;display:flex;gap:3px;flex-wrap:wrap;}
.det-meta b{color:var(--text-main);font-weight:500}
.det-company{background:#fff;border-radius:14px;margin:0 12px 10px;padding:16px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 12px rgba(13,31,78,.08);}
.co-logo{width:52px;height:52px;border-radius:10px;background:#eef3fa;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;overflow:hidden;}
.co-logo img{width:100%;height:100%;object-fit:contain}
.co-name{font-size:16px;font-weight:700;color:var(--text-main)}
.det-intro{background:#fff;border-radius:14px;margin:0 12px 16px;overflow:hidden;box-shadow:0 2px 12px rgba(13,31,78,.08);}
.intro-sec-hd{background:linear-gradient(90deg,#deeaf8,#edf4ff);padding:11px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #d0e4f8;}
.video-thumb{width:100%;aspect-ratio:16/9;position:relative;overflow:hidden;background:linear-gradient(135deg,#0d1f4e,#1a3a8e);display:flex;align-items:center;justify-content:center;cursor:pointer;}
.video-bg-content{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;}
.video-main-text{font-family:'Noto Serif SC',serif;font-size:24px;color:rgba(255,255,255,.85);letter-spacing:2px;}
.video-sub-text{font-size:11px;color:rgba(255,255,255,.45);letter-spacing:3px}
.video-play{position:relative;z-index:2;width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.38);display:flex;align-items:center;justify-content:center;font-size:17px;color:#fff;backdrop-filter:blur(4px);transition:transform .2s;}
.video-thumb:active .video-play{transform:scale(.88)}
.intro-text{padding:16px;font-size:14px;line-height:1.95;color:#4a5e78;}
.bottom-pad{height:24px}
`;

export default styles;