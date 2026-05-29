import { Loader2, CheckCircle, XCircle, Search } from 'lucide-react'

export default function SearchStatus({ status, totalJobs }) {
  if (status === 'pending' || status === 'processing') {
    return (
      <div className="flex items-start gap-3 bg-indigo-50/70 border border-indigo-200/50 rounded-2xl p-4 mb-6">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <Loader2 className="w-4.5 h-4.5 text-indigo-600 animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-indigo-800">Mencari lowongan...</p>
          <p className="text-xs text-indigo-600/70 mt-0.5">
            Sedang mengumpulkan data dari berbagai sumber
          </p>
        </div>
        <span className="loading loading-dots loading-sm text-indigo-500"></span>
      </div>
    )
  }

  if (status === 'completed') {
    return (
      <div className="flex items-start gap-3 bg-emerald-50/70 border border-emerald-200/50 rounded-2xl p-4 mb-6">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-emerald-800">
            Ditemukan <strong className="text-emerald-600">{totalJobs}</strong> lowongan!
          </p>
          <p className="text-xs text-emerald-600/70 mt-0.5">Data sudah siap dilihat</p>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex items-start gap-3 bg-red-50/70 border border-red-200/50 rounded-2xl p-4 mb-6">
        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
          <XCircle className="w-4.5 h-4.5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800">Gagal mencari lowongan</p>
          <p className="text-xs text-red-600/70 mt-0.5">Silakan coba lagi nanti</p>
        </div>
      </div>
    )
  }

  return null
}
