import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        // Return a dummy client or handle it in the components
        // For build time, we just need it not to crash
        return {} as any;
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}
