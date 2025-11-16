/**
 * Password Reset Test Utility
 * 
 * This file contains test utilities and examples for implementing the password reset flow.
 * It's designed to help developers understand and test the password reset functionality.
 */

import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configuration
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const NEW_PASSWORD = 'newSecurePass123!';
const RESET_REDIRECT_URL = 'http://localhost:3000/update-password';

/**
 * Extracts token and type from a password reset URL
 * @param url The reset password URL from the email
 * @returns Object containing token and type, or null if invalid
 */
function extractTokenFromUrl(url: string): { token: string; type: string } | null {
    try {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        const token = params.get('token');
        const type = params.get('type');
        
        if (!token || !type) return null;
        
        return { token, type };
    } catch (e) {
        return null;
    }
}

/**
 * Sends a password reset email to the specified address
 * @param email The user's email address
 * @param redirectTo URL to redirect to after password reset
 */
export async function sendPasswordResetEmail(email: string, redirectTo: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
    });

    if (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }

    return { success: true };
}

/**
 * Updates the user's password
 * @param newPassword The new password to set
 */
export async function updateUserPassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error('Error updating password:', error);
        throw error;
    }

    return { success: true };
}

/**
 * Verifies if a password reset token is valid
 * @param token The token to verify
 */
async function verifyPasswordResetToken(token: string) {
    try {
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery',
        });

        if (error) throw error;
        return { valid: true, data };
    } catch (error) {
        console.error('Error verifying token:', error);
        return { valid: false, error };
    }
}

/**
 * Example implementation of the password reset flow
 * This is for demonstration and testing purposes
 */
async function testPasswordResetFlow() {
    try {
        // 1. Request password reset email
        console.log(`Sending password reset email to ${TEST_EMAIL}...`);
        await sendPasswordResetEmail(TEST_EMAIL, RESET_REDIRECT_URL);
        console.log('Password reset email sent successfully!');
        
        // In a real app, the user would click the link in their email
        // For testing, we'll simulate the next steps
        
        // 2. Extract token from URL (in a real app, this would be from the email link)
        const mockResetLink = `${RESET_REDIRECT_URL}?token=mock-token&type=recovery`;
        const tokenData = extractTokenFromUrl(mockResetLink);
        
        if (!tokenData) {
            throw new Error('Invalid reset link');
        }
        
        // 3. Verify the token (in a real app, this would happen when the page loads)
        const { valid } = await verifyPasswordResetToken(tokenData.token);
        
        if (!valid) {
            throw new Error('Invalid or expired reset token');
        }
        
        // 4. Update the password (in a real app, this would be after user submits the form)
        await updateUserPassword(NEW_PASSWORD);
        console.log('Password updated successfully!');
        
        // 5. Sign in with the new password to verify it works
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: TEST_EMAIL,
            password: NEW_PASSWORD,
        });
        
        if (signInError) throw signInError;
        
        console.log('Successfully signed in with the new password!');
        
    } catch (error) {
        console.error('Password reset flow failed:', error);
        throw error;
    }
}

// Uncomment to run the test
// testPasswordResetFlow().catch(console.error);

// Export all the utility functions for use in your application
export const passwordResetUtils = {
    sendPasswordResetEmail,
    updateUserPassword,
    verifyPasswordResetToken,
    extractTokenFromUrl,
};
