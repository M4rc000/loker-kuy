import { Building2, MapPin, Clock, Briefcase, Tag, GraduationCap, Monitor, Award, ChevronRight } from 'lucide-react'
import { sourceIcons } from './SourceIcons'

const sourceMeta = {
  indeed: { label: 'Indeed', gradient: 'from-blue-500 to-blue-600' },
  linkedin: { label: 'LinkedIn', gradient: 'from-blue-600 to-blue-700' },
  jobstreet: { label: 'Jobstreet', gradient: 'from-orange-500 to-orange-600' },
  glints: { label: 'Glints', gradient: 'from-purple-500 to-purple-600' },
  google: { label: 'Google Jobs', gradient: 'from-rose-500 to-rose-600' },
  kitalulus: { label: 'KitaLulus', gradient: 'from-pink-500 to-pink-600' },
  kalibrr: { label: 'Kalibrr', gradient: 'from-blue-500 to-blue-600' },
  glassdoor: { label: 'Glassdoor', gradient: 'from-green-500 to-green-600' },
  karircom: { label: 'Karir.com', gradient: 'from-teal-500 to-teal-600' },
  topkarir: { label: 'TopKarir', gradient: 'from-orange-500 to-orange-600' },
}

export default function JobCard({ job }) {
  const Icon = sourceIcons[job.source]
  const meta = sourceMeta[job.source] || {}

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-indigo-200/70 transition-all duration-300 job-card-enter relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${meta.gradient || 'from-slate-300 to-slate-400'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-white bg-gradient-to-r ${meta.gradient || 'from-slate-400 to-slate-500'} shadow-sm`}
              >
                {Icon && <Icon className="w-3 h-3 brightness-0 invert" />}
                {meta.label || job.source}
              </span>
            </div>
            <h3 className="text-[15px] font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
              {job.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-500 mb-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
              <Building2 className="w-3 h-3 text-slate-400" />
            </span>
            <span className="font-medium text-slate-600 truncate max-w-[160px]">{job.company}</span>
          </span>
          {job.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[140px]">{job.location}</span>
            </span>
          )}
          {job.posted_at && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[120px]">{job.posted_at}</span>
            </span>
          )}
        </div>

        {/* Salary */}
        {job.salary && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[13px] font-semibold border border-emerald-200/60">
              <Briefcase className="w-3.5 h-3.5" />
              {job.salary}
            </span>
          </div>
        )}

        {/* Detail grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
          {job.category && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
              <Tag className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{job.category}</span>
            </span>
          )}
          {job.education && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
              <GraduationCap className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{job.education}</span>
            </span>
          )}
          {(job.job_type || job.work_mode) && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
              <Monitor className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">
                {job.job_type}{job.job_type && job.work_mode && ' · '}{job.work_mode}
              </span>
            </span>
          )}
          {job.experience && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
              <Award className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{job.experience}</span>
            </span>
          )}
        </div>

        {job.description && (
          <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
            {job.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group/link"
          >
            Lihat Lowongan
            <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </a>
          <span className="text-[11px] text-slate-400 font-medium">
            {meta.label || job.source}
          </span>
        </div>
      </div>
    </div>
  )
}
