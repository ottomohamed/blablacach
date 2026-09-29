'use client';

import { createClient } from '@supabase/supabase-js';

// استخدام قيم افتراضية صالحة لمرحلة البناء إذا كانت متغيرات البيئة غير معرفة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);