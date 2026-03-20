const styles = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#0f1923;font-family:'Noto Sans SC',sans-serif;margin:0;padding:0}
:root{
  --navy:#0f1923; --navy2:#162130; --navy3:#1d2d3f;
  --blue:#1a6fd4; --blue2:#2484f0; --blue3:#5aaeff;
  --accent:#00c9a7; --warn:#f0a500; --danger:#e05555;
  --text1:#e8f0f8; --text2:#8ba5c0; --text3:#4e6680;
  --border:#1e3045; --card:#162130;
  --sidebar-w:240px;
}
body{color:var(--text1)}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}

/* ── Layout ── */
.layout{display:flex;height:100vh;overflow:hidden;width:100vw}
@media(max-width:768px){
  .sidebar{position:fixed;top:0;left:0;height:100vh;z-index:50;transform:translateX(-100%);transition:transform .25s}
  .sidebar.mobile-open{transform:translateX(0)}
  .sidebar.collapsed{width:var(--sidebar-w);transform:translateX(-100%)}
  .main{width:100vw}
  .topbar{padding:0 12px}
  .content{padding:16px 12px}
}
.sidebar{width:var(--sidebar-w);background:var(--navy2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;transition:width .25s}
.sidebar.collapsed{width:60px}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--navy)}
.topbar{height:60px;background:var(--navy2);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 24px;gap:16px;flex-shrink:0}
.content{flex:1;overflow-y:auto;padding:28px}

