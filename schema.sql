-- Create table for storing guest blessings in Cloudflare D1
CREATE TABLE IF NOT EXISTS blessings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  relation TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Insert a default blessing to start
INSERT INTO blessings (name, relation, message, created_at)
VALUES (
  'Satheesh & Smitha',
  'Bride Parents',
  'Wishing our dearest Varsha and Akhil a life filled with endless love, happiness, and prosperity. God bless you both! 🪷',
  '2026-07-15T22:00:00.000Z'
);
