-- Add is_admin field to users table to distinguish admin users
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;