-- Meeting Scheduler Database Schema
-- Migration: 20250106000000_meeting_scheduler_schema.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Meeting Slots Table
CREATE TABLE meeting_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    is_recurring BOOLEAN DEFAULT false,
    recurring_pattern JSONB, -- For weekly/monthly patterns
    max_duration_minutes INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Meeting Bookings Table
CREATE TABLE meeting_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID REFERENCES meeting_slots(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    company VARCHAR(255),
    service_interest VARCHAR(255),
    meeting_type VARCHAR(100) DEFAULT 'consultation', -- consultation, demo, strategy
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, cancelled, completed
    notes TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Admin Availability Settings Table
CREATE TABLE admin_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    break_start TIME,
    break_end TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Meeting Types Configuration Table
CREATE TABLE meeting_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_meeting_slots_start_time ON meeting_slots(start_time);
CREATE INDEX idx_meeting_slots_available ON meeting_slots(is_available);
CREATE INDEX idx_meeting_bookings_slot_id ON meeting_bookings(slot_id);
CREATE INDEX idx_meeting_bookings_user_email ON meeting_bookings(user_email);
CREATE INDEX idx_meeting_bookings_status ON meeting_bookings(status);
CREATE INDEX idx_admin_availability_day ON admin_availability(day_of_week);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_meeting_slots_updated_at BEFORE UPDATE ON meeting_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meeting_bookings_updated_at BEFORE UPDATE ON meeting_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_availability_updated_at BEFORE UPDATE ON admin_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meeting_types_updated_at BEFORE UPDATE ON meeting_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default meeting types
INSERT INTO meeting_types (name, description, duration_minutes) VALUES
('AI Development Consultation', 'Discuss custom AI development needs and requirements', 60),
('AI Strategy Session', 'Strategic planning for AI implementation', 45),
('AI Demo & Walkthrough', 'Product demonstration and feature overview', 30),
('Technical Deep Dive', 'Detailed technical discussion and architecture review', 90),
('Project Planning', 'Project scope, timeline, and resource planning', 60);

-- Insert default admin availability (Monday-Friday, 9 AM - 5 PM)
INSERT INTO admin_availability (day_of_week, start_time, end_time, is_available) VALUES
(1, '09:00:00', '17:00:00', true), -- Monday
(2, '09:00:00', '17:00:00', true), -- Tuesday
(3, '09:00:00', '17:00:00', true), -- Wednesday
(4, '09:00:00', '17:00:00', true), -- Thursday
(5, '09:00:00', '17:00:00', true); -- Friday

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE meeting_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_types ENABLE ROW LEVEL SECURITY;

-- Meeting Slots Policies
CREATE POLICY "Anyone can view available meeting slots" ON meeting_slots
    FOR SELECT USING (is_available = true);

CREATE POLICY "Admin can manage all meeting slots" ON meeting_slots
    FOR ALL USING (auth.role() = 'authenticated');

-- Meeting Bookings Policies
CREATE POLICY "Users can view their own bookings" ON meeting_bookings
    FOR SELECT USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Anyone can create bookings" ON meeting_bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own bookings" ON meeting_bookings
    FOR UPDATE USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Admin can manage all bookings" ON meeting_bookings
    FOR ALL USING (auth.role() = 'authenticated');

-- Admin Availability Policies
CREATE POLICY "Anyone can view admin availability" ON admin_availability
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage availability" ON admin_availability
    FOR ALL USING (auth.role() = 'authenticated');

-- Meeting Types Policies
CREATE POLICY "Anyone can view meeting types" ON meeting_types
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage meeting types" ON meeting_types
    FOR ALL USING (auth.role() = 'authenticated');

-- Create a view for available slots with meeting type info
CREATE VIEW available_slots_view AS
SELECT 
    ms.id,
    ms.start_time,
    ms.end_time,
    ms.max_duration_minutes,
    mt.name as meeting_type_name,
    mt.description as meeting_type_description,
    mt.duration_minutes as meeting_type_duration
FROM meeting_slots ms
LEFT JOIN meeting_types mt ON mt.duration_minutes <= ms.max_duration_minutes
WHERE ms.is_available = true 
AND ms.start_time > NOW()
AND mt.is_active = true;

-- Grant permissions for the view
GRANT SELECT ON available_slots_view TO anon, authenticated; 