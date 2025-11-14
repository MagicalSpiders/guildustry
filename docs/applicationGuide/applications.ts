import { Database } from "./src/types/supabase";
import { supabase } from "./supabase";

// Insert application
export type ApplicationWithRelations = Database['public']['Tables']['applications']['Row'] & {
    jobs?: { title: string };
    candidate_profile?: { fullname: string };
};

export async function insertApplication(
    app: Database['public']['Tables']['applications']['Insert']
): Promise<ApplicationWithRelations> {
    // First check if user already applied to this job
    const { data: existingApp, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('applicant_id', app.applicant_id)
        .eq('job_id', app.job_id)
        .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw checkError;
    }

    if (existingApp) {
        throw new Error('You have already applied to this job');
    }

    // If no existing application, proceed with insertion
    const { data, error } = await supabase
        .from('applications')
        .insert(app)
        .select('*, jobs(title), candidate_profile(fullname)')
        .single();

    if (error) throw error;
    return data as unknown as ApplicationWithRelations;
}

// Update application status (e.g., employer reviews)
export async function updateApplication(
    appId: string,
    updates: Partial<Database['public']['Tables']['applications']['Update']>
) {
    const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', appId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Get own applications
export async function getOwnApplications() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    const { data, error } = await supabase
        .from('applications')
        .select('*, jobs(title, company_id), interviews(*)')
        .eq('applicant_id', user.id)
        .order('submitted_at', { ascending: false })
    if (error) throw error
    return data
}

// Delete application (own only)
export async function deleteApplication(appId: string) {
    const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', appId)
    if (error) throw error
}