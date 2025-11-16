import { supabase } from "./supabase"

// Get unread notifications
export async function getUnreadNotifications() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

// Mark as read
export async function markNotificationRead(notifId: string) {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notifId)
    if (error) throw error
}