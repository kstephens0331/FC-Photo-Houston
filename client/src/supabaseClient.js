import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tygsksukehingcztqvke.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Z3Nrc3VrZWhpbmdjenRxdmtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDE3MDgsImV4cCI6MjA2NDgxNzcwOH0.Tkx1e6KimEnvsQKh2R9I8JVfkc4qH-hWbAc3kZ9a4Io'
export const supabase = createClient(supabaseUrl, supabaseKey)