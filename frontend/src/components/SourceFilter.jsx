import { IndeedIcon, LinkedInIcon, JobstreetIcon, GlintsIcon, GoogleJobsIcon, KitaLulusIcon, KalibrrIcon, GlassdoorIcon, KarircomIcon, TopKarirIcon } from './SourceIcons'

const sources = [
  { id: 'indeed', label: 'Indeed', Icon: IndeedIcon, activeBg: 'bg-blue-50', activeText: 'text-blue-700', activeDot: 'bg-blue-500' },
  { id: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon, activeBg: 'bg-blue-50', activeText: 'text-blue-700', activeDot: 'bg-blue-500' },
  { id: 'jobstreet', label: 'Jobstreet', Icon: JobstreetIcon, activeBg: 'bg-orange-50', activeText: 'text-orange-700', activeDot: 'bg-orange-500' },
  { id: 'kitalulus', label: 'KitaLulus', Icon: KitaLulusIcon, activeBg: 'bg-pink-50', activeText: 'text-pink-700', activeDot: 'bg-pink-500' },
  { id: 'glints', label: 'Glints', Icon: GlintsIcon, activeBg: 'bg-purple-50', activeText: 'text-purple-700', activeDot: 'bg-purple-500' },
  { id: 'kalibrr', label: 'Kalibrr', Icon: KalibrrIcon, activeBg: 'bg-blue-50', activeText: 'text-blue-700', activeDot: 'bg-blue-500' },
  { id: 'glassdoor', label: 'Glassdoor', Icon: GlassdoorIcon, activeBg: 'bg-green-50', activeText: 'text-green-700', activeDot: 'bg-green-500' },
  { id: 'karircom', label: 'Karir.com', Icon: KarircomIcon, activeBg: 'bg-teal-50', activeText: 'text-teal-700', activeDot: 'bg-teal-500' },
  { id: 'topkarir', label: 'TopKarir', Icon: TopKarirIcon, activeBg: 'bg-orange-50', activeText: 'text-orange-700', activeDot: 'bg-orange-500' },
  { id: 'google', label: 'Google Jobs', Icon: GoogleJobsIcon, activeBg: 'bg-rose-50', activeText: 'text-rose-700', activeDot: 'bg-rose-500' },
]

export default function SourceFilter({ selected, onChange }) {
  return (
    <div className="space-y-1">
      {sources.map((src) => {
        const Icon = src.Icon
        const isActive = selected.includes(src.id)
        return (
          <label
            key={src.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
              isActive
                ? `${src.activeBg} ${src.activeText}`
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
            <Icon className="w-7 h-7 shrink-0" />
            <span className="text-sm font-medium flex-1">{src.label}</span>
            {isActive && <span className={`w-1.5 h-1.5 rounded-full ${src.activeDot}`}></span>}
          </label>
        )
      })}
    </div>
  )
}
