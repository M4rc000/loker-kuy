import { Link } from 'react-router-dom'
import { IndeedIcon, LinkedInIcon, JobstreetIcon, GlintsIcon, KitaLulusIcon, KalibrrIcon, GlassdoorIcon, KarircomIcon, TopKarirIcon, GoogleJobsIcon } from './SourceIcons'

const platforms = [
  IndeedIcon, LinkedInIcon, JobstreetIcon, KitaLulusIcon,
  GlintsIcon, KalibrrIcon, GlassdoorIcon, KarircomIcon, TopKarirIcon, GoogleJobsIcon,
]

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              Loker<span className="text-indigo-600">Kuy</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-slate-400 overflow-x-auto scrollbar-none ml-2">
            {platforms.map((Icon, i) => (
              <Icon key={i} className="w-3.5 h-3.5 opacity-50 shrink-0" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
