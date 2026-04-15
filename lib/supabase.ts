import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xaxlhxyltpepvvptvrzy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheGxoeHlsdHBlcHZ2cHR2cnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDM0NTQsImV4cCI6MjA5MTc3OTQ1NH0.7wDWn7dyOLUDMBD_3-weeuQ2vjYK7GSG9KkVuElTilk'

export const supabase = createClient(supabaseUrl, supabaseKey)
