import { supabase } from "./supabase";
import type { UserProfile, Company, Job } from "./database.types";

/**
 * Check if current user is an admin
 * Admin role is stored in user_metadata.user_type as "admin"
 */
export async function isAdmin(): Promise<boolean> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return false;
  }

  const userType = user.user_metadata?.user_type || user.user_metadata?.role;
  return userType === "admin";
}

/**
 * Get all candidate profiles (admin only)
 */
export async function getAllCandidates(): Promise<UserProfile[]> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("candidate_profile")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch candidates: ${error.message}`);
  }

  return (data || []) as UserProfile[];
}

/**
 * Get all companies/employers (admin only)
 */
export async function getAllCompanies(): Promise<Company[]> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch companies: ${error.message}`);
  }

  return (data || []) as Company[];
}

/**
 * Get all users from auth.users (admin only)
 * Note: This requires a database function or service role key
 * For now, we combine data from candidate_profile and companies tables
 */
export async function getAllUsers(): Promise<
  Array<{
    id: string;
    email: string;
    user_type: string | null;
    created_at: string;
    last_sign_in_at: string | null;
  }>
> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  // Note: Direct access to auth.users from client is restricted
  // This function combines data from profiles and companies
  // For full user management, you'll need to create a database function
  // or use a Next.js API route with service role key
  
  const [candidates, companies] = await Promise.all([
    getAllCandidates(),
    getAllCompanies(),
  ]);

  // Combine and format user data
  const users = [
    ...candidates.map((c) => ({
      id: c.id,
      email: c.email,
      user_type: "candidate",
      created_at: c.created_at || c.timestamp || "",
      last_sign_in_at: null,
    })),
    ...companies.map((c) => ({
      id: c.owner_id,
      email: c.contact_email || "",
      user_type: "employer",
      created_at: c.created_at || "",
      last_sign_in_at: null,
    })),
  ];

  return users;
}

/**
 * Delete a candidate profile (admin only)
 */
export async function deleteCandidate(candidateId: string): Promise<boolean> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { error } = await supabase
    .from("candidate_profile")
    .delete()
    .eq("id", candidateId);

  if (error) {
    throw new Error(`Failed to delete candidate: ${error.message}`);
  }

  return true;
}

/**
 * Delete a company (admin only)
 */
export async function deleteCompany(companyId: string): Promise<boolean> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", companyId);

  if (error) {
    throw new Error(`Failed to delete company: ${error.message}`);
  }

  return true;
}

/**
 * Delete a user account (admin only)
 * Note: This function deletes the profile/company, not the auth user
 * To delete the auth user, you'll need to use a database function or API route with service role
 */
export async function deleteUserAccount(userId: string): Promise<boolean> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  // Delete candidate profile if exists
  try {
    await supabase.from("candidate_profile").delete().eq("id", userId);
  } catch (err) {
    // Profile might not exist, continue
  }

  // Delete company if exists
  try {
    await supabase.from("companies").delete().eq("owner_id", userId);
  } catch (err) {
    // Company might not exist, continue
  }

  // Note: To delete the actual auth user, you need to:
  // 1. Create a database function with SECURITY DEFINER
  // 2. Or use a Next.js API route with service role key
  // 3. Or use Supabase Admin API directly

  return true;
}

/**
 * Get all jobs with status filter (admin only)
 */
export async function getAllJobs(status?: string | null): Promise<Job[]> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  let query = supabase.from("jobs").select("*").order("posted_date", { ascending: false });

  if (status !== undefined) {
    if (status === null) {
      query = query.is("status", null);
    } else {
      query = query.eq("status", status);
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }

  return (data || []) as Job[];
}

/**
 * Approve a job posting (admin only)
 */
export async function approveJob(jobId: string): Promise<Job> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("jobs")
    .update({ status: "open" })
    .eq("id", jobId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to approve job: ${error.message}`);
  }

  return data as Job;
}

/**
 * Flag a job as inappropriate (admin only)
 */
export async function flagJob(jobId: string, reason?: string): Promise<Job> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("jobs")
    .update({ status: "flagged" })
    .eq("id", jobId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to flag job: ${error.message}`);
  }

  return data as Job;
}

/**
 * Close a job posting (admin only)
 */
export async function closeJob(jobId: string): Promise<Job> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("jobs")
    .update({ status: "closed" })
    .eq("id", jobId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to close job: ${error.message}`);
  }

  return data as Job;
}

/**
 * Get application statistics (admin only)
 */
export async function getApplicationStats(): Promise<{
  total: number;
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
  interviewScheduled: number;
  byTrade: Array<{ trade: string; count: number }>;
  byStatus: Array<{ status: string; count: number }>;
}> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  // Get all applications
  const { data: applications, error } = await supabase
    .from("applications")
    .select("status, jobs(trade_specialty)");

  if (error) {
    throw new Error(`Failed to fetch application stats: ${error.message}`);
  }

  const apps = (applications || []) as Array<{
    status: string;
    jobs: { trade_specialty: string } | null;
  }>;

  // Calculate stats
  const total = apps.length;
  const pending = apps.filter((app) => app.status === "pending").length;
  const reviewed = apps.filter((app) => app.status === "reviewed").length;
  const accepted = apps.filter((app) => app.status === "accepted").length;
  const rejected = apps.filter((app) => app.status === "rejected").length;
  const interviewScheduled = apps.filter(
    (app) => app.status === "interviewScheduled"
  ).length;

  // Group by trade
  const tradeMap = new Map<string, number>();
  apps.forEach((app) => {
    const trade = app.jobs?.trade_specialty || "Unknown";
    tradeMap.set(trade, (tradeMap.get(trade) || 0) + 1);
  });
  const byTrade = Array.from(tradeMap.entries()).map(([trade, count]) => ({
    trade,
    count,
  }));

  // Group by status
  const statusMap = new Map<string, number>();
  apps.forEach((app) => {
    const status = app.status || "unknown";
    statusMap.set(status, (statusMap.get(status) || 0) + 1);
  });
  const byStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));

  return {
    total,
    pending,
    reviewed,
    accepted,
    rejected,
    interviewScheduled,
    byTrade,
    byStatus,
  };
}

/**
 * Get dashboard statistics (admin only)
 */
export async function getAdminDashboardStats(): Promise<{
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  pendingJobs: number;
  openJobs: number;
  totalApplications: number;
  pendingApplications: number;
}> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  // Get counts in parallel
  const [
    candidatesResult,
    companiesResult,
    jobsResult,
    applicationsResult,
  ] = await Promise.all([
    supabase.from("candidate_profile").select("id", { count: "exact", head: true }),
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("jobs").select("id, status", { count: "exact" }),
    supabase.from("applications").select("id, status", { count: "exact" }),
  ]);

  const totalCandidates = candidatesResult.count || 0;
  const totalEmployers = companiesResult.count || 0;
  const totalJobs = jobsResult.count || 0;
  const jobs = (jobsResult.data || []) as Array<{ status: string | null }>;
  const pendingJobs = jobs.filter((job) => job.status === null).length;
  const openJobs = jobs.filter((job) => job.status === "open").length;
  const totalApplications = applicationsResult.count || 0;
  const applications = (applicationsResult.data || []) as Array<{ status: string }>;
  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  ).length;

  return {
    totalCandidates,
    totalEmployers,
    totalJobs,
    pendingJobs,
    openJobs,
    totalApplications,
    pendingApplications,
  };
}

