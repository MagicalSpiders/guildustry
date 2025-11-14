import { getOpenJobs } from './jobsFunctions';
import { insertApplication, getOwnApplications, ApplicationWithRelations } from './applications';
import { supabase } from './supabase';
import { Database } from './src/types/supabase';

type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];

// Test Configuration
const CANDIDATE_EMAIL = 'imanmj23@gmail.com';
const CANDIDATE_PASSWORD = 'letmeinG123!';

async function testCandidateApplication() {
    try {
        console.log('Starting candidate application test...');

        // Step 1: Sign in as candidate
        console.log('\n1. Signing in as candidate...');
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
            email: CANDIDATE_EMAIL,
            password: CANDIDATE_PASSWORD,
        });

        if (signInError) {
            throw new Error(`Sign in failed: ${signInError.message}`);
        }

        if (!user) {
            throw new Error('No user returned after sign in');
        }

        console.log(`✅ Signed in as: ${user.email}`);

        // Step 2: Get all open jobs
        console.log('\n2. Fetching open jobs...');
        const jobs = await getOpenJobs();

        if (jobs.length === 0) {
            throw new Error('No open jobs found to apply to');
        }

        console.log(`✅ Found ${jobs.length} open jobs`);

        // Select the first job to apply to
        const jobToApply = jobs[0];
        if (!jobToApply) {
            throw new Error('No jobs available to apply to');
        }

        console.log(`\n3. Selected job to apply: ${jobToApply.title} (ID: ${jobToApply.id})`);

        // Step 3: Submit application
        console.log('\n4. Submitting application...');
        const applicationData: ApplicationInsert = {
            job_id: jobToApply.id,
            applicant_id: user.id,
            status: 'pending',
            cover_letter: 'I am excited to apply for this position. I have relevant experience and skills.',
            resume_url: `https://example.com/resumes/${user.id}.pdf`, // In a real app, upload resume first
            submitted_at: new Date().toISOString()
        };

        const newApplication = await insertApplication(applicationData);
        console.log('✅ Application submitted successfully!');
        console.log('Application ID:', newApplication.id);

        // Step 4: Verify application was created
        console.log('\n5. Verifying application...');
        const myApplications = await getOwnApplications();
        const myApplication = myApplications.find((app: ApplicationWithRelations) => app.id === newApplication.id);

        if (!myApplication) {
            throw new Error('Application not found in my applications list');
        }

        console.log('✅ Application verified in my applications list');

        // Step 5: Sign out
        console.log('\n6. Signing out...');
        await supabase.auth.signOut();
        console.log('✅ Signed out');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        throw error;
    }
}

// Run the test
testCandidateApplication().catch(console.error);
