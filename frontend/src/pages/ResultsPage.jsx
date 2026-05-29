import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Search, MapPin, SlidersHorizontal, Filter, X, MoveHorizontal, GraduationCap } from 'lucide-react'
import JobList from '../components/JobList'
import SearchStatus from '../components/SearchStatus'
import SourceFilter from '../components/SourceFilter'
import EducationFilter from '../components/EducationFilter'
import CitySelect from '../components/CitySelect'
import { searchJobs, getTask } from '../services/api'

const SOURCES = ['indeed', 'linkedin', 'jobstreet', 'kitalulus', 'glints', 'kalibrr', 'glassdoor', 'karircom', 'topkarir', 'google']

const sourceLabels = {
  indeed: 'Indeed', linkedin: 'LinkedIn', jobstreet: 'Jobstreet', kitalulus: 'KitaLulus',
  glints: 'Glints', kalibrr: 'Kalibrr', glassdoor: 'Glassdoor', karircom: 'Karir.com',
  topkarir: 'TopKarir', google: 'Google Jobs',
}

export default function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const keywordParam = searchParams.get('q') || ''
  const locationParam = searchParams.get('location') || ''
  const rangeParam = Number(searchParams.get('range')) || 25
  const initiated = useRef(false)

  const [keyword, setKeyword] = useState(keywordParam)
  const [location, setLocation] = useState(locationParam)
  const [rangeKm, setRangeKm] = useState(rangeParam)
  const [jobs, setJobs] = useState([])
  const [taskStatus, setTaskStatus] = useState('idle')
  const [totalJobs, setTotalJobs] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedSources, setSelectedSources] = useState(SOURCES)
  const [taskId, setTaskId] = useState(null)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [selectedEducation, setSelectedEducation] = useState([])

  const startSearch = async (q, loc, range, sources, education) => {
    if (!q) return
    setLoading(true)
    setTaskStatus('pending')
    setJobs([])
    setTaskId(null)

    try {
      const result = await searchJobs(q, sources, loc, range, education)
      setTaskId(result.task_id)
      if (result.jobs) setJobs(result.jobs)
      if (result.total_jobs !== undefined) setTotalJobs(result.total_jobs)
      if (result.cached && !result.jobs?.length) {
        setTaskStatus('pending')
      }
    } catch {
      setTaskStatus('failed')
      setLoading(false)
    }

    const params = new URLSearchParams()
    params.set('q', q)
    if (loc.trim()) params.set('location', loc.trim())
    params.set('range', String(range))
    navigate(`/results?${params.toString()}`, { replace: true })
  }

  useEffect(() => {
    if (!initiated.current && keywordParam) {
      initiated.current = true
      startSearch(keywordParam, locationParam, rangeParam, SOURCES, selectedEducation)
    }
  }, [])

  useEffect(() => {
    if (!taskId) return
    const interval = setInterval(async () => {
      try {
        const result = await getTask(taskId)
        setTaskStatus(result.status)
        if (result.jobs) setJobs(result.jobs)
        if (result.total_jobs !== undefined) setTotalJobs(result.total_jobs)
        if (result.status === 'completed' || result.status === 'failed') {
          clearInterval(interval)
          setLoading(false)
        }
      } catch {
        console.error('Polling failed')
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [taskId])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!keyword.trim()) return
    initiated.current = true
    startSearch(keyword.trim(), location, rangeKm, selectedSources, selectedEducation)
  }

  const handleRefresh = () => {
    initiated.current = true
    startSearch(keywordParam, locationParam, rangeKm, selectedSources, selectedEducation)
  }

  const filteredJobs =
    selectedSources.length > 0
      ? jobs.filter((j) => selectedSources.includes(j.source))
      : jobs

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>
            <span className="text-slate-300 text-sm">/</span>
            <span className="text-sm text-slate-800 font-semibold truncate">
              {keywordParam || 'Cari Lowongan'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2.5">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari lowongan..."
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm shadow-sm focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 focus:outline-none focus:bg-white transition-all placeholder:text-slate-400"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="md:w-56">
              <CitySelect value={location} onChange={setLocation} />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-11 shrink-0">
              <MoveHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="1"
                max="100"
                value={rangeKm}
                onChange={(e) => setRangeKm(Number(e.target.value))}
                className="range range-xs range-primary w-20"
              />
              <span className="text-xs font-semibold text-slate-600 min-w-[2.5rem] tabular-nums">{rangeKm} km</span>
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !keyword.trim()}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Cari
            </button>
          </form>

          <div className="flex items-center justify-between mt-3 gap-3">
            <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 snap-x snap-mandatory">
              {SOURCES.map((src) => {
                const active = selectedSources.includes(src)
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() =>
                      setSelectedSources((prev) =>
                        prev.includes(src)
                          ? prev.filter((s) => s !== src)
                          : [...prev, src]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all snap-start shrink-0 whitespace-nowrap ${
                      active
                        ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {sourceLabels[src] || src}
                  </button>
                )
              })}
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Perbarui
            </button>
          </div>

          {locationParam && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200/50">
                <MapPin className="w-3 h-3" />
                {locationParam} &middot; {rangeParam} km
              </span>
            </div>
          )}
          {selectedEducation.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {selectedEducation.map((edu) => (
                <span
                  key={edu}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium border border-sky-200/50"
                >
                  <GraduationCap className="w-3 h-3" />
                  {edu}
                  <button
                    onClick={() => setSelectedEducation((prev) => prev.filter((v) => v !== edu))}
                    className="ml-0.5 hover:text-sky-900"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-36 space-y-3">
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filter Sumber
                  </div>
                </div>
                <div className="px-2 pb-3">
                  <SourceFilter
                    selected={selectedSources}
                    onChange={(id) =>
                      setSelectedSources((prev) =>
                        prev.includes(id)
                          ? prev.filter((s) => s !== id)
                          : [...prev, id]
                      )
                    }
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Pendidikan
                  </div>
                </div>
                <div className="px-2 pb-3">
                  <EducationFilter
                    selected={selectedEducation}
                    onChange={(val) =>
                      setSelectedEducation((prev) =>
                        prev.includes(val)
                          ? prev.filter((v) => v !== val)
                          : [...prev, val]
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </aside>

          <button
            onClick={() => setShowMobileFilter(true)}
            className="lg:hidden fixed bottom-6 right-6 z-30 h-12 w-12 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            <Filter className="w-5 h-5" />
          </button>

          {showMobileFilter && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)}></div>
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slideUp p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-sm text-slate-800">Filter</span>
                  <button onClick={() => setShowMobileFilter(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Sumber</div>
                  <SourceFilter
                    selected={selectedSources}
                    onChange={(id) =>
                      setSelectedSources((prev) =>
                        prev.includes(id)
                          ? prev.filter((s) => s !== id)
                          : [...prev, id]
                      )
                    }
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Pendidikan</div>
                  <EducationFilter
                    selected={selectedEducation}
                    onChange={(val) =>
                      setSelectedEducation((prev) =>
                        prev.includes(val)
                          ? prev.filter((v) => v !== val)
                          : [...prev, val]
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-sm sm:text-lg font-semibold text-slate-700">
                {taskStatus === 'completed'
                  ? `${filteredJobs.length} lowongan ditemukan`
                  : taskStatus === 'pending'
                  ? 'Mencari lowongan...'
                  : ''}
              </h2>
              {taskStatus === 'pending' && (
                <span className="loading loading-dots loading-xs text-indigo-500"></span>
              )}
            </div>

            <SearchStatus status={taskStatus} totalJobs={totalJobs} />
            <JobList
              jobs={filteredJobs}
              loading={loading && taskStatus !== 'completed'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
