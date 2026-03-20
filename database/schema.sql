-- =====================================================
-- 城西商会 - 完整数据库结构（最新版）
-- =====================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS commerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE commerce_db;

-- 1. 管理员账号表
CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  role          ENUM('superadmin','editor') DEFAULT 'editor',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 轮播广告表
CREATE TABLE IF NOT EXISTS banners (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  text       VARCHAR(200) NOT NULL DEFAULT '',
  sub        VARCHAR(300) DEFAULT '',
  bg         VARCHAR(100) DEFAULT '#0d1f4e',
  image_url  VARCHAR(500) DEFAULT '',
  video_url  VARCHAR(500) DEFAULT '',
  sort_order INT          DEFAULT 0,
  is_active  TINYINT(1)   DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 职务表
CREATE TABLE IF NOT EXISTS roles (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  sort_order INT          DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 会员表
CREATE TABLE IF NOT EXISTS members (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  role_id    INT          NOT NULL,
  title      VARCHAR(200) DEFAULT '',
  address    VARCHAR(500) DEFAULT '',
  photo      VARCHAR(500) DEFAULT '',
  sort_order INT          DEFAULT 0,
  is_active  TINYINT(1)   DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 公司详情表
CREATE TABLE IF NOT EXISTS companies (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  member_id    INT          NOT NULL UNIQUE,
  company_name VARCHAR(300) NOT NULL DEFAULT '',
  company_logo VARCHAR(500) DEFAULT '',
  intro        TEXT,
  video_url    VARCHAR(500) DEFAULT '',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 会员多职务表
CREATE TABLE IF NOT EXISTS member_positions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  member_id    INT          NOT NULL,
  role_id      INT          NOT NULL,
  role_label   VARCHAR(200) DEFAULT '',
  title        VARCHAR(200) DEFAULT '',
  address      VARCHAR(500) DEFAULT '',
  company_name VARCHAR(300) DEFAULT '',
  company_logo VARCHAR(500) DEFAULT '',
  intro        TEXT,
  video_url    VARCHAR(500) DEFAULT '',
  sort_order   INT          DEFAULT 0,
  custom_fields TEXT        DEFAULT NULL,
  intro_blocks  TEXT        DEFAULT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id)   REFERENCES roles(id)   ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. 网站设置表
CREATE TABLE IF NOT EXISTS settings (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  org_name      VARCHAR(200) DEFAULT '',
  org_logo      VARCHAR(500) DEFAULT '',
  org_subtitle  VARCHAR(200) DEFAULT '',
  field_title   VARCHAR(100) DEFAULT '',
  field_address VARCHAR(100) DEFAULT '',
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 初始数据
-- =====================================================

-- 管理员（密码均为 admin123）
INSERT INTO admins (username, password_hash, name, role) VALUES
('admin',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '超级管理员', 'superadmin'),
('manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '内容管理员', 'editor');

-- 轮播图
INSERT INTO banners (text, sub, bg, sort_order) VALUES
('科技赋能共创未来',   '开封市示范区城西商会 诚挚邀请', '#0d1f4e', 1),
('携手共进 共创辉煌',  '2026年度会员大会即将召开',       '#0a2a5e', 2),
('创新驱动 合作共赢',  '欢迎新会员加入城西商会',         '#122060', 3);

-- 职务
INSERT INTO roles (name, sort_order) VALUES
('名誉会长',   1),
('会长',       2),
('党支部书记', 3),
('执行会长',   4),
('副会长',     5),
('秘书长',     6),
('顾问',       7),
('会员',       8);

-- 网站默认设置
INSERT INTO settings (org_name, org_logo, org_subtitle) VALUES
('开封市示范区城西商会', '', '诚挚邀请');