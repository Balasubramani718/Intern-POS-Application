import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vlqhhyplhhpspytcxnfg.supabase.co';  // Your project URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscWhoeXBsaGhwc3B5dGN4bmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDE2ODMsImV4cCI6MjA3MzUxNzY4M30.HVAVxtI8e7T1rp1jcQuH4-Bf2Gw31qw1uzILtsVPPgQ';         // Your anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
