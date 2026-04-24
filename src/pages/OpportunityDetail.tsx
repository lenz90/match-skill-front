import { ScoreBar } from '../components/matching/ScoreBar'
import { ConsultantProfile, Requirement } from '../types'
import { calculateMatch } from '../utils/matching'

interface OpportunityDetailProps {
  requirement: Requirement
  consultant: ConsultantProfile
  onBack: () => void
}

export function OpportunityDetail({ requirement, consultant, onBack }: OpportunityDetailProps) {
  const match = calculateMatch(consultant, requirement)
  return (
    <div>
      <button className="mb-4 rounded border px-3 py-1 text-sm" onClick={onBack}>← Back to opportunities</button>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold">{requirement.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{requirement.client} · {requirement.businessArea} · {requirement.businessDomain}</p>
        <div className="mt-3"><ScoreBar score={match.finalScore} /></div>
        <p className="mt-4 text-sm text-slate-700">{requirement.description}</p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TagGroup title="Required skills" tags={requirement.requiredSkills} />
          <TagGroup title="Desired skills" tags={requirement.desiredSkills} />
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
          <p><span className="font-semibold">Why you match:</span> {match.explanation}</p>
          <p className="mt-2"><span className="font-semibold">Refresh skills:</span> {match.missingSkills.join(', ') || 'No critical gap'}</p>
          <p className="mt-2 font-medium text-blue-700">Suggested next step: {match.finalScore >= 70 ? 'Contact the manager' : 'Update profile before applying'}</p>
        </div>
      </div>
    </div>
  )
}

function TagGroup({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-xs">{tag}</span>
        ))}
      </div>
    </div>
  )
}
