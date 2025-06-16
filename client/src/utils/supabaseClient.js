import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://atipokknjidtpidpkeej.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aXBva2tuamlkdHBpZHBrZWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDg1MDgsImV4cCI6MjA2NTUyNDUwOH0.B14a63cYxnsYUS-v8URJhPn3hq3jZO769G-lQSh8uso'
export const supabase = createClient(supabaseUrl, supabaseKey)