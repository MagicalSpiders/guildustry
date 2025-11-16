// notifications.test.ts

import { getUnreadNotifications, markNotificationRead } from './notifications';
import { supabase } from './supabase';

enum NotificationType {
    SystemAlert = 'system_alert',
    JobUpdate = 'job_update',
    ApplicationStatus = 'application_status',
    InterviewReminder = 'interview_reminder',
    CompanyNews = 'company_news'
}

// Test Configuration
const TEST_EMAIL = 'ferryjordan@protonmail.com'; // Using the same email as in company tests
const TEST_PASSWORD = 'letmeinG123!';

// Test data
const TEST_NOTIFICATION = {
    type: NotificationType.ApplicationStatus,
    title: 'Application Update',
    message: 'Your application has been reviewed',
    read: false,
    metadata: { applicationId: 'test-app-123' }
};

// Helper function to clean up test data
async function cleanupTestNotification(notificationId: string) {
    try {
        await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);
    } catch (e) {
        // Ignore if notification doesn't exist
    }
}

async function runNotificationTests() {
    console.log('Starting Notification Functions Tests...');
    let testNotificationId: string | null = null;
    let testUserId: string | null = null;

    try {
        // // --- Test 1: Sign up as test user ---
        // console.log('\n--- 1. Signing up as test user ---');
        // const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        //     email: TEST_EMAIL,
        //     password: TEST_PASSWORD,
        //     options: {
        //         data: {
        //             role: 'candidate',
        //             full_name: 'Test User'
        //         }
        //     }
        // });

        // if (signUpError) {
        //     if (signUpError.message.includes('already registered')) {
        //         console.log('ℹ️ User already exists, proceeding with sign in');
        //     } else {
        //         throw signUpError;
        //     }
        // } else {
        //     console.log('✅ Sign up successful.');
        // }

        // --- Test 2: Sign in ---
        console.log('\n--- 2. Signing in ---');
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
        testUserId = user.id;
        console.log(`✅ Signed in as: ${user.email}`);

        // --- Test 3: Create test notification ---
        console.log('\n--- 3. Creating test notification ---');
        const { data: notificationData, error: notificationError } = await supabase
            .from('notifications')
            .insert([
                {
                    ...TEST_NOTIFICATION as {
                        type: NotificationType;
                        title: string;
                        message: string;
                        read: boolean;
                        metadata: { applicationId: string };
                    },
                    user_id: user.id
                }
            ])
            .select()
            .single();

        if (notificationError) throw notificationError;
        testNotificationId = notificationData.id;
        console.log('✅ Test notification created with ID:', testNotificationId);

        // --- Test 4: Get unread notifications ---
        console.log('\n--- 4. Testing getUnreadNotifications ---');
        const notifications = await getUnreadNotifications();

        if (!notifications || notifications.length === 0) {
            throw new Error('No unread notifications found');
        }

        const testNotification = notifications.find(n => n.id === testNotificationId);
        if (!testNotification) {
            throw new Error('Test notification not found in unread notifications');
        }

        // Verify all fields from the schema
        const requiredFields = ['id', 'user_id', 'type', 'title', 'message', 'read', 'created_at', 'metadata'];
        const missingFields = requiredFields.filter(field => !(field in testNotification));

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields in notification: ${missingFields.join(', ')}`);
        }

        console.log('✅ Retrieved notification with all required fields');
        console.log('   Notification details:', {
            type: testNotification.type,
            title: testNotification.title,
            message: testNotification.message,
            read: testNotification.read,
            created_at: testNotification.created_at
        });

        // --- Test 5: Mark notification as read ---
        console.log('\n--- 5. Testing markNotificationRead ---');
        await markNotificationRead(testNotificationId);

        // Verify the notification is now marked as read
        const { data: updatedNotification } = await supabase
            .from('notifications')
            .select('*')
            .eq('id', testNotificationId)
            .single();

        if (!updatedNotification) {
            throw new Error('Could not verify notification update');
        }

        if (!updatedNotification.read) {
            throw new Error('Notification was not marked as read');
        }

        console.log('✅ Notification marked as read successfully');

        // --- Cleanup ---
        // console.log('\n--- 6. Cleaning up ---');
        if (testNotificationId) {
            // await cleanupTestNotification(testNotificationId);
            // console.log('✅ Test notification cleaned up');
        }

        console.log('\n--- 7. Signing out ---');
        await supabase.auth.signOut();
        console.log('✅ Signed out');

    } catch (error: any) {
        console.error('\n--- 🔴 TEST FAILED ---');
        console.error('Error:', error.message);
    } finally {
        // Cleanup test notification if it still exists
        if (testNotificationId) {
            // console.log('\n🧹 Cleaning up test notification...');
            // await cleanupTestNotification(testNotificationId);
        }

        // Clean up test user if it was created in this session
        if (testUserId) {
            try {
                // await supabase.auth.admin.deleteUser(testUserId);
                // console.log('🧹 Test user cleaned up');
            } catch (e) {
                // Ignore cleanup errors
            }
        }

        console.log('\nAll tests completed.');
    }
}

// Run the tests
runNotificationTests();
