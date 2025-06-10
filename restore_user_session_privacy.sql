-- SQL Script untuk menambahkan kembali user_session_id dengan sistem privasi
-- Jalankan script ini di Supabase SQL Editor

-- 1. Tambahkan kembali kolom user_session_id
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_session_id VARCHAR(255);

-- 2. Update existing orders dengan session ID unik untuk melindungi privasi
UPDATE public.orders 
SET user_session_id = CONCAT('legacy_', id::text, '_', EXTRACT(epoch FROM created_at)::text)
WHERE user_session_id IS NULL;

-- 3. Buat kolom menjadi NOT NULL setelah update
ALTER TABLE public.orders 
ALTER COLUMN user_session_id SET NOT NULL;

-- 4. Tambah index untuk performa query berdasarkan user_session_id
CREATE INDEX IF NOT EXISTS idx_orders_user_session_id 
ON public.orders USING btree (user_session_id);

-- 5. Verifikasi struktur tabel
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' AND column_name = 'user_session_id';

-- 6. Test query untuk memastikan isolasi user bekerja
-- SELECT user_session_id, COUNT(*) as order_count
-- FROM orders 
-- GROUP BY user_session_id
-- ORDER BY order_count DESC;
