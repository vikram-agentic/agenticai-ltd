-- Enable real-time for generated_content table
ALTER TABLE public.generated_content REPLICA IDENTITY FULL;

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.generated_content;