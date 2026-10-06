-- Migration: 0007_admin_profile_management.sql
-- Add policy to allow admins to manage all user profiles (e.g., updating property limits or status)

-- Previously, there was only "Users can update own profile."
-- We need to add one explicitly for admins.

CREATE POLICY "Admins can manage all profiles." ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles AS admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.role = 'admin')
);
