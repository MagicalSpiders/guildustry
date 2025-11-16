# Password Reset Flow Implementation Guide

This document outlines the password reset flow implementation using Supabase Auth.

## Overview

The password reset flow consists of the following steps:
1. User requests a password reset email
2. User receives an email with a reset link
3. User clicks the link and is taken to the update password page
4. User enters and confirms new password
5. Password is updated and user is signed in

## Implementation Steps

### 1. Setup Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Password Reset Request

When user requests a password reset:

```typescript
import { supabase } from './supabaseClient';

async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  
  if (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
  
  return { success: true };
}
```

### 3. Handle Password Reset

On your update password page (e.g., `/pages/update-password.tsx`):

```typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Check for error in URL
      const { error: urlError } = router.query;
      if (urlError) {
        setError('Invalid or expired password reset link');
      }
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) throw updateError;
      
      setMessage('Password updated successfully! Redirecting...');
      
      // Redirect to dashboard after successful password update
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Update Your Password</h1>
      
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
```

## Error Handling

Common errors to handle:
- `invalid_token`: The reset token is invalid or expired
- `rate_limit_exceeded`: Too many password reset requests
- `weak_password`: Password doesn't meet requirements

## Security Considerations

1. Always use HTTPS in production
2. Implement rate limiting on your backend
3. Set secure and httpOnly flags on auth cookies
4. Use password strength requirements
5. Log security events

## Testing

You can test the flow using the `password-reset.test.ts` file, which provides an end-to-end test of the password reset functionality.
