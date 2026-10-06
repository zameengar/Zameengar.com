-- Migration: 0008_fix_admin_profile_management.sql
-- The previous policy used FOR ALL, which caused infinite recursion during SELECT operations.
-- We drop the bad policy and recreate it specifically for UPDATE operations.

DROP POLICY IF EXISTS "Admins can manage all profiles." ON profiles;

CREATE POLICY "Admins can update all profiles." ON profiles FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