/* ── Sidebar ── */
.sb-logo{padding:20px 16px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;overflow:hidden}
.sb-logo-mark{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--blue),var(--accent));display:flex;align-items:center;justify-content:center;font-family:'Noto Serif SC',serif;font-size:16px;font-weight:700;color:#fff;flex-shrink:0}
.sb-logo-text{font-family:'Noto Serif SC',serif;font-size:14px;font-weight:700;color:var(--text1);white-space:nowrap;overflow:hidden}
.sb-logo-sub{font-size:11px;color:var(--text2);white-space:nowrap;overflow:hidden;margin-top:2px}
.sb-nav{flex:1;padding:12px 8px;overflow-y:auto}
.sb-section{font-size:10px;color:var(--text3);letter-spacing:1.5px;padding:8px 8px 4px;text-transform:uppercase}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;cursor:pointer;transition:.15s;color:var(--text2);font-size:14px;white-space:nowrap;overflow:hidden;border:none;background:none;width:100%;font-family:inherit;text-align:left}
.sb-item:hover{background:var(--navy3);color:var(--text1)}
.sb-item.active{background:linear-gradient(90deg,rgba(26,111,212,.25),rgba(26,111,212,.1));color:var(--blue3);border-left:3px solid var(--blue)}
.sb-item .ic{width:18px;text-align:center;flex-shrink:0;font-size:16px}
.sb-item .badge{margin-left:auto;background:var(--blue);color:#fff;font-size:10px;padding:1px 7px;border-radius:10px;flex-shrink:0}
.sb-bottom{padding:12px 8px;border-top:1px solid var(--border)}
.sb-user{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:.15s;overflow:hidden}
.sb-user:hover{background:var(--navy3)}
.sb-avatar{width:32px;height:32px;border-radius:50%;flex-shrink:0;object-fit:cover}
.sb-uname{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden}
.sb-urole{font-size:11px;color:var(--text2);white-space:nowrap}

/* ── Topbar ── */
.tb-toggle{width:32px;height:32px;border-radius:8px;background:var(--navy3);border:none;color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:.15s}
.tb-toggle:hover{color:var(--text1)}
.tb-title{font-family:'Noto Serif SC',serif;font-size:16px;font-weight:600;color:var(--text1)}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.tb-btn{padding:7px 16px;border-radius:8px;border:none;font-size:13px;cursor:pointer;font-family:inherit;transition:.15s;display:flex;align-items:center;gap:6px}
.tb-logout{background:rgba(224,85,85,.12);color:#e05555;border:1px solid rgba(224,85,85,.2)}
.tb-logout:hover{background:rgba(224,85,85,.2)}

/* ── Cards / Stats ── */
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:28px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;display:flex;align-items:center;gap:16px;transition:.2s}
.stat-card:hover{border-color:var(--blue);transform:translateY(-2px)}
.stat-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.stat-num{font-size:28px;font-weight:700;color:var(--text1);line-height:1}
.stat-label{font-size:12px;color:var(--text2);margin-top:4px}

/* ── Table ── */
.tbl-wrap{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.tbl-head{padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
.tbl-title{font-size:15px;font-weight:700}
.tbl-actions{display:flex;gap:8px;align-items:center}
.search-box{display:flex;align-items:center;gap:8px;background:var(--navy3);border:1px solid var(--border);border-radius:8px;padding:7px 12px}
.search-box input{background:none;border:none;outline:none;color:var(--text1);font-size:13px;width:160px;font-family:inherit}
.search-box input::placeholder{color:var(--text3)}
table{width:100%;border-collapse:collapse}
th{padding:11px 16px;text-align:left;font-size:12px;color:var(--text2);font-weight:500;border-bottom:1px solid var(--border);background:rgba(255,255,255,.02);white-space:nowrap}
td{padding:12px 16px;font-size:13px;border-bottom:1px solid rgba(30,48,69,.5);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.02)}
.td-name{display:flex;align-items:center;gap:10px}
.td-av{width:36px;height:36px;border-radius:8px;object-fit:cover;border:2px solid var(--border)}
.td-nm{font-weight:500;font-size:14px}
.td-sub{font-size:12px;color:var(--text2);margin-top:2px}
.badge-role{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;background:rgba(26,111,212,.18);color:var(--blue3);border:1px solid rgba(26,111,212,.3)}
.badge-on{background:rgba(0,201,167,.12);color:var(--accent);border:1px solid rgba(0,201,167,.25)}
.badge-off{background:rgba(224,85,85,.1);color:#e07070;border:1px solid rgba(224,85,85,.2)}

/* ── Buttons ── */
.btn{padding:8px 16px;border-radius:8px;border:none;font-size:13px;cursor:pointer;font-family:inherit;transition:.15s;display:inline-flex;align-items:center;gap:6px}
.btn:active{transform:scale(.96)}
.btn-primary{background:var(--blue);color:#fff}
.btn-primary:hover{background:var(--blue2)}
.btn-ghost{background:var(--navy3);color:var(--text2);border:1px solid var(--border)}
.btn-ghost:hover{color:var(--text1);border-color:var(--text3)}
.btn-danger{background:rgba(224,85,85,.12);color:#e05555;border:1px solid rgba(224,85,85,.2)}
.btn-danger:hover{background:rgba(224,85,85,.22)}
.btn-warn{background:rgba(240,165,0,.12);color:var(--warn);border:1px solid rgba(240,165,0,.2)}
.btn-success{background:rgba(0,201,167,.1);color:var(--accent);border:1px solid rgba(0,201,167,.2)}
.btn-sm{padding:5px 12px;font-size:12px}
.btn-icon{width:32px;height:32px;padding:0;justify-content:center}

/* ── Modal ── */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:100;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);animation:fadein .2s}
@keyframes fadein{from{opacity:0}to{opacity:1}}
.modal{background:var(--navy2);border:1px solid var(--border);border-radius:18px;width:560px;max-width:96vw;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;animation:scalein .25s ease}
@keyframes scalein{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
.modal-hd{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.modal-title{font-family:'Noto Serif SC',serif;font-size:17px;font-weight:700}
.modal-close{width:30px;height:30px;border-radius:8px;background:var(--navy3);border:none;color:var(--text2);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:.15s}
.modal-close:hover{color:var(--text1)}
.modal-body{padding:24px;overflow-y:auto;flex:1}
.modal-ft{padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px;flex-shrink:0}

/* ── Form ── */
.frow{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.fg{margin-bottom:16px}
.fl{font-size:12px;color:var(--text2);margin-bottom:6px;display:block;font-weight:500}
.fi,.fta,.fse{width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;color:var(--text1);background:var(--navy3);outline:none;transition:.2s}
.fi:focus,.fta:focus,.fse:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,111,212,.15)}
.fse option{background:var(--navy2)}
.fta{resize:vertical;min-height:90px}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--navy3);border:1px solid var(--border);border-radius:8px}
.toggle{position:relative;width:42px;height:24px;cursor:pointer}
.toggle input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;inset:0;background:var(--navy);border-radius:24px;transition:.25s;border:1px solid var(--border)}
.toggle-slider::before{content:'';position:absolute;width:18px;height:18px;left:2px;bottom:2px;background:var(--text3);border-radius:50%;transition:.25s}
.toggle input:checked + .toggle-slider{background:rgba(0,201,167,.2);border-color:var(--accent)}
.toggle input:checked + .toggle-slider::before{transform:translateX(18px);background:var(--accent)}

/* ── Login ── */
.login-page{width:100vw;min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--navy);position:relative;overflow:hidden}
.login-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(26,111,212,.12),transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(0,201,167,.08),transparent 50%)}
.login-grid{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:48px 48px;opacity:.35}
.login-card{position:relative;z-index:2;background:var(--navy2);border:1px solid var(--border);border-radius:20px;padding:40px 36px;width:400px;max-width:96vw;box-shadow:0 24px 80px rgba(0,0,0,.5);animation:scalein .35s ease}
.login-logo{display:flex;flex-direction:column;align-items:center;margin-bottom:32px;gap:12px}
.login-logo-mark{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--blue),var(--accent));display:flex;align-items:center;justify-content:center;font-family:'Noto Serif SC',serif;font-size:24px;font-weight:700;color:#fff;box-shadow:0 8px 24px rgba(26,111,212,.3)}
.login-title{font-family:'Noto Serif SC',serif;font-size:20px;font-weight:700;text-align:center}
.login-sub{font-size:13px;color:var(--text2);margin-top:4px;text-align:center}
.login-fg{margin-bottom:16px}
.login-label{font-size:12px;color:var(--text2);margin-bottom:6px;display:block;font-weight:500}
.login-input{width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:10px;font-size:14px;font-family:inherit;color:var(--text1);background:var(--navy3);outline:none;transition:.2s}
.login-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,111,212,.15)}
.login-btn{width:100%;padding:13px;border:none;border-radius:10px;background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff;font-size:15px;font-family:inherit;font-weight:500;cursor:pointer;margin-top:8px;transition:.2s;letter-spacing:.5px}
.login-btn:hover{opacity:.9;transform:translateY(-1px)}
.login-btn:active{transform:translateY(0)}
.login-error{background:rgba(224,85,85,.1);border:1px solid rgba(224,85,85,.2);color:#e07070;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:14px;text-align:center}
.login-hint{text-align:center;font-size:12px;color:var(--text3);margin-top:20px}
.login-hint code{color:var(--text2);background:var(--navy3);padding:1px 6px;border-radius:4px}

/* ── Toast ── */
.toast-wrap{position:fixed;top:20px;right:20px;z-index:999;display:flex;flex-direction:column;gap:8px}
.toast{padding:12px 18px;border-radius:10px;font-size:13px;display:flex;align-items:center;gap:8px;min-width:220px;animation:toastin .3s ease;box-shadow:0 8px 24px rgba(0,0,0,.3);border:1px solid transparent}
@keyframes toastin{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.toast-success{background:#0d2a22;border-color:rgba(0,201,167,.25);color:var(--accent)}
.toast-error{background:#2a0d0d;border-color:rgba(224,85,85,.25);color:#e07070}
.toast-info{background:#0d1f2a;border-color:rgba(26,111,212,.25);color:var(--blue3)}

/* ── Confirm dialog ── */
.confirm-box{background:var(--navy2);border:1px solid var(--border);border-radius:14px;padding:28px;width:340px;text-align:center;animation:scalein .2s ease}
.confirm-icon{font-size:36px;margin-bottom:12px}
.confirm-title{font-size:16px;font-weight:700;margin-bottom:8px}
.confirm-msg{font-size:13px;color:var(--text2);margin-bottom:20px;line-height:1.7}
.confirm-btns{display:flex;gap:10px;justify-content:center}

/* ── Pagination ── */
.pagination{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid var(--border)}
.page-info{font-size:13px;color:var(--text2)}
.page-btns{display:flex;gap:4px}
.pg-btn{width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:var(--navy3);color:var(--text2);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:.15s}
.pg-btn:hover{border-color:var(--blue3);color:var(--blue3)}
.pg-btn.active{background:var(--blue);color:#fff;border-color:var(--blue)}
.pg-btn:disabled{opacity:.35;cursor:default}

/* ── Empty ── */
.empty{text-align:center;padding:48px;color:var(--text3)}
.empty-icon{font-size:40px;margin-bottom:12px}
.empty-text{font-size:14px}

/* ── Page transitions ── */
.page-in{animation:pagein .25s ease}
@keyframes pagein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
`;

export default styles;
