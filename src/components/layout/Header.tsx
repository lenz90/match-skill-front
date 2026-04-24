interface HeaderProps {
  title: string
  subtitle: string
  search: string
  onSearchChange: (value: string) => void
}

export function Header({ title, subtitle, search, onSearchChange }: HeaderProps) {
  return (
    <header className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by skill, business area, seniority..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none md:w-96"
        />
      </div>
    </header>
  )
}
