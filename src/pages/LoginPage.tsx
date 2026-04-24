import { UserRole } from '../types'

export function LoginPage({ onSelect }: { onSelect: (role: UserRole) => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-wider text-blue-600">Internal Talent Platform</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Consultant matching prototype</h1>
        <p className="mt-3 text-slate-600">
          Validate staffing UX with simulated data and matching insights before backend and AI implementation.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            onClick={() => onSelect('MANAGER')}
            className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-left hover:border-blue-300 hover:bg-blue-50"
          >
            <h2 className="text-xl font-semibold">Continue as Manager</h2>
            <p className="mt-1 text-sm text-slate-600">Create requirements, review matches, and activate/deactivate needs.</p>
          </button>
          <button
            onClick={() => onSelect('CONSULTANT')}
            className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-left hover:border-blue-300 hover:bg-blue-50"
          >
            <h2 className="text-xl font-semibold">Continue as Consultant</h2>
            <p className="mt-1 text-sm text-slate-600">Maintain profile, upload CV, and explore ranked internal opportunities.</p>
          </button>
        </div>
      </div>
    </div>
  )
}
