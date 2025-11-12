/**
 * Role-based routing utilities
 * Provides consistent URL generation based on user role
 */

export type UserRole = "candidate" | "employer" | undefined;

/**
 * Get the dashboard URL based on user role
 */
export function getDashboardRoute(role: UserRole): string {
  if (role === "candidate") {
    return "/candidate/dashboard";
  } else if (role === "employer") {
    return "/employer/dashboard";
  }
  return "/dashboard";
}

/**
 * Get the jobs URL based on user role
 */
export function getJobsRoute(role: UserRole): string {
  if (role === "candidate") {
    return "/candidate/jobs";
  } else if (role === "employer") {
    return "/employer/jobs";
  }
  // Fallback to candidate jobs if role is undefined
  return "/candidate/jobs";
}

/**
 * Get the applicants URL based on user role
 */
export function getApplicantsRoute(role: UserRole): string {
  if (role === "candidate") {
    return "/candidate/applications";
  } else if (role === "employer") {
    return "/employer/applicants";
  }
  // Fallback to candidate applications if role is undefined
  return "/candidate/applications";
}

/**
 * Get the resources URL (candidate only)
 */
export function getResourcesRoute(role: UserRole): string {
  if (role === "candidate") {
    return "/candidate/resources";
  }
  return "/candidate/resources"; // Default to candidate even if role is undefined
}

/**
 * Get the profile URL based on user role
 */
export function getProfileRoute(role: UserRole): string {
  if (role === "candidate") {
    return "/candidate/profile";
  } else if (role === "employer") {
    return "/employer/profile";
  }
  return "/profile";
}

/**
 * Get the notifications URL based on user role
 */
export function getNotificationsRoute(role: UserRole): string {
  if (role === "employer") {
    return "/employer/notifications";
  }
  // Fallback to employer notifications if role is undefined
  return "/employer/notifications";
}

/**
 * Get all routes for a specific role
 */
export function getRoutesForRole(role: UserRole) {
  return {
    dashboard: getDashboardRoute(role),
    jobs: getJobsRoute(role),
    applicants: getApplicantsRoute(role),
    resources: getResourcesRoute(role),
    profile: getProfileRoute(role),
    notifications: getNotificationsRoute(role),
  };
}
