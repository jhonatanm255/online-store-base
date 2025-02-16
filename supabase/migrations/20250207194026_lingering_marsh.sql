-- /*
--   # Initial Schema Setup for Furniture E-commerce

--   1. New Tables
--     - `products`
--       - Product information including name, description, price, stock
--     - `categories`
--       - Product categories
--     - `orders`
--       - Customer order information
--     - `order_items`
--       - Individual items in each order
--     - `profiles`
--       - Extended user profile information

--   2. Security
--     - Enable RLS on all tables
--     - Add appropriate policies for each table
-- */

-- -- Create categories table
-- CREATE TABLE categories (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   slug TEXT NOT NULL UNIQUE,
--   created_at TIMESTAMPTZ DEFAULT now()
-- );

-- -- Create products table
-- CREATE TABLE products (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   slug TEXT NOT NULL UNIQUE,
--   description TEXT,
--   price DECIMAL(10,2) NOT NULL,
--   stock INTEGER NOT NULL DEFAULT 0,
--   category_id UUID REFERENCES categories(id),
--   image_url TEXT NOT NULL,
--   is_featured BOOLEAN DEFAULT false,
--   is_on_sale BOOLEAN DEFAULT false,
--   sale_price DECIMAL(10,2),
--   created_at TIMESTAMPTZ DEFAULT now(),
--   updated_at TIMESTAMPTZ DEFAULT now()
-- );

-- -- Create profiles table
-- CREATE TABLE profiles (
--   id UUID PRIMARY KEY REFERENCES auth.users(id),
--   email TEXT NOT NULL,
--   full_name TEXT,
--   address TEXT,
--   phone TEXT,
--   created_at TIMESTAMPTZ DEFAULT now(),
--   updated_at TIMESTAMPTZ DEFAULT now()
-- );

-- -- Create orders table
-- CREATE TABLE orders (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES auth.users(id),
--   status TEXT NOT NULL DEFAULT 'pending',
--   total_amount DECIMAL(10,2) NOT NULL,
--   shipping_address TEXT NOT NULL,
--   payment_intent_id TEXT,
--   created_at TIMESTAMPTZ DEFAULT now(),
--   updated_at TIMESTAMPTZ DEFAULT now()
-- );

-- -- Create order items table
-- CREATE TABLE order_items (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   order_id UUID REFERENCES orders(id),
--   product_id UUID REFERENCES products(id),
--   quantity INTEGER NOT NULL,
--   price_at_time DECIMAL(10,2) NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT now()
-- );

-- -- Enable Row Level Security
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- -- Create policies
-- -- Categories policies
-- CREATE POLICY "Allow public read access to categories"
--   ON categories FOR SELECT
--   TO public
--   USING (true);

-- CREATE POLICY "Allow admin to manage categories"
--   ON categories FOR ALL
--   TO authenticated
--   USING (auth.email() = 'admin@store.com');

-- -- Products policies
-- CREATE POLICY "Allow public read access to products"
--   ON products FOR SELECT
--   TO public
--   USING (true);

-- CREATE POLICY "Allow admin to manage products"
--   ON products FOR ALL
--   TO authenticated
--   USING (auth.email() = 'admin@store.com');

-- -- Profiles policies
-- CREATE POLICY "Users can view own profile"
--   ON profiles FOR SELECT
--   TO authenticated
--   USING (auth.uid() = id);

-- CREATE POLICY "Users can update own profile"
--   ON profiles FOR UPDATE
--   TO authenticated
--   USING (auth.uid() = id);

-- -- Orders policies
-- CREATE POLICY "Users can view own orders"
--   ON orders FOR SELECT
--   TO authenticated
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can create own orders"
--   ON orders FOR INSERT
--   TO authenticated
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Admin can view all orders"
--   ON orders FOR SELECT
--   TO authenticated
--   USING (auth.email() = 'admin@store.com');

-- -- Order items policies
-- CREATE POLICY "Users can view own order items"
--   ON order_items FOR SELECT
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM orders
--       WHERE orders.id = order_items.order_id
--       AND orders.user_id = auth.uid()
--     )
--   );

-- CREATE POLICY "Users can create order items"
--   ON order_items FOR INSERT
--   TO authenticated
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM orders
--       WHERE orders.id = order_items.order_id
--       AND orders.user_id = auth.uid()
--     )
--   );

-- -- Create admin user function
-- CREATE OR REPLACE FUNCTION create_admin_user()
-- RETURNS void AS $$
-- BEGIN
--   INSERT INTO auth.users (
--     email,
--     encrypted_password,
--     email_confirmed_at,
--     role
--   )
--   VALUES (
--     'admin@store.com',
--     crypt('admin123456', gen_salt('bf')),
--     now(),
--     'admin'
--   )
--   ON CONFLICT (email) DO NOTHING;
-- END;
-- $$ LANGUAGE plpgsql;