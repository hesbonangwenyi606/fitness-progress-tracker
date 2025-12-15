import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://toxxaygprrljeevijlzp.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjliOTk0MjFkLTUxZTctNDFhMy05OGFmLWE2MmJjYzI2ZWY1MCJ9.eyJwcm9qZWN0SWQiOiJ0b3h4YXlncHJybGplZXZpamx6cCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY1Nzk4MDUyLCJleHAiOjIwODExNTgwNTIsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.V3B3Sx9Da5KGcO6V3qbRrt8mOjrxO7_IUR8Dhut6G_0';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };