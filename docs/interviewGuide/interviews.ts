import { Database } from "./src/types/supabase"
import { supabase } from "./supabase"

// Insert interview for application
type InterviewWithJobTitle = Database['public']['Tables']['interviews']['Row'] & {
  applications: {
    jobs: {
      title: string
    }
  } | null
}

export async function insertInterview(interview: Database['public']['Tables']['interviews']['Insert']): Promise<InterviewWithJobTitle> {
    const { data, error } = await supabase
        .from('interviews')
        .insert(interview)
        .select(`
            *,
            applications (
                jobs (
                    title
                )
            )
        `)
        .single()
    if (error) throw error
    return data
}

// Update interview status
export async function updateInterviewStatus(interviewId: string, status: Database['public']['Enums']['interview_status']) {
    const { data, error } = await supabase
        .from('interviews')
        .update({ status })
        .eq('id', interviewId)
        .select()
        .single()
    if (error) throw error
    return data
}