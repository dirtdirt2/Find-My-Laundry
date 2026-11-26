-- Find My Laundry - MySQL 8+ schema
-- Run this file against the find_my_laundry database.
-- Keep schema changes in version control and add migration files for later changes.

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(25) NOT NULL DEFAULT '',
  location VARCHAR(160) NOT NULL DEFAULT '',
  terms_accepted_at DATETIME(3) NOT NULL,
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT chk_users_email_verified CHECK (email_verified IN (0, 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_otps (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  otp_hash CHAR(64) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  consumed_at DATETIME(3) NULL,
  KEY idx_email_otps_user_created (user_id, created_at),
  CONSTRAINT fk_email_otps_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS laundry_shops (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  services JSON NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  distance DECIMAL(7,2) NOT NULL DEFAULT 0.00,
  open_until VARCHAR(40) NOT NULL DEFAULT '',
  image_url VARCHAR(1000) NOT NULL DEFAULT '',
  address VARCHAR(255) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_laundry_shops_active_name (is_active, name),
  CONSTRAINT chk_laundry_shops_active CHECK (is_active IN (0, 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Demonstration records only. Replace these with verified shop information before launch.
INSERT IGNORE INTO laundry_shops
  (id, name, rating, services, price, distance, open_until, image_url, address, description, is_active)
VALUES
  (1, 'Wash Your Problems', 4.4, JSON_ARRAY('Self-Service', 'Full-Service'), 120.00, 0.20, '11 PM',
   'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=600&auto=format&fit=crop',
   'Naga City, Camarines Sur',
   'Sample laundry shop listing for local development. Confirm business information before publishing.', 1),
  (2, 'Seoul Hanger Laundry Shop', 4.1, JSON_ARRAY('Full-Service'), 110.00, 0.50, '7 PM',
   'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop',
   'Naga City, Camarines Sur',
   'Sample laundry shop listing for local development. Confirm business information before publishing.', 1),
  (3, 'Superbubbles Laundry Services', 4.4, JSON_ARRAY('Self-Service', 'Full-Service'), 150.00, 1.60, '9 PM',
   'https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?q=80&w=600&auto=format&fit=crop',
   'Naga City, Camarines Sur',
   'Sample laundry shop listing for local development. Confirm business information before publishing.', 1);
