// =====================================================
// 城西商会 - 后端 API
// npm install express cors dotenv mysql2 jsonwebtoken bcryptjs multer
// =====================================================
const express = require("express");
const cors    = require("cors");
const jwt     = require("jsonwebtoken");
const bcrypt  = require("bcryptjs");
const mysql   = require("mysql2/promise");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");
require("dotenv").config();

const app    = express();
const SECRET = process.env.JWT_SECRET || "change_this_secret_in_production";

// 确保 uploads 目录存在
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// multer 配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB（支持视频）
  fileFilter: (req, file, cb) => cb(null, true) // 允许所有文件类型
});

app.use(cors({ origin: (o, cb) => cb(null, true), credentials: true }));
app.use(express.json({ limit: "20mb" }));
// 静态文件服务（访问上传的图片）
app.use("/uploads", express.static(UPLOAD_DIR));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "your_password",
  database: process.env.DB_NAME || "commerce_db",
  waitForConnections: true, connectionLimit: 10,
});

const q    = (sql, p) => pool.execute(sql, p);
const ok   = (res, data)       => res.json({ code: 0, data });
const fail = (res, msg, s=500) => res.status(s).json({ code: 1, msg });

// ─── JWT 中间件 ──────────────────────────────────
function authAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return fail(res, "未登录", 401);
  try { req.admin = jwt.verify(token, SECRET); next(); }
  catch { fail(res, "登录已过期", 401); }
}
function authSuper(req, res, next) {
  if (req.admin?.role !== "superadmin") return fail(res, "权限不足", 403);
  next();
}

// ─── 图片上传 ─────────────────────────────────────
app.post("/api/upload", authAdmin, (req, res, next) => {
  upload.single("file")(req, res, err => {
    if (err) return fail(res, err.message || "上传失败", 400);
    if (!req.file) return fail(res, "未收到文件", 400);
    const host = process.env.SERVER_HOST || "localhost";
    const port = process.env.PORT || 3000;
    const url = `http://${host}:${port}/uploads/${req.file.filename}`;
    ok(res, { url });
  });
});

// ─── 管理员登录 ───────────────────────────────────
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const [[admin]] = await q("SELECT * FROM admins WHERE username=?", [username]);
  if (!admin || !await bcrypt.compare(password, admin.password_hash))
    return fail(res, "账号或密码错误", 401);
  const token = jwt.sign(
    { id: admin.id, username: admin.username, name: admin.name, role: admin.role },
    SECRET, { expiresIn: "8h" }
  );
  ok(res, { token, admin: { id:admin.id, username:admin.username, name:admin.name, role:admin.role } });
});

// ─── 管理员账号管理 ───────────────────────────────
app.get("/api/admin/admins", authAdmin, authSuper, async (req, res) => {
  const [rows] = await q("SELECT id,username,name,role,created_at FROM admins ORDER BY id");
  ok(res, rows);
});
app.post("/api/admin/admins", authAdmin, authSuper, async (req, res) => {
  const { username, password, name, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const [r] = await q("INSERT INTO admins (username,password_hash,name,role) VALUES (?,?,?,?)", [username,hash,name,role]);
  ok(res, { id: r.insertId });
});
app.put("/api/admin/admins/:id", authAdmin, authSuper, async (req, res) => {
  const { username, password, name, role } = req.body;
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    await q("UPDATE admins SET username=?,password_hash=?,name=?,role=? WHERE id=?", [username,hash,name,role,req.params.id]);
  } else {
    await q("UPDATE admins SET username=?,name=?,role=? WHERE id=?", [username,name,role,req.params.id]);
  }
  ok(res, null);
});
app.delete("/api/admin/admins/:id", authAdmin, authSuper, async (req, res) => {
  if (+req.params.id === req.admin.id) return fail(res, "不能删除自己", 400);
  await q("DELETE FROM admins WHERE id=?", [req.params.id]);
  ok(res, null);
});

