import { Session } from '@supabase/supabase-js'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { AppUser, UserRole } from '../types'
import { supabase, supabaseConfigError } from '../lib/supabaseClient'

interface AuthContextValue {
  session: Session | null
  appUser: AppUser | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  saveRole: (role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const APP_USERS_QUERY_ERROR =
  'Could not load your app profile from Supabase. Please verify the app_users table exists and RLS policies allow access.'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAppUser = async (activeSession: Session | null) => {
    if (!supabase || !activeSession) {
      setAppUser(null)
      return
    }

    const { data, error: queryError } = await supabase
      .from('app_users')
      .select('*')
      .eq('auth_user_id', activeSession.user.id)
      .maybeSingle()

    if (queryError) {
      setError(APP_USERS_QUERY_ERROR)
      setAppUser(null)
      return
    }

    setAppUser((data as AppUser | null) ?? null)
  }

  useEffect(() => {
    const setup = async () => {
      if (supabaseConfigError || !supabase) {
        setError(supabaseConfigError)
        setLoading(false)
        return
      }

      setLoading(true)
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setError('Unable to read Supabase session. Please try again.')
        setLoading(false)
        return
      }

      setSession(data.session)
      if (data.session?.access_token == null) {
        setError('Login session is missing access token. Please sign in again.')
      }

      await loadAppUser(data.session)
      setLoading(false)
    }

    setup()

    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, currentSession) => {
      setSession(currentSession)
      if (currentSession?.access_token == null && currentSession !== null) {
        setError('Login session is missing access token. Please sign in again.')
      } else {
        setError(null)
      }
      await loadAppUser(currentSession)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    if (!supabase) {
      setError(supabaseConfigError)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (signInError) {
      setError('Could not start Google sign-in. Please check your Supabase OAuth configuration.')
    }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setSession(null)
    setAppUser(null)
  }

  const saveRole = async (role: UserRole) => {
    if (!supabase || !session) return
    setLoading(true)
    setError(null)

    const profile = {
      auth_user_id: session.user.id,
      email: session.user.email ?? '',
      full_name: session.user.user_metadata.full_name ?? session.user.user_metadata.name ?? null,
      avatar_url: session.user.user_metadata.avatar_url ?? null,
      role,
    }

    const { data, error: insertError } = await supabase
      .from('app_users')
      .insert(profile)
      .select('*')
      .single()

    if (insertError) {
      setError(APP_USERS_QUERY_ERROR)
      setLoading(false)
      return
    }

    setAppUser(data as AppUser)
    setLoading(false)
  }

  const value = useMemo(
    () => ({ session, appUser, loading, error, signInWithGoogle, signOut, saveRole }),
    [session, appUser, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
