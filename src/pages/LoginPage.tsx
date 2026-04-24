interface LoginPageProps {
  onGoogleLogin: () => Promise<void>
  loading: boolean
  error: string | null
}

export function LoginPage({ onGoogleLogin, loading, error }: LoginPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-wider text-blue-600">Internal Talent Platform</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Consultant matching prototype</h1>
        <p className="mt-3 text-slate-600">Use your company Google account to continue.</p>

        {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        <button
          onClick={() => void onGoogleLogin()}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Checking session...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  )
}
