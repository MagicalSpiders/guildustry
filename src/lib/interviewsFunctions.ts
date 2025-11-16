import { supabase } from "./supabase";
import type {
  Interview,
  InterviewInsert,
  InterviewUpdate,
} from "./database.types";
import { createInterviewScheduledNotification } from "./notificationsFunctions";

/**
 * Interview with related data (application and job info)
 */
export type InterviewWithRelations = Interview & {
  applications?: {
    id: string;
    job_id: string;
    applicant_id: string;
    jobs?: {
      id: string;
      title: string;
    };
    candidate_profile?: {
      id: string;
      fullname: string;
      email: string;
    };
  };
};

/**
 * Insert a new interview for an application
 * @param interview - The interview data to insert
 * @returns The created interview with related data
 */
export async function insertInterview(
  interview: InterviewInsert
): Promise<InterviewWithRelations> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to create an interview");
  }

  // Set default status if not provided
  const dataToInsert: InterviewInsert = {
    ...interview,
    status: interview.status || "scheduled",
  };

  const { data, error } = await supabase
    .from("interviews")
    .insert(dataToInsert)
    .select(
      `
      *,
      applications (
        id,
        job_id,
        applicant_id,
        jobs (
          id,
          title
        ),
        candidate_profile (
          id,
          fullname,
          email
        )
      )
    `
    )
    .single();

  if (error) {
    throw new Error(`Failed to create interview: ${error.message}`);
  }

  // Create notification for candidate
  if (data.applications?.applicant_id && data.applications?.jobs?.title) {
    try {
      await createInterviewScheduledNotification(
        data.applications.applicant_id,
        data.id,
        data.applications.jobs.title,
        data.interview_date
      );
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
      // Don't throw error, interview was created successfully
    }
  }

  return data as unknown as InterviewWithRelations;
}

/**
 * Update an existing interview
 * @param interviewId - The interview ID to update
 * @param updates - Partial interview data to update
 * @returns The updated interview
 */
export async function updateInterview(
  interviewId: string,
  updates: InterviewUpdate
): Promise<Interview> {
  const { data, error } = await supabase
    .from("interviews")
    .update(updates)
    .eq("id", interviewId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update interview: ${error.message}`);
  }

  return data;
}

/**
 * Update interview status
 * @param interviewId - The interview ID
 * @param status - The new status
 * @returns The updated interview
 */
export async function updateInterviewStatus(
  interviewId: string,
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
): Promise<Interview> {
  const { data, error } = await supabase
    .from("interviews")
    .update({ status })
    .eq("id", interviewId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update interview status: ${error.message}`);
  }

  return data;
}

/**
 * Get all interviews for a specific application
 * @param applicationId - The application ID
 * @returns Array of interviews for the application
 */
export async function getInterviewsForApplication(
  applicationId: string
): Promise<InterviewWithRelations[]> {
  const { data, error } = await supabase
    .from("interviews")
    .select(
      `
      *,
      applications (
        id,
        job_id,
        applicant_id,
        jobs (
          id,
          title
        ),
        candidate_profile (
          id,
          fullname,
          email
        )
      )
    `
    )
    .eq("application_id", applicationId)
    .order("interview_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch interviews: ${error.message}`);
  }

  return (data || []) as unknown as InterviewWithRelations[];
}

/**
 * Get all interviews for the current candidate
 * @returns Array of candidate's interviews with job info
 */
export async function getInterviewsForCandidate(): Promise<
  InterviewWithRelations[]
> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  // First get all applications for this candidate
  const { data: applications, error: appsError } = await supabase
    .from("applications")
    .select("id")
    .eq("applicant_id", user.id);

  if (appsError) {
    throw new Error(`Failed to fetch applications: ${appsError.message}`);
  }

  if (!applications || applications.length === 0) {
    return [];
  }

  const applicationIds = applications.map((app) => app.id);

  // Then get all interviews for those applications
  const { data, error } = await supabase
    .from("interviews")
    .select(
      `
      *,
      applications (
        id,
        job_id,
        applicant_id,
        jobs (
          id,
          title,
          location,
          company_id
        )
      )
    `
    )
    .in("application_id", applicationIds)
    .order("interview_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch interviews: ${error.message}`);
  }

  return (data || []) as unknown as InterviewWithRelations[];
}

/**
 * Get all interviews for jobs posted by the current employer
 * @returns Array of interviews for employer's jobs
 */
export async function getInterviewsForEmployer(): Promise<
  InterviewWithRelations[]
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
  const { data: applications, error: appsError } = await supabase
    .from("applications")
    .select("id")
    .in("job_id", jobIds);

  if (appsError) {
    throw new Error(`Failed to fetch applications: ${appsError.message}`);
  }

  if (!applications || applications.length === 0) {
    return [];
  }

  const applicationIds = applications.map((app) => app.id);

  // Finally get all interviews for those applications
  const { data, error } = await supabase
    .from("interviews")
    .select(
      `
      *,
      applications (
        id,
        job_id,
        applicant_id,
        jobs (
          id,
          title
        ),
        candidate_profile (
          id,
          fullname,
          email
        )
      )
    `
    )
    .in("application_id", applicationIds)
    .order("interview_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch interviews: ${error.message}`);
  }

  return (data || []) as unknown as InterviewWithRelations[];
}

/**
 * Get a single interview by ID
 * @param interviewId - The interview ID
 * @returns The interview or null if not found
 */
export async function getInterviewById(
  interviewId: string
): Promise<InterviewWithRelations | null> {
  const { data, error } = await supabase
    .from("interviews")
    .select(
      `
      *,
      applications (
        id,
        job_id,
        applicant_id,
        jobs (
          id,
          title
        ),
        candidate_profile (
          id,
          fullname,
          email
        )
      )
    `
    )
    .eq("id", interviewId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch interview: ${error.message}`);
  }

  return data as unknown as InterviewWithRelations;
}

/**
 * Delete an interview
 * @param interviewId - The interview ID to delete
 * @returns True if successful
 */
export async function deleteInterview(interviewId: string): Promise<boolean> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to delete interview");
  }

  const { error } = await supabase
    .from("interviews")
    .delete()
    .eq("id", interviewId);

  if (error) {
    throw new Error(`Failed to delete interview: ${error.message}`);
  }

  return true;
}

/**
 * Get upcoming interviews for the current user (candidate or employer)
 * @param userType - 'candidate' or 'employer'
 * @returns Array of upcoming interviews
 */
export async function getUpcomingInterviews(
  userType: "candidate" | "employer"
): Promise<InterviewWithRelations[]> {
  const now = new Date().toISOString();

  if (userType === "candidate") {
    const interviews = await getInterviewsForCandidate();
    return interviews.filter(
      (interview) =>
        interview.interview_date > now && interview.status === "scheduled"
    );
  } else {
    const interviews = await getInterviewsForEmployer();
    return interviews.filter(
      (interview) =>
        interview.interview_date > now && interview.status === "scheduled"
    );
  }
}

/**
 * Get interview statistics for the current user
 * @param userType - 'candidate' or 'employer'
 * @returns Object with interview counts
 */
export async function getInterviewStats(
  userType: "candidate" | "employer"
): Promise<{
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  upcoming: number;
}> {
  const interviews =
    userType === "candidate"
      ? await getInterviewsForCandidate()
      : await getInterviewsForEmployer();

  const now = new Date().toISOString();

  return {
    total: interviews.length,
    scheduled: interviews.filter((i) => i.status === "scheduled").length,
    completed: interviews.filter((i) => i.status === "completed").length,
    cancelled: interviews.filter((i) => i.status === "cancelled").length,
    upcoming: interviews.filter(
      (i) => i.status === "scheduled" && i.interview_date > now
    ).length,
  };
}

