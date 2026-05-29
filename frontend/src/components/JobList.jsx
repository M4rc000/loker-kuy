import JobCard from './JobCard'
import { Search } from 'lucide-react'

export default function JobList({ jobs, loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
          >
            <div className="h-0.5 bg-slate-100"></div>
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="skeleton h-5 w-16 rounded-lg"></div>
              </div>
              <div className="skeleton h-5 w-4/5 rounded-lg"></div>
              <div className="flex gap-4">
                <div className="skeleton h-4 w-24 rounded-lg"></div>
                <div className="skeleton h-4 w-28 rounded-lg"></div>
              </div>
              <div className="skeleton h-5 w-40 rounded-lg"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="skeleton h-4 w-full rounded-lg"></div>
                <div className="skeleton h-4 w-full rounded-lg"></div>
                <div className="skeleton h-4 w-full rounded-lg"></div>
                <div className="skeleton h-4 w-full rounded-lg"></div>
              </div>
              <div className="skeleton h-4 w-full rounded-lg"></div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <div className="skeleton h-4 w-24 rounded-lg"></div>
                <div className="skeleton h-4 w-16 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Search className="w-7 h-7 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-500">
          Belum ada hasil
        </h3>
        <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
          Coba gunakan kata kunci lain atau pilih sumber yang berbeda
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
