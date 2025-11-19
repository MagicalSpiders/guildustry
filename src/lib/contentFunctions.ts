import { supabase } from "./supabase";

/**
 * Trade content type
 */
export interface TradeContent {
  id: string;
  title: string;
  icon: string;
  salary: string;
  overview: string;
  dayToDay: string;
  workingEnvironment: string;
  applications: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Resource content type
 */
export interface ResourceContent {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  url?: string | null;
  category?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Partner organization type
 */
export interface PartnerOrg {
  id: string;
  name: string;
  description: string;
  website_url: string | null;
  logo_url: string | null;
  category: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Check if current user is an admin
 */
async function isAdmin(): Promise<boolean> {
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
 * Get all trade content
 */
export async function getAllTrades(): Promise<TradeContent[]> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("trade_content")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch trades: ${error.message}`);
  }

  return (data || []) as TradeContent[];
}

/**
 * Insert a new trade content
 */
export async function insertTrade(trade: Omit<TradeContent, "id" | "created_at" | "updated_at">): Promise<TradeContent> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("trade_content")
    .insert(trade as any)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create trade: ${error.message}`);
  }

  return data as TradeContent;
}

/**
 * Update trade content
 */
export async function updateTrade(
  tradeId: string,
  updates: Partial<Omit<TradeContent, "id" | "created_at" | "updated_at">>
): Promise<TradeContent> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("trade_content")
    .update(updates)
    .eq("id", tradeId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update trade: ${error.message}`);
  }

  return data as TradeContent;
}

/**
 * Delete trade content
 */
export async function deleteTrade(tradeId: string): Promise<boolean> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { error } = await supabase
    .from("trade_content")
    .delete()
    .eq("id", tradeId);

  if (error) {
    throw new Error(`Failed to delete trade: ${error.message}`);
  }

  return true;
}

/**
 * Get all resource content
 */
export async function getAllResources(): Promise<ResourceContent[]> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("resource_content")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch resources: ${error.message}`);
  }

  return (data || []) as ResourceContent[];
}

/**
 * Insert a new resource content
 */
export async function insertResource(
  resource: Omit<ResourceContent, "id" | "created_at" | "updated_at">
): Promise<ResourceContent> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("resource_content")
    .insert(resource as any)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create resource: ${error.message}`);
  }

  return data as ResourceContent;
}

/**
 * Update resource content
 */
export async function updateResource(
  resourceId: string,
  updates: Partial<Omit<ResourceContent, "id" | "created_at" | "updated_at">>
): Promise<ResourceContent> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("resource_content")
    .update(updates)
    .eq("id", resourceId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update resource: ${error.message}`);
  }

  return data as ResourceContent;
}

/**
 * Delete resource content
 */
export async function deleteResource(resourceId: string): Promise<boolean> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { error } = await supabase
    .from("resource_content")
    .delete()
    .eq("id", resourceId);

  if (error) {
    throw new Error(`Failed to delete resource: ${error.message}`);
  }

  return true;
}

/**
 * Get all partner organizations
 */
export async function getAllPartnerOrgs(): Promise<PartnerOrg[]> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("partner_orgs")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch partner orgs: ${error.message}`);
  }

  return (data || []) as PartnerOrg[];
}

/**
 * Insert a new partner organization
 */
export async function insertPartnerOrg(
  org: Omit<PartnerOrg, "id" | "created_at" | "updated_at">
): Promise<PartnerOrg> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("partner_orgs")
    .insert(org as any)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create partner org: ${error.message}`);
  }

  return data as PartnerOrg;
}

/**
 * Update partner organization
 */
export async function updatePartnerOrg(
  orgId: string,
  updates: Partial<Omit<PartnerOrg, "id" | "created_at" | "updated_at">>
): Promise<PartnerOrg> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { data, error } = await supabase
    .from("partner_orgs")
    .update(updates)
    .eq("id", orgId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update partner org: ${error.message}`);
  }

  return data as PartnerOrg;
}

/**
 * Delete partner organization
 */
export async function deletePartnerOrg(orgId: string): Promise<boolean> {
  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  const { error } = await supabase
    .from("partner_orgs")
    .delete()
    .eq("id", orgId);

  if (error) {
    throw new Error(`Failed to delete partner org: ${error.message}`);
  }

  return true;
}

