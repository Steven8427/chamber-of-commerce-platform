# 城西商会 API 文档

**Base URL：** `http://localhost:3000`  
**响应格式：** `{ code: 0, data: ... }` 成功 / `{ code: 1, msg: "..." }` 失败  
**认证方式：** 管理接口需在 Header 携带 `Authorization: Bearer <token>`

---

## 一、公开接口（无需登录）

### 获取轮播图
```
GET /api/banners
```
返回 `is_active=1` 的轮播图列表，按 `sort_order` 排序。

**返回示例：**
```json
{ "code": 0, "data": [
  { "id": 1, "text": "标题", "sub": "副标题", "bg": "#0d1f4e",
    "image_url": "http://...", "video_url": "", "sort_order": 0, "is_active": 1 }
]}
```

---

### 获取职务列表
```
GET /api/roles
```
返回所有职务，按 `sort_order` 排序。

**返回示例：**
```json
{ "code": 0, "data": [
  { "id": 1, "name": "名誉会长", "sort_order": 0 }
]}
```

---

### 获取会员列表（仅启用状态）
```
GET /api/members
```
返回 `is_active=1` 的会员，按职务和排序字段排列。

**返回示例：**
```json
{ "code": 0, "data": [
  { "id": 1, "name": "张三", "photo": "http://...", "role_id": 1, "role_name": "名誉会长",
    "title": "董事长", "address": "开封市", "company_name": "xx公司",
    "company_logo": "http://...", "intro": "企业简介", "video_url": "",
    "sort_order": 0, "is_active": 1 }
]}
```

---

### 获取会员详情（含多职务）
```
GET /api/members/:id
```

**返回示例：**
```json
{ "code": 0, "data": {
  "id": 1, "name": "张三", "photo": "http://...",
  "role_id": 1, "role_name": "名誉会长",
  "positions": [
    {
      "id": 1, "role_id": 1, "role_label": "名誉会长",
      "title": "董事长", "address": "开封市",
      "company_name": "xx公司", "company_logo": "http://...",
      "intro": "企业简介", "video_url": "http://...",
      "sort_order": 0,
      "custom_fields": [
        { "label": "企业职位", "type": "text", "value": "董事长" },
        { "label": "联系方式", "type": "text", "value": "138xxxx" }
      ],
      "intro_blocks": [
        { "type": "video", "value": "http://...mp4" },
        { "type": "text",  "value": "企业简介内容" },
        { "type": "image", "value": "http://...jpg" }
      ]
    }
  ]
}}
```

---

### 获取网站设置
```
GET /api/settings
```

**返回示例：**
```json
{ "code": 0, "data": {
  "orgName": "开封市示范区城西商会",
  "orgSubtitle": "诚挚邀请",
  "orgLogo": "http://...",
  "fieldTitle": "企业职位",
  "fieldAddress": "企业所在地"
}}
```

---

## 二、文件上传（需登录）

### 上传文件（图片 / 视频）
```
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

字段名: file
```
- 支持所有文件类型
- 最大 **500MB**
- 文件保存在 `backend/uploads/` 目录

**返回示例：**
```json
{ "code": 0, "data": { "url": "http://localhost:3000/uploads/xxx.mp4" } }
```

---

## 三、管理员认证

### 登录
```
POST /api/admin/login
Content-Type: application/json

{ "username": "admin", "password": "admin123" }
```

**返回示例：**
```json
{ "code": 0, "data": {
  "token": "eyJ...",
  "admin": { "id": 1, "username": "admin", "name": "管理员", "role": "superadmin" }
}}
```
> token 有效期 **8小时**，过期后需重新登录。

---

## 四、管理员账号管理（需 superadmin）

### 获取管理员列表
```
GET /api/admin/admins
Authorization: Bearer <token>
```

### 新增管理员
```
POST /api/admin/admins
Authorization: Bearer <token>

{ "username": "editor1", "password": "123456", "name": "编辑员", "role": "editor" }
```
> `role` 可选值：`superadmin` / `editor`

### 修改管理员
```
PUT /api/admin/admins/:id
Authorization: Bearer <token>

{ "username": "editor1", "name": "编辑员", "role": "editor" }
// 修改密码时额外传 "password": "新密码"
```

