import { GraduationCap } from 'lucide-react'

const EDUCATION_LEVELS = [
  { value: 'SMA/SMK', label: 'SMA/SMK' },
  { value: 'D3', label: 'D3' },
  { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' },
  { value: 'S3', label: 'S3' },
]

export default function EducationFilter({ selected, onChange }) {
  return (
    <div className="space-y-1">
      {EDUCATION_LEVELS.map((edu) => {
        const isActive = selected.includes(edu.value)
        return (
          <label
            key={edu.value}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
              isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              isActive
                ? 'border-indigo-500 bg-indigo-500'
                : 'border-slate-300 bg-transparent'
            }`}>
              {isActive && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <GraduationCap className="w-5 h-5 shrink-0 text-slate-400" />
            <span className="text-sm font-medium flex-1">{edu.label}</span>
            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>}
          </label>
        )
      })}
    </div>
  )
}
