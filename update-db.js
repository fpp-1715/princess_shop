
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
const envFile = readFileSync('.env.local', 'utf-8');
let url = '', key = '';
envFile.split('\n').forEach(line => {
  if(line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if(line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});
const supabase = createClient(url, key);
async function run() {
  const { data, error } = await supabase.rpc('execute_sql', { sql: 'ALTER TABLE products ADD COLUMN included_products JSONB DEFAULT \'[]\'::jsonb; ALTER TABLE products ADD COLUMN is_customizable BOOLEAN DEFAULT false;' });
  console.log('Result:', data, error);
}
run();