### 删除管理员
```
DELETE /api/admin/admins/:id
Authorization: Bearer <token>
```
> 不能删除自己

---

## 五、轮播图管理（需登录）

### 新增轮播图
```
POST /api/admin/banners
Authorization: Bearer <token>

{
  "text": "主标题",
  "sub": "副标题",
  "bg": "#0d1f4e",
  "image_url": "http://...",
  "video_url": "",
  "sort_order": 0,
  "is_active": 1
}
```

### 修改轮播图
```
PUT /api/admin/banners/:id
Authorization: Bearer <token>
// 同上
```

### 删除轮播图
```
DELETE /api/admin/banners/:id
Authorization: Bearer <token>
```

---

## 六、职务管理（需登录）

### 新增职务
```
POST /api/admin/roles
Authorization: Bearer <token>

{ "name": "名誉会长", "sort_order": 0 }
```

### 修改职务
```
PUT /api/admin/roles/:id
Authorization: Bearer <token>

{ "name": "名誉会长", "sort_order": 0 }
```

### 删除职务
```
DELETE /api/admin/roles/:id
Authorization: Bearer <token>
```
> 职务下有会员时不能删除

---

## 七、会员管理（需登录）

### 获取所有会员（含停用）
```
GET /api/admin/members
Authorization: Bearer <token>
```

### 新增会员
```
POST /api/admin/members
Authorization: Bearer <token>

{
  "name": "张三",
  "role_id": 1,
  "photo": "http://...",
  "sort_order": 0,
  "positions": [
    {
      "role_id": 1,
      "role_label": "名誉会长",
      "title": "董事长",
      "address": "开封市",
      "company_name": "xx公司",
      "company_logo": "http://...",
      "intro": "企业简介",
      "video_url": "http://...mp4",
      "sort_order": 0,
      "custom_fields": [
        { "label": "企业职位", "type": "text",  "value": "董事长" },
        { "label": "联系方式", "type": "text",  "value": "138xxxx" },
        { "label": "企业图片", "type": "image", "value": "http://..." }
      ],
      "intro_blocks": [
        { "type": "video", "value": "http://...mp4" },
        { "type": "text",  "value": "企业简介内容" },
        { "type": "image", "value": "http://...jpg" }
      ]
    }
  ]
}
```

### 修改会员
```
PUT /api/admin/members/:id
Authorization: Bearer <token>

// 同上，额外可传 is_active: 0/1 控制显示状态
```

### 删除会员
```
DELETE /api/admin/members/:id
Authorization: Bearer <token>
```

---

## 八、网站设置（需登录）

### 保存设置
```
PUT /api/admin/settings
Authorization: Bearer <token>

{
  "orgName": "开封市示范区城西商会",
  "orgSubtitle": "诚挚邀请",
  "orgLogo": "http://...",
  "fieldTitle": "企业职位",
  "fieldAddress": "企业所在地"
}
```

---

## 九、字段说明

### custom_fields（自定义字段）
每个职务最多 **5 个**，存入 `member_positions.custom_fields`（JSON）。

| 字段  | 类型   | 说明                         |
|-------|--------|------------------------------|
| label | string | 标签名，如「企业职位」        |
| type  | string | `text` / `image` / `video`  |
| value | string | 对应内容或 URL               |

### intro_blocks（企业介绍区块）
数量不限，存入 `member_positions.intro_blocks`（JSON）。

| 字段  | 类型   | 说明                         |
|-------|--------|------------------------------|
| type  | string | `text` / `image` / `video`  |
| value | string | 文本内容或资源 URL           |

---

## 十、数据库自动迁移

服务器启动时自动检测并添加以下缺失列，**无需手动执行 SQL**：

| 表                 | 列              | 类型                    |
|--------------------|-----------------|-------------------------|
| member_positions   | custom_fields   | TEXT                    |
| member_positions   | intro_blocks    | TEXT                    |
| member_positions   | role_label      | VARCHAR(200)            |
| settings           | field_title     | VARCHAR(100)            |
| settings           | field_address   | VARCHAR(100)            |
| banners            | video_url       | VARCHAR(500)            |
