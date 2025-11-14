import { insertJob } from './jobsFunctions';
import { supabase } from './supabase';
import { getCompanyByOwner } from './companyFuntions';

// Test Configuration
const TEST_EMAIL = 'ferryjordan@protonmail.com'; // Using the same email as in company tests
const TEST_PASSWORD = 'letmeinG123!';

// Test job data
const JOB_DATA = {
    title: 'Senior Carpenter',
    description: 'Looking for an experienced carpenter with expertise in custom woodworking and cabinetry.',
    location: 'New York, NY',
    salary_min: 60000,
    salary_max: 80000,
    job_type: 'full-time' as const,
    status: 'open' as const,
    requirements: 'Minimum 5 years of experience in carpentry. Must have own tools and reliable transportation.',
    skills: ['carpentry', 'woodworking', 'blueprint reading'],
    trade_specialty: 'Custom Woodworking',
    matching_preferences: {
        experience_level: 60,
        certification_required: 30,
        work_authorization: 10
    }
};

async function createJobPosting() {
    try {
        console.log('Starting job posting test...');
        
        // Step 1: Sign in
        console.log('\n1. Signing in...');
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });

        if (signInError) {
            throw new Error(`Sign in failed: ${signInError.message}`);
        }
        
        if (!user) {
            throw new Error('No user returned after sign in');
        }
        
        console.log(`✅ Signed in as: ${user.email}`);

        // Step 2: Get user's company
        console.log('\n2. Getting company info...');
        const company = await getCompanyByOwner(user.id);
        
        if (!company) {
            throw new Error('No company found for this user. Please create a company first.');
        }
        
        console.log(`✅ Found company: ${company.name} (ID: ${company.id})`);

        // Step 3: Create job
        console.log('\n3. Creating job posting...');
        const jobData = {
            ...JOB_DATA,
            posted_by: user.id,
            employer_id: user.id,
            company_id: company.id,
            posted_date: new Date().toISOString()
        };

        const newJob = await insertJob(jobData);
        console.log('✅ Job created successfully!');
        console.log('Job ID:', newJob.id);
        console.log('Job Title:', newJob.title);
        
        // Step 4: Sign out
        console.log('\n3. Signing out...');
        await supabase.auth.signOut();
        console.log('✅ Signed out');
        
    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        throw error;
    }
}

// Run the job posting test
createJobPosting().catch(console.error);
