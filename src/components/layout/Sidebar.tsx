import { UserRole } from '../../types'

interface SidebarProps {
  role: UserRole
  userName: string
  userEmail: string
  onNavigateDashboard: () => void
  onSignOut: () => void
}

export function Sidebar({ role, userName, userEmail, onNavigateDashboard, onSignOut }: SidebarProps) {
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

      <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-xs">
        <p className="font-semibold">{userName}</p>
        <p className="truncate text-slate-300">{userEmail}</p>
      </div>

      <button
        onClick={onSignOut}
        className="mt-3 w-full rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
      >
        Sign out
      </button>
    </aside>
  )
}
