import { Database } from "./src/types/supabase"
import { supabase } from "./supabase"

// Insert job (employer only, per RLS)
export async function insertJob(job: Database['public']['Tables']['jobs']['Insert']) {
    const { data, error } = await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single()
    if (error) throw error
    return data
}

// Update own job
export async function updateJob(jobId: string, updates: Database['public']['Tables']['jobs']['Update']) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .eq('posted_by', user.id) // RLS enforces
        .select()
        .single()
    if (error) throw error
    return data
}

// Select open jobs (public)
export async function getOpenJobs(limit = 10) {
    const { data, error } = await supabase
        .from('jobs')
        .select('*, company:companies(name), skills')
        .eq('status', 'open')
        .order('posted_date', { ascending: false })
        .limit(limit)
    if (error) throw error
    return data
}

// Select own jobs
export async function getOwnJobs() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
    if (error) throw error
    return data
}

// Upsert job (insert or update if exists)
export async function upsertJob(job: Database['public']['Tables']['jobs']['Insert']) {
    const { data, error } = await supabase
        .from('jobs')
        .upsert(job, { onConflict: 'id' })
        .select()
        .single()
    if (error) throw error
    return data
}

// Delete own job
export async function deleteJob(jobId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('posted_by', user.id)
    if (error) throw error
}