// ─── 公开接口 ─────────────────────────────────────
app.get("/api/banners", async (req, res) => {
  const [rows] = await q("SELECT * FROM banners WHERE is_active=1 ORDER BY sort_order");
  ok(res, rows);
});
app.get("/api/roles", async (req, res) => {
  const [rows] = await q("SELECT * FROM roles ORDER BY sort_order");
  ok(res, rows);
});
app.get("/api/members", async (req, res) => {
  const [members] = await q(`SELECT m.*,c.company_name,c.company_logo,c.intro,c.video_url,r.name AS role_name
    FROM members m LEFT JOIN companies c ON c.member_id=m.id LEFT JOIN roles r ON r.id=m.role_id
    WHERE m.is_active=1 ORDER BY r.sort_order,m.sort_order`);
  ok(res, members);
});
app.get("/api/members/:id", async (req, res) => {
  const [[m]] = await q(`SELECT m.*,c.company_name,c.company_logo,c.intro,c.video_url,r.name AS role_name
    FROM members m LEFT JOIN companies c ON c.member_id=m.id LEFT JOIN roles r ON r.id=m.role_id WHERE m.id=?`, [req.params.id]);
  if (!m) return fail(res, "会员不存在", 404);
  const [positions] = await q(`SELECT mp.*, r.name AS role_name FROM member_positions mp LEFT JOIN roles r ON r.id=mp.role_id WHERE mp.member_id=? ORDER BY mp.sort_order`, [req.params.id]);
  const parsed = positions.map(p => {
    let cf = null, ib = null;
    try { cf = p.custom_fields ? JSON.parse(p.custom_fields) : null; } catch {}
    try { ib = p.intro_blocks  ? JSON.parse(p.intro_blocks)  : null; } catch {}
    return { ...p, custom_fields: cf, intro_blocks: ib };
  });
  ok(res, { ...m, positions: parsed });
});

// 网站设置（公开读）
app.get("/api/settings", async (req, res) => {
  const [[row]] = await q("SELECT * FROM settings LIMIT 1");
  if (!row) return ok(res, {});
  ok(res, {
    orgName:       row.org_name,
    orgSubtitle:   row.org_subtitle,
    orgLogo:       row.org_logo,
    fieldTitle:    row.field_title   || "企业职位",
    fieldAddress:  row.field_address || "企业所在地",
  });
});

// ─── 管理接口 ─────────────────────────────────────
// 轮播图（支持图片/视频）
app.get("/api/admin/banners", authAdmin, async (req, res) => {
  const [rows] = await q("SELECT * FROM banners ORDER BY sort_order");
  ok(res, rows);
});
app.post("/api/admin/banners", authAdmin, async (req, res) => {
  const {text,sub,bg,image_url,video_url,sort_order,is_active} = req.body;
  const [r] = await q(
    "INSERT INTO banners (text,sub,bg,image_url,video_url,sort_order,is_active) VALUES (?,?,?,?,?,?,?)",
    [text||"",sub||"",bg||"#0d1f4e",image_url||"",video_url||"",sort_order||0,is_active??1]
  );
  ok(res, {id:r.insertId});
});
app.put("/api/admin/banners/:id", authAdmin, async (req, res) => {
  const {text,sub,bg,image_url,video_url,sort_order,is_active} = req.body;
  await q(
    "UPDATE banners SET text=?,sub=?,bg=?,image_url=?,video_url=?,sort_order=?,is_active=? WHERE id=?",
    [text||"",sub||"",bg||"#0d1f4e",image_url||"",video_url||"",sort_order||0,is_active,req.params.id]
  );
  ok(res, null);
});
app.delete("/api/admin/banners/:id", authAdmin, async (req, res) => {
  await q("DELETE FROM banners WHERE id=?", [req.params.id]);
  ok(res, null);
});

// 网站设置（需登录）
app.put("/api/admin/settings", authAdmin, async (req, res) => {
  const { orgName, orgSubtitle, orgLogo, fieldTitle, fieldAddress } = req.body;
  const [[row]] = await q("SELECT id FROM settings LIMIT 1");
  if (row) {
    await q(
      "UPDATE settings SET org_name=?, org_logo=?, org_subtitle=?, field_title=?, field_address=? WHERE id=?",
      [orgName||"", orgLogo||"", orgSubtitle||"", fieldTitle||"", fieldAddress||"", row.id]
    );
  } else {
    await q(
      "INSERT INTO settings (org_name, org_logo, org_subtitle, field_title, field_address) VALUES (?,?,?,?,?)",
      [orgName||"", orgLogo||"", orgSubtitle||"", fieldTitle||"", fieldAddress||""]
    );
  }
  ok(res, null);
});

// 职务
app.post  ("/api/admin/roles",    authAdmin, async (req, res) => { const {name,sort_order}=req.body; const [r]=await q("INSERT INTO roles (name,sort_order) VALUES (?,?)",[name,sort_order||0]); ok(res,{id:r.insertId}); });
app.put   ("/api/admin/roles/:id",authAdmin, async (req, res) => { const {name,sort_order}=req.body; await q("UPDATE roles SET name=?,sort_order=? WHERE id=?",[name,sort_order,req.params.id]); ok(res,null); });
app.delete("/api/admin/roles/:id",authAdmin, async (req, res) => { const [[c]]=await q("SELECT COUNT(*) as n FROM members WHERE role_id=?",[req.params.id]); if(c.n>0) return fail(res,"该职务下还有会员",400); await q("DELETE FROM roles WHERE id=?",[req.params.id]); ok(res,null); });

