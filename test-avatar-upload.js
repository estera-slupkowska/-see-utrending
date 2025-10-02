// Test script to verify avatar upload functionality
// Run this in browser console on your development site

async function testAvatarUpload() {
  console.log('🧪 Testing Avatar Upload Integration...')

  // Check if Supabase client is available
  if (typeof window !== 'undefined' && window.supabase) {
    console.log('✅ Supabase client found')

    // Test storage bucket access
    try {
      const { data: buckets, error } = await window.supabase.storage.listBuckets()
      console.log('📦 Available buckets:', buckets)

      if (buckets?.find(b => b.name === 'avatars')) {
        console.log('✅ Avatars bucket found!')
      } else {
        console.error('❌ Avatars bucket missing!')
      }
    } catch (error) {
      console.error('❌ Storage test failed:', error)
    }

    // Test profiles table structure
    try {
      const { data, error } = await window.supabase
        .from('profiles')
        .select('id, avatar_url')
        .limit(1)

      if (error) {
        console.error('❌ Profiles table test failed:', error)
      } else {
        console.log('✅ Profiles table accessible with avatar_url column')
      }
    } catch (error) {
      console.error('❌ Database test failed:', error)
    }
  } else {
    console.error('❌ Supabase client not found')
  }
}

// Auto-run test
testAvatarUpload()