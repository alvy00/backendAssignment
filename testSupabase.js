import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  try {
    // Test the connection with a simple query (for example, select 1 row from a 'todos' table)
    const { data, error } = await supabase.from('todos').select('*').limit(1);

    if (error) {
      console.error('Supabase query error:', error.message);
      return;
    }

    console.log('Supabase query success:', data);
  } catch (error) {
    console.error('Error initializing Supabase client:', error.message);
  }
}

testSupabase();
