import { ConsultantProfile, MatchResult, Requirement } from '../types'

const scoreBucket = (ratio: number, weight: number) => ratio * weight

const dedupe = (arr: string[]) => [...new Set(arr)]

export const calculateMatch = (
  consultant: ConsultantProfile,
  requirement: Requirement,
): MatchResult => {
  const consultantSkills = consultant.skills.map((skill) => skill.name)

  const requiredMatched = requirement.requiredSkills.filter((skill) => consultantSkills.includes(skill))
  const desiredMatched = requirement.desiredSkills.filter((skill) => consultantSkills.includes(skill))
  const requiredMissing = requirement.requiredSkills.filter((skill) => !consultantSkills.includes(skill))

  const requiredRatio = requirement.requiredSkills.length
    ? requiredMatched.length / requirement.requiredSkills.length
    : 0
  const desiredRatio = requirement.desiredSkills.length
    ? desiredMatched.length / requirement.desiredSkills.length
    : 0

  const domainMatch = consultant.businessDomains.some(
    (domain) => domain.toLowerCase() === requirement.businessDomain.toLowerCase(),
  )
    ? 1
    : 0

  const seniorityMatch = consultant.seniority === requirement.seniority ? 1 : consultant.seniority === 'Lead' ? 0.75 : 0.4

  const availabilityMatch = consultant.availability === 'Available' ? 1 : consultant.availability === 'Assigned soon' ? 0.5 : 0

  const finalScore = Math.round(
    scoreBucket(requiredRatio, 50) +
      scoreBucket(desiredRatio, 20) +
      scoreBucket(domainMatch, 15) +
      scoreBucket(seniorityMatch, 10) +
      scoreBucket(availabilityMatch, 5),
  )

  const missingSkills = dedupe([...requiredMissing, ...requirement.desiredSkills.filter((s) => !consultantSkills.includes(s))])

  const explanation = `Strong match because ${consultant.name} has ${requiredMatched.slice(0, 4).join(', ') || 'partial skill overlap'} and ${requirement.businessDomain.toLowerCase()} exposure. ${missingSkills[0] ?? 'No key'} ${missingSkills.length ? 'is missing or not recently used.' : 'gap detected.'}`

  const recommendation = missingSkills.length
    ? `Refresh ${missingSkills.slice(0, 2).join(' and ')} examples before manager presentation.`
    : 'Excellent fit. Contact manager and share recent delivery outcomes.'

  return {
    finalScore,
    matchedSkills: dedupe([...requiredMatched, ...desiredMatched]),
    missingSkills,
    explanation,
    recommendation,
  }
}

export const rankConsultantsForRequirement = (
  consultants: ConsultantProfile[],
  requirement: Requirement,
): Array<ConsultantProfile & { match: MatchResult }> => {
  return consultants
    .map((consultant) => ({ consultant, match: calculateMatch(consultant, requirement) }))
    .sort((a, b) => b.match.finalScore - a.match.finalScore)
    .map(({ consultant, match }) => ({ ...consultant, match }))
}

export const rankRequirementsForConsultant = (
  consultant: ConsultantProfile,
  requirements: Requirement[],
): Array<Requirement & { match: MatchResult }> => {
  return requirements
    .map((requirement) => ({ requirement, match: calculateMatch(consultant, requirement) }))
    .sort((a, b) => b.match.finalScore - a.match.finalScore)
    .map(({ requirement, match }) => ({ ...requirement, match }))
}
