import { useMemo, useState } from 'react'
import { Header } from '../components/layout/Header'
import { ScoreBar } from '../components/matching/ScoreBar'
import { UploadCard } from '../components/upload/UploadCard'
import { managers } from '../data/mockData'
import { ConsultantProfile, Requirement, RequirementStatus, Seniority } from '../types'
import { calculateMatch } from '../utils/matching'

interface ManagerDashboardProps {
  requirements: Requirement[]
  consultants: ConsultantProfile[]
  onCreateRequirement: (requirement: Omit<Requirement, 'id' | 'createdDate'>) => void
  onToggleStatus: (id: string) => void
  onOpenRequirement: (id: string) => void
}

export function ManagerDashboard({
  requirements,
  consultants,
  onCreateRequirement,
  onToggleStatus,
  onOpenRequirement,
}: ManagerDashboardProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | RequirementStatus>('ALL')
  const [skillFilter, setSkillFilter] = useState('ALL')
  const [seniorityFilter, setSeniorityFilter] = useState<'ALL' | Seniority>('ALL')
  const [domainFilter, setDomainFilter] = useState('ALL')

  const [newRequirement, setNewRequirement] = useState<Omit<Requirement, 'id' | 'createdDate'>>({
    managerId: managers[0].id,
    title: '',
    client: '',
    businessArea: '',
    businessDomain: 'Banking',
    description: '',
    requiredSkills: [],
    desiredSkills: [],
    seniority: 'Senior',
    status: 'ACTIVE',
  })

  const skillUniverse = useMemo(
    () => Array.from(new Set(requirements.flatMap((r) => [...r.requiredSkills, ...r.desiredSkills]))),
    [requirements],
  )
  const domainUniverse = useMemo(() => Array.from(new Set(requirements.map((r) => r.businessDomain))), [requirements])

  const ranked = useMemo(
    () => requirements.map((req) => consultants.map((c) => calculateMatch(c, req).finalScore)).flat(),
    [requirements, consultants],
  )
  const averageScore = ranked.length ? Math.round(ranked.reduce((a, b) => a + b, 0) / ranked.length) : 0

  const filteredRequirements = requirements.filter((requirement) => {
    const fullText = `${requirement.title} ${requirement.client} ${requirement.businessArea} ${requirement.requiredSkills.join(' ')}`.toLowerCase()
    const matchesSearch = fullText.includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || requirement.status === statusFilter
    const matchesSkill =
      skillFilter === 'ALL' ||
      [...requirement.requiredSkills, ...requirement.desiredSkills].some((skill) => skill === skillFilter)
    const matchesSeniority = seniorityFilter === 'ALL' || requirement.seniority === seniorityFilter
    const matchesDomain = domainFilter === 'ALL' || requirement.businessDomain === domainFilter
    return matchesSearch && matchesStatus && matchesSkill && matchesSeniority && matchesDomain
  })

  return (
    <div>
      <Header
        title="Manager dashboard"
        subtitle="Track requirements and identify best-fit consultants"
        search={search}
        onSearchChange={setSearch}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Active requirements" value={requirements.filter((r) => r.status === 'ACTIVE').length} />
        <StatCard title="Inactive requirements" value={requirements.filter((r) => r.status === 'INACTIVE').length} />
        <StatCard title="Available consultants" value={consultants.filter((c) => c.availability === 'Available').length} />
        <StatCard title="Average match score" value={`${averageScore}%`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap gap-2">
            <select className="rounded border px-2 py-1 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | RequirementStatus)}>
              <option value="ALL">Status: all</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <select className="rounded border px-2 py-1 text-sm" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
              <option value="ALL">Skill: all</option>
              {skillUniverse.map((skill) => (
                <option key={skill}>{skill}</option>
              ))}
            </select>
            <select className="rounded border px-2 py-1 text-sm" value={seniorityFilter} onChange={(e) => setSeniorityFilter(e.target.value as 'ALL' | Seniority)}>
              <option value="ALL">Seniority: all</option>
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
              <option>Lead</option>
            </select>
            <select className="rounded border px-2 py-1 text-sm" value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)}>
              <option value="ALL">Domain: all</option>
              {domainUniverse.map((domain) => (
                <option key={domain}>{domain}</option>
              ))}
            </select>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-2">Requirement</th>
                <th className="pb-2">Skills</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Matches</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequirements.map((requirement) => {
                const matchedCount = consultants.filter((consultant) => calculateMatch(consultant, requirement).finalScore >= 60).length
                return (
                  <tr key={requirement.id} className="border-t border-slate-100 align-top">
                    <td className="py-3">
                      <p className="font-medium">{requirement.title}</p>
                      <p className="text-xs text-slate-500">
                        {requirement.client} · {requirement.businessArea} · {requirement.createdDate}
                      </p>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {requirement.requiredSkills.slice(0, 4).map((skill) => (
                          <span key={skill} className="rounded bg-slate-100 px-2 py-0.5 text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          requirement.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {requirement.status}
                      </span>
                    </td>
                    <td className="py-3">{matchedCount} consultants</td>
                    <td className="py-3 space-x-2">
                      <button className="rounded border px-2 py-1 text-xs" onClick={() => onOpenRequirement(requirement.id)}>
                        Detail
                      </button>
                      <button className="rounded border px-2 py-1 text-xs" onClick={() => onToggleStatus(requirement.id)}>
                        {requirement.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!filteredRequirements.length && <p className="py-8 text-center text-sm text-slate-500">No requirements found.</p>}
        </div>

        <div className="space-y-4">
          <UploadCard
            label="Requirement file upload"
            onMockProcessed={(fileName) => {
              onCreateRequirement({
                managerId: managers[0].id,
                title: `Uploaded Requirement - ${fileName}`,
                client: 'Mock Client Group',
                businessArea: 'API Modernization',
                businessDomain: 'Banking',
                description: 'Auto-populated from uploaded mock file.',
                requiredSkills: ['Java', 'Spring Boot', 'Kafka'],
                desiredSkills: ['Redis', 'Azure', 'Kubernetes'],
                seniority: 'Senior',
                status: 'ACTIVE',
              })
            }}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">Create requirement manually</h3>
            <div className="mt-3 space-y-2 text-sm">
              <input className="w-full rounded border px-2 py-1" placeholder="Title" value={newRequirement.title} onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })} />
              <input className="w-full rounded border px-2 py-1" placeholder="Client" value={newRequirement.client} onChange={(e) => setNewRequirement({ ...newRequirement, client: e.target.value })} />
              <input className="w-full rounded border px-2 py-1" placeholder="Business area" value={newRequirement.businessArea} onChange={(e) => setNewRequirement({ ...newRequirement, businessArea: e.target.value })} />
              <textarea className="w-full rounded border px-2 py-1" placeholder="Description" value={newRequirement.description} onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })} />
              <input
                className="w-full rounded border px-2 py-1"
                placeholder="Required skills (comma separated)"
                onChange={(e) => setNewRequirement({ ...newRequirement, requiredSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              />
              <input
                className="w-full rounded border px-2 py-1"
                placeholder="Desired skills (comma separated)"
                onChange={(e) => setNewRequirement({ ...newRequirement, desiredSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              />
              <div className="grid grid-cols-2 gap-2">
                <select className="rounded border px-2 py-1" value={newRequirement.seniority} onChange={(e) => setNewRequirement({ ...newRequirement, seniority: e.target.value as Seniority })}>
                  <option>Junior</option>
                  <option>Mid</option>
                  <option>Senior</option>
                  <option>Lead</option>
                </select>
                <select className="rounded border px-2 py-1" value={newRequirement.status} onChange={(e) => setNewRequirement({ ...newRequirement, status: e.target.value as RequirementStatus })}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <button
                className="w-full rounded bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
                onClick={() => {
                  if (!newRequirement.title || !newRequirement.client) return
                  onCreateRequirement(newRequirement)
                  setNewRequirement({
                    ...newRequirement,
                    title: '',
                    client: '',
                    businessArea: '',
                    description: '',
                    requiredSkills: [],
                    desiredSkills: [],
                  })
                }}
              >
                Add requirement
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold">Top quick matches (sample)</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {requirements.slice(0, 3).map((requirement) => {
            const best = consultants
              .map((consultant) => ({ consultant, match: calculateMatch(consultant, requirement) }))
              .sort((a, b) => b.match.finalScore - a.match.finalScore)[0]
            return (
              <div key={requirement.id} className="rounded-lg border border-slate-100 p-3">
                <p className="font-medium text-slate-800">{requirement.title}</p>
                <p className="mt-1 text-xs text-slate-500">Best fit: {best.consultant.name}</p>
                <div className="mt-2">
                  <ScoreBar score={best.match.finalScore} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}
