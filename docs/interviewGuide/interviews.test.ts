import { insertInterview, updateInterviewStatus } from './interviews';
import { supabase } from './supabase';

// Test Configuration
const TEST_EMAIL = 'imanmj23@gmail.com';
const TEST_PASSWORD = 'letmeinG123!';

// Replace with an existing application ID from your database
const EXISTING_APPLICATION_ID = 'dafce1d9-a48f-4a0f-8510-da4db4425af6'; // From your test run

// Test interview data
const INTERVIEW_DATA = {
    interview_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled' as const,
    type: 'phone' as const,
    notes: 'Technical interview with the engineering team',
    location: 'remote',
    interviewers: ['120ce4d1-b302-4981-acbb-e4dec2f0fb45']
};

async function testInterviewManagement() {
    try {
        console.log('Starting interview management test...');

        // Step 1: Sign in
        console.log('\n1. Signing in...');
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });

        if (signInError) throw new Error(`Sign in failed: ${signInError.message}`);
        if (!user) throw new Error('No user returned after sign in');
        console.log(`✅ Signed in as: ${user.email}`);

        // Step 2: Create interview for existing application
        console.log('\n2. Creating interview for existing application...');
        const interview = await insertInterview({
            ...INTERVIEW_DATA,
            application_id: EXISTING_APPLICATION_ID,
        });

        console.log('✅ Interview created successfully!');
        console.log('Interview ID:', interview.id);
        console.log('Status:', interview.status);
        console.log('For Application ID:', interview.application_id);

        // Step 3: Update interview status
        console.log('\n3. Updating interview status...');
        const updatedInterview = await updateInterviewStatus(interview.id, 'completed');
        console.log('✅ Interview status updated to:', updatedInterview.status);

        // Step 4: Clean up (optional - comment out if you want to keep the test data)
        console.log('\n4. Cleaning up...');
        await supabase.from('interviews').delete().eq('id', interview.id);
        console.log('✅ Test interview deleted');

        // Step 5: Sign out
        console.log('\n5. Signing out...');
        await supabase.auth.signOut();
        console.log('✅ Signed out');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        throw error;
    }
}

// Run the test
testInterviewManagement().catch(console.error);
