'use client';

import { createClient } from '@supabase/supabase-js';

// وضع قيم افتراضية آمنة تتجاوز مرحلة الـ Build في Vercel إذا كانت المتغيرات غير مقروءة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);