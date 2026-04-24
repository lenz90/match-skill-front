import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { consultants as seedConsultants, defaultConsultantId, requirements as seedRequirements } from './data/mockData'
import { ConsultantDashboard } from './pages/ConsultantDashboard'
import { LoginPage } from './pages/LoginPage'
import { ManagerDashboard } from './pages/ManagerDashboard'
import { OpportunityDetail } from './pages/OpportunityDetail'
import { RequirementDetail } from './pages/RequirementDetail'
import { ConsultantProfile, Requirement, RequirementStatus, UserRole } from './types'

type View = 'LOGIN' | 'MANAGER_DASHBOARD' | 'CONSULTANT_DASHBOARD' | 'REQUIREMENT_DETAIL' | 'OPPORTUNITY_DETAIL'

const REQUIREMENTS_KEY = 'talent_requirements'
const CONSULTANTS_KEY = 'talent_consultants'

function loadFromStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [view, setView] = useState<View>('LOGIN')
  const [requirements, setRequirements] = useState<Requirement[]>(() => loadFromStorage(REQUIREMENTS_KEY, seedRequirements))
  const [consultants, setConsultants] = useState<ConsultantProfile[]>(() => loadFromStorage(CONSULTANTS_KEY, seedConsultants))
  const [selectedRequirementId, setSelectedRequirementId] = useState<string>(requirements[0]?.id ?? '')
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>(requirements[0]?.id ?? '')

  const activeConsultant = useMemo(
    () => consultants.find((consultant) => consultant.id === defaultConsultantId) ?? consultants[0],
    [consultants],
  )

  useEffect(() => {
    localStorage.setItem(REQUIREMENTS_KEY, JSON.stringify(requirements))
  }, [requirements])

  useEffect(() => {
    localStorage.setItem(CONSULTANTS_KEY, JSON.stringify(consultants))
  }, [consultants])

  const selectedRequirement = requirements.find((req) => req.id === selectedRequirementId) ?? requirements[0]
  const selectedOpportunity = requirements.find((req) => req.id === selectedOpportunityId) ?? requirements[0]

  if (view === 'LOGIN' || !role) {
    return (
      <LoginPage
        onSelect={(selectedRole) => {
          setRole(selectedRole)
          setView(selectedRole === 'MANAGER' ? 'MANAGER_DASHBOARD' : 'CONSULTANT_DASHBOARD')
        }}
      />
    )
  }

  return (
    <div className="md:flex">
      <Sidebar
        role={role}
        onNavigateDashboard={() => setView(role === 'MANAGER' ? 'MANAGER_DASHBOARD' : 'CONSULTANT_DASHBOARD')}
        onBackToLogin={() => {
          setRole(null)
          setView('LOGIN')
        }}
      />
      <main className="min-h-screen flex-1 bg-slate-100 p-4 md:p-6">
        {view === 'MANAGER_DASHBOARD' && role === 'MANAGER' && (
          <ManagerDashboard
            requirements={requirements}
            consultants={consultants}
            onCreateRequirement={(input) => {
              const requirement: Requirement = {
                ...input,
                id: `r-${Date.now()}`,
                createdDate: new Date().toISOString().slice(0, 10),
              }
              setRequirements((prev) => [requirement, ...prev])
            }}
            onToggleStatus={(id) => {
              setRequirements((prev) =>
                prev.map((requirement) =>
                  requirement.id === id
                    ? {
                        ...requirement,
                        status: (requirement.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE') as RequirementStatus,
                      }
                    : requirement,
                ),
              )
            }}
            onOpenRequirement={(id) => {
              setSelectedRequirementId(id)
              setView('REQUIREMENT_DETAIL')
            }}
          />
        )}

        {view === 'CONSULTANT_DASHBOARD' && role === 'CONSULTANT' && activeConsultant && (
          <ConsultantDashboard
            consultant={activeConsultant}
            requirements={requirements.filter((req) => req.status === 'ACTIVE')}
            onUpdateConsultant={(updated) => {
              setConsultants((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
            }}
            onOpenOpportunity={(id) => {
              setSelectedOpportunityId(id)
              setView('OPPORTUNITY_DETAIL')
            }}
          />
        )}

        {view === 'REQUIREMENT_DETAIL' && selectedRequirement && (
          <RequirementDetail
            requirement={selectedRequirement}
            consultants={consultants}
            onBack={() => setView('MANAGER_DASHBOARD')}
          />
        )}

        {view === 'OPPORTUNITY_DETAIL' && selectedOpportunity && activeConsultant && (
          <OpportunityDetail
            requirement={selectedOpportunity}
            consultant={activeConsultant}
            onBack={() => setView('CONSULTANT_DASHBOARD')}
          />
        )}
      </main>
    </div>
  )
}
