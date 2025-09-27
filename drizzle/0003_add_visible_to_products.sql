-- Add a visibility flag to products to control catalog visibility
ALTER TABLE products ADD COLUMN visible integer NOT NULL DEFAULT 1;
