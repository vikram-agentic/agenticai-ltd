CREATE OR REPLACE FUNCTION get_available_slots(start_date_param TEXT, end_date_param TEXT)
RETURNS TABLE(
    id TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    is_available BOOLEAN,
    max_duration_minutes INT
) AS $$
DECLARE
    start_date TIMESTAMPTZ;
    end_date TIMESTAMPTZ;
    day_of_week_num INT;
    current_day TIMESTAMPTZ;
    availability_record RECORD;
    time_iter TIMESTAMPTZ;
    slot_start_time TIMESTAMPTZ;
    slot_end_time TIMESTAMPTZ;
    existing_slot_record RECORD;
BEGIN
    start_date := start_date_param::TIMESTAMPTZ;
    end_date := end_date_param::TIMESTAMPTZ;

    -- Ensure default availability exists if none is configured
    IF NOT EXISTS (SELECT 1 FROM admin_availability WHERE is_available = true) THEN
        INSERT INTO admin_availability (day_of_week, start_time, end_time, is_available)
        VALUES
            (1, '09:00:00', '17:00:00', true),
            (2, '09:00:00', '17:00:00', true),
            (3, '09:00:00', '17:00:00', true),
            (4, '09:00:00', '17:00:00', true),
            (5, '09:00:00', '17:00:00', true);
    END IF;

    FOR current_day IN SELECT generate_series(start_date, end_date, '1 day'::interval) LOOP
        day_of_week_num := EXTRACT(ISODOW FROM current_day); -- Monday is 1, Sunday is 7

        FOR availability_record IN SELECT * FROM admin_availability WHERE day_of_week = day_of_week_num AND is_available = true LOOP
            slot_start_time := current_day::DATE + availability_record.start_time;
            slot_end_time := current_day::DATE + availability_record.end_time;

            FOR time_iter IN SELECT generate_series(slot_start_time, slot_end_time - '1 hour'::interval, '1 hour'::interval) LOOP
                -- Check if a slot already exists
                SELECT * INTO existing_slot_record FROM meeting_slots WHERE meeting_slots.start_time = time_iter;

                IF FOUND THEN
                    -- Check if the existing slot is booked
                    IF existing_slot_record.is_available AND NOT EXISTS (
                        SELECT 1 FROM meeting_bookings 
                        WHERE slot_id = existing_slot_record.id AND status IN ('confirmed', 'rescheduled')
                    ) THEN
                        id := existing_slot_record.id::TEXT;
                        start_time := existing_slot_record.start_time;
                        end_time := existing_slot_record.end_time;
                        is_available := true;
                        max_duration_minutes := existing_slot_record.max_duration_minutes;
                        RETURN NEXT;
                    END IF;
                ELSE
                    -- Slot does not exist, so it's available
                    id := to_char(time_iter, 'YYYY-MM-DD-HH24-MI');
                    start_time := time_iter;
                    end_time := time_iter + '1 hour'::interval;
                    is_available := true;
                    max_duration_minutes := 60;
                    RETURN NEXT;
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
