-- Fix RLS policies for content_requests to allow admin access
-- Drop existing policy
DROP POLICY IF EXISTS "Admins can manage content requests" ON content_requests;

-- Create new policy that allows admin access
CREATE POLICY "Admins can manage content requests" 
ON content_requests 
FOR ALL 
USING (true); 