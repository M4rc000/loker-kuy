import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Zap, Building2, Globe } from 'lucide-react'
import { IndeedIcon, LinkedInIcon, JobstreetIcon, GlintsIcon, GoogleJobsIcon, KitaLulusIcon, KalibrrIcon, GlassdoorIcon, KarircomIcon, TopKarirIcon } from './SourceIcons'
import CitySelect from './CitySelect'

const sources = [
  { id: 'indeed', label: 'Indeed', Icon: IndeedIcon },
  { id: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { id: 'jobstreet', label: 'Jobstreet', Icon: JobstreetIcon },
  { id: 'kitalulus', label: 'KitaLulus', Icon: KitaLulusIcon },
  { id: 'glints', label: 'Glints', Icon: GlintsIcon },
  { id: 'kalibrr', label: 'Kalibrr', Icon: KalibrrIcon },
  { id: 'glassdoor', label: 'Glassdoor', Icon: GlassdoorIcon },
  { id: 'karircom', label: 'Karir.com', Icon: KarircomIcon },
  { id: 'topkarir', label: 'TopKarir', Icon: TopKarirIcon },
  { id: 'google', label: 'Google Jobs', Icon: GoogleJobsIcon },
]

const stats = [
  { icon: Building2, value: '10', label: 'Platform Lowongan' },
  { icon: Globe, value: '50+', label: 'Kota Tersedia' },
  { icon: Zap, value: 'Real-time', label: 'Hasil Langsung' },
]

export default function SearchHero({ onSearch }) {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [rangeKm, setRangeKm] = useState(25)
  const [selectedSources, setSelectedSources] = useState(sources.map(s => s.id))
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const toggleSource = (id) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!keyword.trim() || selectedSources.length === 0) return

    setLoading(true)
    try {
      if (onSearch) await onSearch(keyword, selectedSources, location, rangeKm)
      const params = new URLSearchParams({ q: keyword.trim() })
      if (location.trim()) params.set('location', location.trim())
      params.set('range', rangeKm)
      navigate(`/results?${params.toString()}`)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="space-y-5">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari lowongan... (contoh: software engineer)"
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/95 backdrop-blur-sm border-0 text-slate-800 text-lg shadow-xl ring-1 ring-white/60 focus:ring-2 focus:ring-indigo-400/50 focus:outline-none transition-all placeholder:text-slate-400"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-base shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          disabled={loading || !keyword.trim()}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Search className="w-5 h-5" />
          )}
          {loading ? 'Mencari...' : 'Cari'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <CitySelect value={location} onChange={setLocation} />
        </div>
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 shrink-0">
          <span className="text-xs text-white/70 whitespace-nowrap">Radius</span>
          <input
            type="range"
            min="1"
            max="100"
            value={rangeKm}
            onChange={(e) => setRangeKm(Number(e.target.value))}
            className="range range-xs range-accent w-24"
          />
          <span className="text-xs font-bold text-white min-w-[2.5rem]">{rangeKm} km</span>
        </div>
      </div>

      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 snap-x snap-mandatory">
        {sources.map((src) => {
          const active = selectedSources.includes(src.id)
          const Icon = src.Icon
          return (
            <button
              key={src.id}
              type="button"
              onClick={() => toggleSource(src.id)}
              className={`
                inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 snap-start shrink-0
                ${active
                  ? 'bg-white text-slate-800 shadow-lg shadow-black/10 scale-105 ring-1 ring-white/30'
                  : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white/90 backdrop-blur-sm'
                }
              `}
            >
              <Icon />
              {src.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="flex items-center gap-1.5 sm:gap-2 text-white/70">
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[11px] sm:text-xs">
                <span className="font-bold text-white/90">{s.value}</span>
                <span className="ml-1">{s.label}</span>
              </span>
            </div>
          )
        })}
      </div>
    </form>
  )
}
