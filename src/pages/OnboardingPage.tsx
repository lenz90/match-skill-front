import { UserRole } from '../types'

interface OnboardingPageProps {
  fullName: string
  email: string
  avatarUrl: string | null
  loading: boolean
  error: string | null
  onSelectRole: (role: UserRole) => Promise<void>
}

export function OnboardingPage({ fullName, email, avatarUrl, loading, error, onSelectRole }: OnboardingPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-center gap-3">
          {avatarUrl ? <img src={avatarUrl} alt={fullName} className="h-12 w-12 rounded-full" /> : <div className="h-12 w-12 rounded-full bg-slate-200" />}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {fullName}</h1>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>

        <p className="mt-5 text-slate-700">Before entering the platform, choose your role.</p>
        {error && <p className="mt-3 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <button
            disabled={loading}
            onClick={() => void onSelectRole('MANAGER')}
            className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-left hover:border-blue-300 hover:bg-blue-50 disabled:opacity-70"
          >
            <h2 className="text-xl font-semibold">Continue as Manager</h2>
            <p className="mt-1 text-sm text-slate-600">Review requirements, ranked consultants and staffing metrics.</p>
          </button>
          <button
            disabled={loading}
            onClick={() => void onSelectRole('CONSULTANT')}
            className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-left hover:border-blue-300 hover:bg-blue-50 disabled:opacity-70"
          >
            <h2 className="text-xl font-semibold">Continue as Consultant</h2>
            <p className="mt-1 text-sm text-slate-600">Maintain your profile and explore internal opportunities.</p>
          </button>
        </div>
      </div>
    </div>
  )
}
