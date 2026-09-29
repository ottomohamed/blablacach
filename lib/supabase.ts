'use client';

import { createClient } from '@supabase/supabase-js';

// التحقق من أن الرابط موجود ويبدأ بـ http، وإلا يتم استخدام الرابط الافتراضي المؤقت لتجاوز البناء
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = (rawUrl && rawUrl.startsWith('http')) ? rawUrl : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = (rawKey && rawKey.length > 10) ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);