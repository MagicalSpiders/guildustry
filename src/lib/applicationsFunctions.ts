import { supabase } from "./supabase";
import type {
  Application,
  ApplicationInsert,
  ApplicationUpdate,
} from "./database.types";

/**
 * Application with related data (job and candidate profile)
 */
export type ApplicationWithRelations = Application & {
  jobs?: {
    id: string;
    title: string;
    company_id: string;
    location: string;
    salary_min: number;
    salary_max: number;
    trade_specialty: string;
    job_type: string;
    posted_date: string;
  };
  candidate_profile?: {
    id: string;
    fullname: string;
    email: string;
    phone_number: string;
    city: string;
    state: string;
    primary_trade: string;
    years_of_experience: number;
    resume_file_url: string | null;
  };
};

/**
 * Insert a new job application
 * Prevents duplicate applications from the same candidate for the same job
 * @param app - The application data to insert
 * @returns The created application with related data
 */
export async function insertApplication(
  app: ApplicationInsert
): Promise<ApplicationWithRelations> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to submit an application");
  }

  // Ensure applicant_id matches authenticated user
  const dataToInsert: ApplicationInsert = {
    ...app,
    applicant_id: user.id,
    status: app.status || "pending",
  };

  // First check if user already applied to this job
  const { data: existingApp, error: checkError } = await supabase
    .from("applications")
    .select("id")
    .eq("applicant_id", user.id)
    .eq("job_id", app.job_id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 = no rows returned (expected if no duplicate)
    throw new Error(`Failed to check for existing application: ${checkError.message}`);
  }

  if (existingApp) {
    throw new Error("You have already applied to this job");
  }

  // If no existing application, proceed with insertion
  const { data, error } = await supabase
    .from("applications")
    .insert(dataToInsert)
    .select(
      "*, jobs(id, title, company_id, location, salary_min, salary_max, trade_specialty, job_type, posted_date), candidate_profile(id, fullname, email, phone_number, city, state, primary_trade, years_of_experience, resume_file_url)"
    )
    .single();

  if (error) {
    throw new Error(`Failed to submit application: ${error.message}`);
  }

  return data as unknown as ApplicationWithRelations;
}

/**
 * Update application status (e.g., employer reviews)
 * @param appId - The application ID to update
 * @param updates - Partial application data to update
 * @returns The updated application
 */
export async function updateApplication(
  appId: string,
  updates: ApplicationUpdate
): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", appId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update application: ${error.message}`);
  }

  return data;
}

/**
 * Get all applications for the currently authenticated user (candidate)
 * @returns Array of applications with related job and profile data
 */
export async function getOwnApplications(): Promise<ApplicationWithRelations[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("applications")
    .select(
      "*, jobs(id, title, company_id, location, salary_min, salary_max, trade_specialty, job_type, posted_date), candidate_profile(id, fullname, email, phone_number, city, state, primary_trade, years_of_experience, resume_file_url)"
    )
    .eq("applicant_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }

  return (data || []) as unknown as ApplicationWithRelations[];
}

/**
 * Get all applications for a specific job (employer view)
 * @param jobId - The job ID
 * @returns Array of applications with candidate profile data
 */
export async function getApplicationsByJobId(
  jobId: string
): Promise<ApplicationWithRelations[]> {
  const { data, error } = await supabase
    .from("applications")
    .select(
      "*, candidate_profile(id, fullname, email, phone_number, city, state, primary_trade, years_of_experience, resume_file_url)"
    )
    .eq("job_id", jobId)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }

  return (data || []) as unknown as ApplicationWithRelations[];
}

/**
 * Get all applications for jobs posted by the current employer
 * @returns Array of applications with job and candidate profile data
 */
export async function getApplicationsForEmployer(): Promise<
  ApplicationWithRelations[]
> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  // First get all jobs posted by this employer
  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id")
    .eq("employer_id", user.id);

  if (jobsError) {
    throw new Error(`Failed to fetch employer jobs: ${jobsError.message}`);
  }

  if (!jobs || jobs.length === 0) {
    return [];
  }

  const jobIds = jobs.map((job) => job.id);

  // Then get all applications for those jobs
  const { data, error } = await supabase
    .from("applications")
    .select(
      "*, jobs(id, title, company_id, location, salary_min, salary_max, trade_specialty, job_type, posted_date), candidate_profile(id, fullname, email, phone_number, city, state, primary_trade, years_of_experience, resume_file_url)"
    )
    .in("job_id", jobIds)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }

  return (data || []) as unknown as ApplicationWithRelations[];
}

/**
 * Delete application (own only for candidates)
 * @param appId - The application ID to delete
 * @returns True if successful, throws error otherwise
 */
export async function deleteApplication(appId: string): Promise<boolean> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to delete an application");
  }

  // Verify user owns this application
  const { data: existingApp, error: fetchError } = await supabase
    .from("applications")
    .select("applicant_id")
    .eq("id", appId)
    .single();

  if (fetchError || !existingApp) {
    throw new Error("Application not found");
  }

  if (existingApp.applicant_id !== user.id) {
    throw new Error("You don't have permission to delete this application");
  }

  const { error } = await supabase.from("applications").delete().eq("id", appId);

  if (error) {
    throw new Error(`Failed to delete application: ${error.message}`);
  }

  return true;
}


