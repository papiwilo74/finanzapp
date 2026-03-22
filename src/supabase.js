import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cgjwpjqhbfjffwsytriz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_oui7xoPD2tP_UkuTYdCb8A_07mEAgcZ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)