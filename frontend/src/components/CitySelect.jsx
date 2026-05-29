import { useState, useRef, useEffect, useMemo } from 'react'
import { MapPin, Check, ChevronDown, Crosshair, Search } from 'lucide-react'
import INDONESIAN_CITIES from '../data/cities'
import Swal from '../utils/AlertContainer'

export default function CitySelect({ value, onChange, onDetect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const listRef = useRef(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return INDONESIAN_CITIES.slice(0, 50)
    const q = query.toLowerCase()
    return INDONESIAN_CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 60)
  }, [query])

  const selectCity = (city) => {
    setQuery(city)
    onChange(city)
    setOpen(false)
  }

  const handleInput = (e) => {
    setQuery(e.target.value)
    onChange(e.target.value)
    setHighlightIndex(-1)
    if (!open) setOpen(true)
  }

  const handleFocus = () => {
    setOpen(true)
    setHighlightIndex(-1)
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!open) return
    const item = listRef.current?.children[highlightIndex]
    item?.scrollIntoView({ block: 'nearest' })
  }, [highlightIndex, open])

  const handleKey = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightIndex >= 0 && highlightIndex < filtered.length) {
          selectCity(filtered[highlightIndex])
        }
        break
      case 'Escape':
        setOpen(false)
        setHighlightIndex(-1)
        break
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire({ icon: 'error', text: 'Geolocation tidak didukung browser kamu', duration: 4000 })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        setQuery(loc)
        onChange(loc)
        Swal.fire({ icon: 'success', text: 'Lokasi berhasil dideteksi', duration: 2000 })
      },
      () => Swal.fire({ icon: 'error', text: 'Gagal mendeteksi lokasi. Coba masukkan manual.', duration: 4000 })
    )
    onDetect?.()
  }

  const highlightMatch = (city) => {
    if (!query.trim()) return city
    const idx = city.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return city
    return (
      <>
        {city.slice(0, idx)}
        <span className="text-indigo-600 font-semibold bg-indigo-50 rounded px-0.5">
          {city.slice(idx, idx + query.length)}
        </span>
        {city.slice(idx + query.length)}
      </>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari kota..."
          className="w-full h-11 pl-10 pr-14 sm:pr-20 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm shadow-sm focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 focus:outline-none transition-all placeholder:text-slate-400"
          value={query}
          onChange={handleInput}
          onFocus={handleFocus}
          onKeyDown={handleKey}
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          <button
            type="button"
            onClick={detectLocation}
            className="h-8 px-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1 text-xs font-medium"
            title="Deteksi lokasi otomatis"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deteksi</span>
          </button>
          <span className="w-px h-5 bg-slate-200"></span>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
              open ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden animate-fadeIn">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              <Search className="w-5 h-5 mx-auto mb-1 opacity-50" />
              Kota tidak ditemukan
            </div>
          ) : (
            <ul ref={listRef} className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
              {filtered.map((city, i) => (
                <li
                  key={city}
                  onClick={() => selectCity(city)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer transition-colors ${
                    i === highlightIndex
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 shrink-0 ${
                    i === highlightIndex ? 'text-indigo-500' : 'text-slate-300'
                  }`} />
                  <span className="flex-1">{highlightMatch(city)}</span>
                  {i === highlightIndex && (
                    <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
