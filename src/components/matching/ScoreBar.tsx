export function ScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
        <span>Match score</span>
        <span>{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}
