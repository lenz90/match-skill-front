import { useMemo, useState } from 'react'
import { Header } from '../components/layout/Header'
import { ScoreBar } from '../components/matching/ScoreBar'
import { SkillEditor } from '../components/skills/SkillEditor'
import { UploadCard } from '../components/upload/UploadCard'
import { ConsultantProfile, Requirement } from '../types'
import { rankRequirementsForConsultant } from '../utils/matching'

interface ConsultantDashboardProps {
  consultant: ConsultantProfile
  requirements: Requirement[]
  onUpdateConsultant: (consultant: ConsultantProfile) => void
  onOpenOpportunity: (id: string) => void
}

export function ConsultantDashboard({ consultant, requirements, onUpdateConsultant, onOpenOpportunity }: ConsultantDashboardProps) {
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('ALL')
  const [domainFilter, setDomainFilter] = useState('ALL')

  const rankedOpportunities = useMemo(() => rankRequirementsForConsultant(consultant, requirements), [consultant, requirements])

  const visibleOpportunities = rankedOpportunities.filter((item) => {
    const bySearch = `${item.title} ${item.businessArea} ${item.client}`.toLowerCase().includes(search.toLowerCase())
    const bySkill = skillFilter === 'ALL' || item.requiredSkills.includes(skillFilter) || item.desiredSkills.includes(skillFilter)
    const byDomain = domainFilter === 'ALL' || item.businessDomain === domainFilter
    return bySearch && bySkill && byDomain
  })

  const skillUniverse = Array.from(new Set(requirements.flatMap((r) => [...r.requiredSkills, ...r.desiredSkills])))
  const domainUniverse = Array.from(new Set(requirements.map((r) => r.businessDomain)))

  return (
    <div>
      <Header
        title="Consultant dashboard"
        subtitle="Keep profile up-to-date and explore ranked opportunities"
        search={search}
        onSearchChange={setSearch}
      />

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold">Profile summary</h3>
          <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
            <Info label="Name" value={consultant.name} />
            <Info label="Main role" value={consultant.mainRole} />
            <Info label="Seniority" value={consultant.seniority} />
            <Info label="Availability" value={consultant.availability} />
            <Info label="Current status" value={consultant.status} />
            <div>
              <p className="text-slate-500">Main skills</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {consultant.skills.slice(0, 6).map((skill) => (
                  <span key={skill.name} className="rounded bg-slate-100 px-2 py-0.5 text-xs">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <UploadCard
            label="CV upload"
            onMockProcessed={() => {
              onUpdateConsultant({
                ...consultant,
                skills: [...consultant.skills, { name: 'Kafka', level: 'INTERMEDIATE', lastUsed: 'Recent' }],
              })
            }}
          />
          <UploadCard label="Cover letter upload" onMockProcessed={() => null} />
        </div>
      </div>

      <div className="mt-4">
        <SkillEditor skills={consultant.skills} onChange={(skills) => onUpdateConsultant({ ...consultant, skills })} />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <select className="rounded border px-2 py-1 text-sm" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
            <option value="ALL">Skill: all</option>
            {skillUniverse.map((skill) => (
              <option key={skill}>{skill}</option>
            ))}
          </select>
          <select className="rounded border px-2 py-1 text-sm" value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)}>
            <option value="ALL">Domain: all</option>
            {domainUniverse.map((domain) => (
              <option key={domain}>{domain}</option>
            ))}
          </select>
        </div>
        <h3 className="text-lg font-semibold">Internal opportunities</h3>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {visibleOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="rounded-lg border border-slate-100 p-4">
              <p className="font-semibold text-slate-800">{opportunity.title}</p>
              <p className="text-xs text-slate-500">{opportunity.client} · {opportunity.businessArea}</p>
              <div className="mt-2"><ScoreBar score={opportunity.match.finalScore} /></div>
              <p className="mt-2 text-xs text-slate-600">Matched: {opportunity.match.matchedSkills.join(', ') || 'No overlap'}</p>
              <p className="mt-1 text-xs text-slate-600">Missing: {opportunity.match.missingSkills.slice(0, 4).join(', ') || 'None'}</p>
              <p className="mt-2 text-xs italic text-slate-600">{opportunity.match.recommendation}</p>
              <button className="mt-3 rounded border px-3 py-1 text-xs" onClick={() => onOpenOpportunity(opportunity.id)}>
                Open detail
              </button>
            </div>
          ))}
          {!visibleOpportunities.length && <p className="py-8 text-sm text-slate-500">No opportunities found.</p>}
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  )
}
