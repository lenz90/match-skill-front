import { UserRole } from '../../types'

interface SidebarProps {
  role: UserRole
  onNavigateDashboard: () => void
  onBackToLogin: () => void
}

export function Sidebar({ role, onNavigateDashboard, onBackToLogin }: SidebarProps) {
  const items =
    role === 'MANAGER'
      ? ['Dashboard', 'Requirements', 'Consultants', 'Matching Insights']
      : ['Dashboard', 'Profile', 'Skills', 'Opportunities']

  return (
    <aside className="w-full border-b border-slate-200 bg-slate-900 p-4 text-slate-100 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <p className="text-xs uppercase tracking-widest text-slate-400">Talent Match</p>
      <h1 className="mt-2 text-lg font-bold">Internal Marketplace</h1>
      <div className="mt-6 space-y-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={onNavigateDashboard}
            className="w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-slate-800"
          >
            {item}
          </button>
        ))}
      </div>
      <button
        onClick={onBackToLogin}
        className="mt-8 w-full rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
      >
        Switch role
      </button>
    </aside>
  )
}
