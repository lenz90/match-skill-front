import { ScoreBar } from '../components/matching/ScoreBar'
import { ConsultantProfile, Requirement } from '../types'
import { rankConsultantsForRequirement } from '../utils/matching'

interface RequirementDetailProps {
  requirement: Requirement
  consultants: ConsultantProfile[]
  onBack: () => void
}

export function RequirementDetail({ requirement, consultants, onBack }: RequirementDetailProps) {
  const ranked = rankConsultantsForRequirement(consultants, requirement)
  return (
    <div>
      <button className="mb-4 rounded border px-3 py-1 text-sm" onClick={onBack}>← Back to dashboard</button>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold">{requirement.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{requirement.client} · {requirement.businessArea} · {requirement.businessDomain}</p>
        <p className="mt-3 text-sm text-slate-700">{requirement.description}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TagGroup title="Required skills" tags={requirement.requiredSkills} />
          <TagGroup title="Desired skills" tags={requirement.desiredSkills} />
        </div>
      </div>

      <h3 className="mt-6 text-xl font-semibold">Ranked consultants</h3>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {ranked.map((consultant) => (
          <div key={consultant.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{consultant.name}</p>
                <p className="text-xs text-slate-500">{consultant.mainRole} · {consultant.seniority} · {consultant.availability}</p>
              </div>
              <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{consultant.match.finalScore}%</span>
            </div>
            <div className="mt-2"><ScoreBar score={consultant.match.finalScore} /></div>
            <p className="mt-2 text-xs text-slate-600">Matched skills: {consultant.match.matchedSkills.join(', ') || 'No overlap'}</p>
            <p className="mt-1 text-xs text-slate-600">Missing skills: {consultant.match.missingSkills.slice(0, 4).join(', ') || 'None'}</p>
            <p className="mt-2 text-xs italic text-slate-700">{consultant.match.explanation}</p>
            <p className="mt-1 text-xs font-medium text-blue-700">Suggested action: {consultant.match.recommendation}</p>
          </div>
        ))}
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
