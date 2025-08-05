const { createClient } = require('@supabase/supabase-js');

// Test database connection and RLS policies
async function testDatabase() {
  const supabaseUrl = 'https://jdbqecrmegeykvpqyrtk.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYnFlY3JtZWdleWt2cHF5cnRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzQ5NzI5NywiZXhwIjoyMDQ5MDczMjk3fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // This is a placeholder

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if we can read content_requests
    const { data: requests, error: requestsError } = await supabase
      .from('content_requests')
      .select('*')
      .limit(1);
    
    console.log('Content requests test:', { data: requests, error: requestsError });

    // Test 2: Try to create a test content request
    const { data: newRequest, error: createError } = await supabase
      .from('content_requests')
      .insert({
        title: 'Test Request',
        content_type: 'blog',
        target_keywords: ['test'],
        status: 'pending',
        progress: 0
      })
      .select()
      .single();
    
    console.log('Create request test:', { data: newRequest, error: createError });

    // Test 3: Try to update the request
    if (newRequest) {
      const { data: updatedRequest, error: updateError } = await supabase
        .from('content_requests')
        .update({ status: 'processing', progress: 50 })
        .eq('id', newRequest.id)
        .select()
        .single();
      
      console.log('Update request test:', { data: updatedRequest, error: updateError });

      // Clean up
      await supabase
        .from('content_requests')
        .delete()
        .eq('id', newRequest.id);
    }

  } catch (error) {
    console.error('Database test error:', error);
  }
}

testDatabase(); 