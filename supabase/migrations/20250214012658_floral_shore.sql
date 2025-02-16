-- /*
--   # Add cart items table

--   1. New Tables
--     - `cart_items`
--       - `id` (uuid, primary key)
--       - `user_id` (uuid, references auth.users)
--       - `product_id` (uuid, references products)
--       - `quantity` (integer)
--       - `created_at` (timestamp)
--       - `updated_at` (timestamp)

--   2. Security
--     - Enable RLS on `cart_items` table
--     - Add policies for users to manage their own cart items
-- */

-- CREATE TABLE cart_items (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES auth.users(id) NOT NULL,
--   product_id UUID REFERENCES products(id) NOT NULL,
--   quantity INTEGER NOT NULL CHECK (quantity > 0),
--   created_at TIMESTAMPTZ DEFAULT now(),
--   updated_at TIMESTAMPTZ DEFAULT now(),
--   UNIQUE(user_id, product_id)
-- );

-- ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- -- Policies for cart items
-- CREATE POLICY "Users can view own cart items"
--   ON cart_items FOR SELECT
--   TO authenticated
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert own cart items"
--   ON cart_items FOR INSERT
--   TO authenticated
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update own cart items"
--   ON cart_items FOR UPDATE
--   TO authenticated
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own cart items"
--   ON cart_items FOR DELETE
--   TO authenticated
--   USING (auth.uid() = user_id);

-- -- Function to update updated_at timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = now();
--   RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- -- Trigger to automatically update updated_at
-- CREATE TRIGGER update_cart_items_updated_at
--   BEFORE UPDATE ON cart_items
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();