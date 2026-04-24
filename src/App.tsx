import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './auth/AuthProvider'
import { Sidebar } from './components/layout/Sidebar'
import { consultants as seedConsultants, defaultConsultantId, requirements as seedRequirements } from './data/mockData'
import { ConsultantDashboard } from './pages/ConsultantDashboard'
import { LoginPage } from './pages/LoginPage'
import { ManagerDashboard } from './pages/ManagerDashboard'
import { OnboardingPage } from './pages/OnboardingPage'
import { OpportunityDetail } from './pages/OpportunityDetail'
import { RequirementDetail } from './pages/RequirementDetail'
import { ConsultantProfile, Requirement, RequirementStatus } from './types'

type View = 'MANAGER_DASHBOARD' | 'CONSULTANT_DASHBOARD' | 'REQUIREMENT_DETAIL' | 'OPPORTUNITY_DETAIL'

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
  const { session, appUser, loading, error, signInWithGoogle, signOut, saveRole } = useAuth()

  const [view, setView] = useState<View>('MANAGER_DASHBOARD')
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

  useEffect(() => {
    if (!appUser) return
    setView(appUser.role === 'MANAGER' ? 'MANAGER_DASHBOARD' : 'CONSULTANT_DASHBOARD')
  }, [appUser])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">Loading authentication and profile...</p>
      </div>
    )
  }

  if (!session) {
    return <LoginPage onGoogleLogin={signInWithGoogle} loading={loading} error={error} />
  }

  if (!appUser) {
    return (
      <OnboardingPage
        fullName={session.user.user_metadata.full_name ?? session.user.user_metadata.name ?? 'Consultant'}
        email={session.user.email ?? 'No email available'}
        avatarUrl={session.user.user_metadata.avatar_url ?? null}
        loading={loading}
        error={error}
        onSelectRole={saveRole}
      />
    )
  }

  const selectedRequirement = requirements.find((req) => req.id === selectedRequirementId) ?? requirements[0]
  const selectedOpportunity = requirements.find((req) => req.id === selectedOpportunityId) ?? requirements[0]

  return (
    <div className="md:flex">
      <Sidebar
        role={appUser.role}
        userName={appUser.full_name ?? session.user.user_metadata.full_name ?? 'User'}
        userEmail={appUser.email}
        onNavigateDashboard={() => setView(appUser.role === 'MANAGER' ? 'MANAGER_DASHBOARD' : 'CONSULTANT_DASHBOARD')}
        onSignOut={() => void signOut()}
      />
      <main className="min-h-screen flex-1 bg-slate-100 p-4 md:p-6">
        {view === 'MANAGER_DASHBOARD' && appUser.role === 'MANAGER' && (
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

        {view === 'CONSULTANT_DASHBOARD' && appUser.role === 'CONSULTANT' && activeConsultant && (
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
