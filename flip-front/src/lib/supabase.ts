import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ogwykkdepzzrnuqdmphi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yt693QvFnqyC2G1rJtxNyw_KiZmuK6D';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
