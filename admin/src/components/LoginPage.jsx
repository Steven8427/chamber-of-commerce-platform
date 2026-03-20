import { useState } from "react";
import { API } from "../api";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError("请输入账号和密码"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.code === 0) {
        onLogin(data.data.admin, data.data.token);
      } else {
        setError(data.msg || "账号或密码错误");
        setLoading(false);
      }
    } catch {
      setError("无法连接到服务器，请确认后端已启动");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" /><div className="login-grid" />
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">会</div>
          <div>
            <div className="login-title">城西商会管理系统</div>
            <div className="login-sub">开封市示范区城西商会 · 后台管理平台</div>
          </div>
        </div>
        {error && <div className="login-error">{error}</div>}
        <div className="login-fg">
          <label className="login-label">管理员账号</label>
          <input className="login-input" placeholder="请输入账号" value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="username" />
        </div>
        <div className="login-fg">
          <label className="login-label">密码</label>
          <input className="login-input" type="password" placeholder="请输入密码" value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="current-password" />
        </div>
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "登录中..." : "登 录"}
        </button>
        <div className="login-hint">默认账号：<code>admin</code> / <code>admin123</code></div>
      </div>
    </div>
  );
}
