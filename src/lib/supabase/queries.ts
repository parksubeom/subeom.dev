import { createServerClient } from '@/shared/lib/supabase/server'
import { Tables } from '@/type/supabase'

type Project = Tables<'projects'>
type Post = Tables<'posts'>
type Profile = Tables<'profiles'>

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured' as never, true)
    .order('order', { ascending: true, nullsFirst: false })
    .limit(3)

  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }

  if (!data) {
    return []
  }

  return (data as unknown as Project[])
}

export async function getLatestPosts(): Promise<Post[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published' as never, true)
    .order('published_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }

  if (!data) {
    return []
  }

  return (data as unknown as Post[])
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  if (!data) {
    return null
  }

  return (data as unknown as Profile)
}