// 会员（支持多职位）
app.post("/api/admin/members", authAdmin, async (req, res) => {
  const {name,role_id,photo,sort_order,positions=[]} = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.execute(
      "INSERT INTO members (name,role_id,title,address,photo,sort_order) VALUES (?,?,?,?,?,?)",
      [name, role_id, positions[0]?.title||"", positions[0]?.address||"", photo||"", sort_order||0]
    );
    const mid = r.insertId;
    await conn.execute(
      "INSERT INTO companies (member_id,company_name,company_logo,intro,video_url) VALUES (?,?,?,?,?)",
      [mid, positions[0]?.company_name||"", positions[0]?.company_logo||"", positions[0]?.intro||"", positions[0]?.video_url||""]
    );
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const cf = p.custom_fields ? JSON.stringify(p.custom_fields) : null;
      const ib = p.intro_blocks  ? JSON.stringify(p.intro_blocks)  : null;
      await conn.execute(
        "INSERT INTO member_positions (member_id,role_id,role_label,title,address,company_name,company_logo,intro,video_url,sort_order,custom_fields,intro_blocks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [mid, p.role_id||role_id, p.role_label||"", p.title||"", p.address||"", p.company_name||"", p.company_logo||"", p.intro||"", p.video_url||"", i, cf, ib]
      );
    }
    await conn.commit();
    ok(res, { id: mid });
  } catch(e) { await conn.rollback(); fail(res, e.message); } finally { conn.release(); }
});

app.put("/api/admin/members/:id", authAdmin, async (req, res) => {
  const {name,role_id,photo,sort_order,is_active,positions=[]} = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      "UPDATE members SET name=?,role_id=?,title=?,address=?,photo=?,sort_order=?,is_active=? WHERE id=?",
      [name, role_id, positions[0]?.title||"", positions[0]?.address||"", photo||"", sort_order||0, is_active, req.params.id]
    );
    await conn.execute(
      `INSERT INTO companies (member_id,company_name,company_logo,intro,video_url) VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE company_name=VALUES(company_name),company_logo=VALUES(company_logo),intro=VALUES(intro),video_url=VALUES(video_url)`,
      [req.params.id, positions[0]?.company_name||"", positions[0]?.company_logo||"", positions[0]?.intro||"", positions[0]?.video_url||""]
    );
    await conn.execute("DELETE FROM member_positions WHERE member_id=?", [req.params.id]);
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const cf = p.custom_fields ? JSON.stringify(p.custom_fields) : null;
      const ib = p.intro_blocks  ? JSON.stringify(p.intro_blocks)  : null;
      await conn.execute(
        "INSERT INTO member_positions (member_id,role_id,role_label,title,address,company_name,company_logo,intro,video_url,sort_order,custom_fields,intro_blocks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [req.params.id, p.role_id||role_id, p.role_label||"", p.title||"", p.address||"", p.company_name||"", p.company_logo||"", p.intro||"", p.video_url||"", i, cf, ib]
      );
    }
    await conn.commit();
    ok(res, null);
  } catch(e) { await conn.rollback(); fail(res, e.message); } finally { conn.release(); }
});

app.get("/api/admin/members", authAdmin, async (req, res) => {
  const [members] = await q(`SELECT m.*,c.company_name,c.company_logo,c.intro,c.video_url,r.name AS role_name
    FROM members m LEFT JOIN companies c ON c.member_id=m.id LEFT JOIN roles r ON r.id=m.role_id
    ORDER BY r.sort_order,m.sort_order`);
  ok(res, members);
});

app.delete("/api/admin/members/:id", authAdmin, async (req, res) => {
  await q("DELETE FROM members WHERE id=?", [req.params.id]);
  ok(res, null);
});

const PORT = process.env.PORT || 3000;

// 启动时自动补全缺失列（幂等，重复执行无副作用）
async function ensureColumns() {
  const cols = [
    ["member_positions", "custom_fields", "TEXT DEFAULT NULL"],
    ["member_positions", "intro_blocks",  "TEXT DEFAULT NULL"],
    ["member_positions", "role_label",    "VARCHAR(200) DEFAULT ''"],
    ["settings",         "field_title",   "VARCHAR(100) DEFAULT ''"],
    ["settings",         "field_address", "VARCHAR(100) DEFAULT ''"],
    ["banners",          "video_url",     "VARCHAR(500) DEFAULT ''"],
  ];
  for (const [table, col, def] of cols) {
    try {
      await q(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${def}`);
      console.log(`✅ 已添加列 ${table}.${col}`);
    } catch (e) {
      if (e.code !== "ER_DUP_FIELDNAME") console.warn(`列 ${table}.${col} 添加跳过:`, e.message);
    }
  }
}

ensureColumns().then(() => {
  app.listen(PORT, () => console.log(`✅ API 服务 → http://localhost:${PORT}`));
});