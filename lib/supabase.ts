import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from './_types';

const supabaseUrl = 'https://xesejkymnkekhhmasnei.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlc2Vqa3ltbmtla2hobWFzbmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDc4MDcsImV4cCI6MjA1NzI4MzgwN30.4xwkP6OwiW2xGowcZHpgc4DEe6NXwqT81-lDD3TLkXo';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;