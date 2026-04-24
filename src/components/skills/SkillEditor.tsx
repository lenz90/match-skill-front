import { LastUsed, Skill, SkillLevel } from '../../types'

interface SkillEditorProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
}

const levels: SkillLevel[] = ['BASIC', 'INTERMEDIATE', 'STRONG']
const lastUsedValues: LastUsed[] = ['Recent', '1 year ago', '2+ years ago']

export function SkillEditor({ skills, onChange }: SkillEditorProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Skill editor</h3>
      <div className="mt-4 space-y-3">
        {skills.map((skill, index) => (
          <div key={`${skill.name}-${index}`} className="grid gap-2 rounded-lg border border-slate-100 p-3 md:grid-cols-3">
            <input
              value={skill.name}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
              onChange={(e) => {
                const updated = [...skills]
                updated[index] = { ...updated[index], name: e.target.value }
                onChange(updated)
              }}
            />
            <select
              value={skill.level}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
              onChange={(e) => {
                const updated = [...skills]
                updated[index] = { ...updated[index], level: e.target.value as SkillLevel }
                onChange(updated)
              }}
            >
              {levels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
            <select
              value={skill.lastUsed}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
              onChange={(e) => {
                const updated = [...skills]
                updated[index] = { ...updated[index], lastUsed: e.target.value as LastUsed }
                onChange(updated)
              }}
            >
              {lastUsedValues.map((lastUsed) => (
                <option key={lastUsed}>{lastUsed}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
