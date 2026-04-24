export type UserRole = 'MANAGER' | 'CONSULTANT'

export type AppUser = {
  id: string
  auth_user_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type SkillLevel = 'BASIC' | 'INTERMEDIATE' | 'STRONG'

export type LastUsed = 'Recent' | '1 year ago' | '2+ years ago'

export type RequirementStatus = 'ACTIVE' | 'INACTIVE'

export type AvailabilityStatus = 'Available' | 'Assigned soon' | 'Assigned'

export type Seniority = 'Junior' | 'Mid' | 'Senior' | 'Lead'

export interface Skill {
  name: string
  level: SkillLevel
  lastUsed: LastUsed
}

export interface User {
  id: string
  name: string
  role: UserRole
}

export interface Manager extends User {
  role: 'MANAGER'
  portfolio: string
}

export interface ConsultantProfile extends User {
  role: 'CONSULTANT'
  mainRole: string
  seniority: Seniority
  availability: AvailabilityStatus
  status: AvailabilityStatus
  businessDomains: string[]
  skills: Skill[]
}

export interface Requirement {
  id: string
  managerId: string
  title: string
  client: string
  businessArea: string
  businessDomain: string
  description: string
  requiredSkills: string[]
  desiredSkills: string[]
  seniority: Seniority
  status: RequirementStatus
  createdDate: string
}

export interface MatchResult {
  finalScore: number
  matchedSkills: string[]
  missingSkills: string[]
  explanation: string
  recommendation: string
}
