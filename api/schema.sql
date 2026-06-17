-- ShukanPack Database Schema
-- Run this script in phpMyAdmin to create the necessary tables.

CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `image` LONGTEXT NOT NULL, -- Changed from TEXT to LONGTEXT to support Base64 uploaded images
  `shortDesc` TEXT NOT NULL,
  `longDesc` TEXT NOT NULL,
  `specs` LONGTEXT NOT NULL, -- Stores specs as a JSON string
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'unread',
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
