import { supabase } from "./supabase";
import type { Company, CompanyInsert, CompanyUpdate } from "./database.types";

/**
 * Insert a new company profile for an employer
 * @param companyData - The company data to insert
 * @returns The created company or throws an error
 */
export async function insertCompany(
  companyData: CompanyInsert
): Promise<Company> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to create a company");
  }

  // Ensure the owner_id matches the authenticated user
  const dataToInsert: CompanyInsert = {
    ...companyData,
    owner_id: user.id,
  };

  const { data, error } = await supabase
    .from("companies")
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A company already exists for this user");
    }
    throw new Error(`Failed to create company: ${error.message}`);
  }

  return data;
}

/**
 * Update the current user's company
 * @param updates - Partial company data to update
 * @returns The updated company or throws an error
 */
export async function updateCompany(updates: CompanyUpdate): Promise<Company> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to update company");
  }

  const { data, error } = await supabase
    .from("companies")
    .update(updates)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update company: ${error.message}`);
  }

  if (!data) {
    throw new Error("Company not found");
  }

  return data;
}

/**
 * Get the current user's company
 * @returns The user's company or null if not found
 */
export async function getCompanyByOwner(): Promise<Company | null> {
  console.log("🔍 getCompanyByOwner: Starting to fetch company...");

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("❌ getCompanyByOwner: User not authenticated", {
      authError,
    });
    throw new Error("User must be authenticated to get company");
  }

  console.log("✅ getCompanyByOwner: User authenticated", {
    userId: user.id,
    userEmail: user.email,
  });

  console.log(
    "🔍 getCompanyByOwner: Querying companies table with owner_id:",
    user.id
  );
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No company found
      console.log(
        "⚠️ getCompanyByOwner: No company found for owner_id:",
        user.id
      );
      return null;
    }
    console.error("❌ getCompanyByOwner: Error fetching company", {
      errorCode: error.code,
      errorMessage: error.message,
      ownerId: user.id,
    });
    throw new Error(`Failed to fetch company: ${error.message}`);
  }

  console.log("✅ getCompanyByOwner: Company found", {
    companyId: data?.id,
    companyName: data?.name,
    ownerId: data?.owner_id,
  });

  return data;
}

/**
 * Get a company by its ID
 * @param companyId - The company ID
 * @returns The company or null if not found
 */
export async function getCompanyById(
  companyId: string
): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch company: ${error.message}`);
  }

  return data;
}

/**
 * Delete the current user's company
 * @returns True if successful, throws error otherwise
 */
export async function deleteCompany(): Promise<boolean> {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User must be authenticated to delete company");
  }

  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(`Failed to delete company: ${error.message}`);
  }

  return true;
}

/**
 * Upload a company logo file to Supabase Storage
 * @param file - The logo file to upload
 * @param companyId - The company's ID
 * @returns The public URL of the uploaded file
 */
export async function uploadCompanyLogo(
  file: File,
  companyId: string
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${companyId}_${Date.now()}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("company-assets")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload logo: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from("company-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Delete a company logo file from Supabase Storage
 * @param fileUrl - The URL of the file to delete
 * @returns True if successful, throws error otherwise
 */
export async function deleteCompanyLogo(fileUrl: string): Promise<boolean> {
  // Extract the file path from the URL
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split("/");
  const filePath = pathParts.slice(pathParts.indexOf("logos")).join("/");

  const { error } = await supabase.storage
    .from("company-assets")
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete logo: ${error.message}`);
  }

  return true;
}

/**
 * List all files for a company
 * @param companyId - The company ID
 * @param folder - Optional folder to list files from (e.g., 'logos')
 * @returns Array of file metadata with public URLs
 */
export async function listCompanyFiles(
  companyId: string,
  folder?: string
): Promise<Array<{ name: string; url: string }>> {
  const path = folder ? `${folder}` : "";

  const { data: files, error } = await supabase.storage
    .from("company-assets")
    .list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  // Filter files for this company and generate public URLs
  const companyFiles = files
    .filter((file) => file.name.startsWith(companyId))
    .map((file) => {
      const filePath = folder ? `${folder}/${file.name}` : file.name;
      const { data } = supabase.storage
        .from("company-assets")
        .getPublicUrl(filePath);

      return {
        name: file.name,
        url: data.publicUrl,
      };
    });

  return companyFiles;
}

/**
 * Get company with all associated files
 * @param companyId - The company ID
 * @returns Company data with files
 */
export async function getCompanyWithFiles(
  companyId: string
): Promise<Company & { files: Array<{ name: string; url: string }> }> {
  const company = await getCompanyById(companyId);

  if (!company) {
    throw new Error("Company not found");
  }

  const files = await listCompanyFiles(companyId);

  return {
    ...company,
    files,
  };
}
