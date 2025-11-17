import { supabase } from './supabase';
import type { UserProfile, UserProfileInsert, UserProfileUpdate } from './database.types';

/**
 * Insert a new candidate profile
 * @param profileData - The profile data to insert
 * @returns The created profile or throws an error
 */
export async function insertUserProfile(profileData: UserProfileInsert): Promise<UserProfile> {
  console.log('[Profile] Creating new profile...');
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('[Profile] Auth error:', authError?.message);
    throw new Error('User must be authenticated to create a profile');
  }

  // Ensure the profile ID and created_by match the authenticated user
  const dataToInsert: UserProfileInsert = {
    ...profileData,
    id: user.id,
    created_by: user.id,
  };

  console.log('[Profile] Inserting profile data');
  const { data, error } = await supabase
    .from('candidate_profile')
    .insert(dataToInsert as any)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      console.error('[Profile] Duplicate profile detected');
      throw new Error('A profile already exists for this user');
    }
    console.error('[Profile] Insert error:', error.message);
    throw new Error(`Failed to create profile: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to create profile: No data returned');
  }

  console.log('[Profile] Profile created successfully');
  return data as UserProfile;
}

/**
 * Update the current user's profile
 * @param updates - Partial profile data to update
 * @returns The updated profile or throws an error
 */
export async function updateUserProfile(updates: UserProfileUpdate): Promise<UserProfile> {
  console.log('[Profile] Updating profile...');
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('[Profile] Auth error:', authError?.message);
    throw new Error('User must be authenticated to update profile');
  }

  const { data, error } = await (supabase
    .from('candidate_profile') as any)
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('[Profile] Update error:', error.message);
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  if (!data) {
    console.error('[Profile] Profile not found');
    throw new Error('Profile not found');
  }

  console.log('[Profile] Profile updated successfully');
  return data as UserProfile;
}

/**
 * Get the current user's profile
 * @returns The user's profile or null if not found
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User must be authenticated to get profile');
  }

  const { data, error } = await supabase
    .from('candidate_profile')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found
      return null;
    }
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
}

/**
 * Delete the current user's profile
 * @returns True if successful, throws error otherwise
 */
export async function deleteUserProfile(): Promise<boolean> {
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User must be authenticated to delete profile');
  }

  const { error } = await supabase
    .from('candidate_profile')
    .delete()
    .eq('id', user.id);

  if (error) {
    throw new Error(`Failed to delete profile: ${error.message}`);
  }

  return true;
}

/**
 * Upload a resume file to Supabase Storage
 * @param file - The resume file to upload
 * @param userId - The user's ID
 * @returns The public URL of the uploaded file
 */
export async function uploadResume(file: File, userId: string): Promise<string> {
  console.log('[Profile] Uploading resume:', file.name);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `resumes/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('resume')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('[Profile] Resume upload error:', uploadError.message);
    throw new Error(`Failed to upload resume: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from('resume')
    .getPublicUrl(filePath);

  console.log('[Profile] Resume uploaded successfully');
  return data.publicUrl;
}

/**
 * Delete a resume file from Supabase Storage
 * @param fileUrl - The URL of the file to delete
 * @returns True if successful, throws error otherwise
 */
export async function deleteResume(fileUrl: string): Promise<boolean> {
  // Extract the file path from the URL
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split('/');
  const filePath = pathParts.slice(pathParts.indexOf('resumes')).join('/');

  const { error } = await supabase.storage
    .from('resume')
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete resume: ${error.message}`);
  }

  return true;
}

