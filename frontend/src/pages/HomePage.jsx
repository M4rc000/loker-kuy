import { useNavigate } from 'react-router-dom'
import SearchHero from '../components/SearchHero'
import { IndeedIcon, LinkedInIcon, JobstreetIcon, GlintsIcon, GoogleJobsIcon, KitaLulusIcon, KalibrrIcon, GlassdoorIcon, KarircomIcon, TopKarirIcon } from '../components/SourceIcons'
import { Briefcase, Globe, Zap, ChevronRight, Star, Shield, TrendingUp } from 'lucide-react'

const platforms = [
  { label: 'Indeed', Icon: IndeedIcon, value: '1.000+', color: 'from-blue-500 to-blue-600' },
  { label: 'LinkedIn', Icon: LinkedInIcon, value: '1.200+', color: 'from-blue-600 to-blue-700' },
  { label: 'Jobstreet', Icon: JobstreetIcon, value: '800+', color: 'from-orange-500 to-orange-600' },
  { label: 'KitaLulus', Icon: KitaLulusIcon, value: '600+', color: 'from-pink-500 to-pink-600' },
  { label: 'Glints', Icon: GlintsIcon, value: '500+', color: 'from-purple-500 to-purple-600' },
  { label: 'Kalibrr', Icon: KalibrrIcon, value: '700+', color: 'from-blue-500 to-blue-600' },
  { label: 'Glassdoor', Icon: GlassdoorIcon, value: '400+', color: 'from-green-500 to-green-600' },
  { label: 'Karir.com', Icon: KarircomIcon, value: '300+', color: 'from-teal-500 to-teal-600' },
  { label: 'TopKarir', Icon: TopKarirIcon, value: '200+', color: 'from-orange-500 to-orange-600' },
  { label: 'Google Jobs', Icon: GoogleJobsIcon, value: '2.000+', color: 'from-rose-500 to-rose-600' },
]

const features = [
  {
    icon: Search,
    title: 'Cari dari 10 Platform',
    desc: 'Sekali cari, langsung dapat hasil dari 10 platform lowongan terkemuka di Indonesia.',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Globe,
    title: 'Pilih Lokasi',
    desc: 'Gunakan autocomplete kota atau deteksi otomatis dengan radius yang bisa kamu atur.',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Zap,
    title: 'Hasil Real-time',
    desc: 'Data lowongan diambil langsung dari sumbernya — akurat dan terkini.',
    gradient: 'from-amber-500 to-amber-600',
  },
  {
    icon: Shield,
    title: 'Gratis & Terbuka',
    desc: 'Tidak perlu daftar atau login. Cukup ketik kata kunci dan mulai cari pekerjaan.',
    gradient: 'from-rose-500 to-rose-600',
  },
]

const cities = [
  'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang',
  'Medan', 'Makassar', 'Denpasar', 'Palembang', 'Batam',
]

export default function HomePage() {
  const navigate = useNavigate()

  const handleSearch = async (keyword, sources, location, range) => {
    const params = new URLSearchParams({ q: keyword })
    if (location.trim()) params.set('location', location.trim())
    params.set('range', String(range))
    navigate(`/results?${params.toString()}`)
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm font-medium mb-6 ring-1 ring-white/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Gabungan 10 platform lowongan kerja terbesar
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight text-balance">
            Temukan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400">
              Pekerjaan Impian
            </span>
            <br />
            dengan Sekali Klik
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Cari lowongan dari Indeed, LinkedIn, Jobstreet, KitaLulus, Glints, Kalibrr, Glassdoor, Karir.com, TopKarir, dan Google Jobs
            &mdash; cukup satu kali pencarian tanpa harus buka banyak tab.
          </p>

          <div className="max-w-3xl mx-auto">
            <SearchHero onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/5 border border-white/50 p-8">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-7">
              Lowongan dari berbagai platform
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
              {platforms.map((p) => {
                const Icon = p.Icon
                return (
                  <div key={p.label} className="text-center group cursor-default">
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center group-hover:shadow-lg group-hover:border-slate-300/80 transition-all duration-300 group-hover:scale-105">
                        <Icon className="w-9 h-9" />
                      </div>
                    </div>
                    <div className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${p.color}`}>
                      {p.label}
                    </div>
                    <div className="text-2xl font-extrabold text-slate-800 mt-0.5">{p.value}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">lowongan</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-4">
            KENAPA KAMI
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Dibuat untuk Kamu yang{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Serius Cari Kerja
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Semua fitur yang kamu butuhkan untuk mencari kerja, tanpa ribet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300/80 transition-all duration-300"
              >
                <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg shadow-${f.gradient.split(' ')[0].replace('from-', '')}/20`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-[15px]">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold mb-4">
              KOTA POPULER
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Cari Lowongan di Kota Besar
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  const params = new URLSearchParams({ q: '', location: city, range: '25' })
                  navigate(`/results?${params.toString()}`)
                }}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium shadow-sm hover:shadow-md hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-semibold mb-4 backdrop-blur-sm">
            SIAP MULAI?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Ribuan Lowongan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              Menanti Kamu
            </span>
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-lg mx-auto">
            Masukkan kata kunci di atas dan temukan ribuan lowongan dari 5 platform sekaligus.
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-2xl shadow-2xl hover:shadow-indigo-500/25 hover:bg-indigo-50 transition-all"
          >
            Mulai Cari Kerja
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  )
}

function Search(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
