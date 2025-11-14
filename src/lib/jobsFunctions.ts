import { supabase } from "./supabase";
import { getCompanyByOwner } from "./companyFunctions";

/**
 * Job data types based on JOB_POSTING_FLOW.md requirements
 */
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  job_type: string; // 'full-time' | 'part-time' | 'contract' | 'temporary'
  status: string; // 'open' | 'closed' | 'draft'
  requirements?: string;
  skills?: string[];
  trade_specialty: string;
  posted_by: string; // user ID
  employer_id: string; // user ID
  company_id: string; // company ID
  posted_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobInsert {
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  job_type: string;
  status?: string;
  requirements?: string;
  skills?: string[];
  trade_specialty: string;
  posted_by: string;
  employer_id: string;
  company_id: string;
  posted_date: string;
}

export interface JobUpdate {
  title?: string;
  description?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  job_type?: string;
  status?: string;
  requirements?: string;
  skills?: string[];
  trade_specialty?: string;
}

/**
 * Insert a new job posting
 * @param jobData - The job data to insert
 * @returns The created job or throws an error
 */
export async function insertJob(jobData: JobInsert): Promise<Job> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to post a job");
  }

  // Verify company exists
  const company = await getCompanyByOwner();
  if (!company) {
    throw new Error("Company profile required. Please create a company profile first.");
  }

  // Ensure the posted_by, employer_id, and company_id match authenticated user
  const dataToInsert: JobInsert = {
    ...jobData,
    posted_by: user.id,
    employer_id: user.id,
    company_id: company.id,
    status: jobData.status || "draft", // Default to draft
  };

  const { data, error } = await supabase
    .from("jobs")
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create job: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing job posting
 * @param jobId - The job ID to update
 * @param updates - Partial job data to update
 * @returns The updated job or throws an error
 */
export async function updateJob(
  jobId: string,
  updates: JobUpdate
): Promise<Job> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to update a job");
  }

  // Verify user owns this job
  const { data: existingJob, error: fetchError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("posted_by", user.id)
    .single();

  if (fetchError || !existingJob) {
    throw new Error("Job not found or you don't have permission to update it");
  }

  const { data, error } = await supabase
    .from("jobs")
    .update(updates)
    .eq("id", jobId)
    .eq("posted_by", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update job: ${error.message}`);
  }

  return data;
}

/**
 * Delete a job posting
 * @param jobId - The job ID to delete
 * @returns True if successful, throws error otherwise
 */
export async function deleteJob(jobId: string): Promise<boolean> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to delete a job");
  }

  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("posted_by", user.id);

  if (error) {
    throw new Error(`Failed to delete job: ${error.message}`);
  }

  return true;
}

/**
 * Job with company information
 */
export type JobWithCompany = Job & {
  company?: {
    id: string;
    name: string;
  };
};

/**
 * Get list of open jobs (for candidates to browse)
 * @param limit - Optional limit on number of jobs to return
 * @returns Array of open jobs with company information
 */
export async function getOpenJobs(limit?: number): Promise<JobWithCompany[]> {
  let query = supabase
    .from("jobs")
    .select("*, company:companies(id, name)")
    .eq("status", "open")
    .order("posted_date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch open jobs: ${error.message}`);
  }

  return (data || []) as unknown as JobWithCompany[];
}

/**
 * Get jobs posted by the current user
 * @returns Array of user's jobs
 */
export async function getOwnJobs(): Promise<Job[]> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to get your jobs");
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("posted_by", user.id)
    .order("posted_date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch your jobs: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single job by ID
 * @param jobId - The job ID
 * @returns The job or null if not found
 */
export async function getJobById(jobId: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch job: ${error.message}`);
  }

  return data;
}


