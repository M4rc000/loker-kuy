import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

export const searchJobs = async (keyword, sources = [], location = '', rangeKm = 25, education = []) => {
  const { data } = await api.post('/api/search', { keyword, sources, location, range_km: rangeKm, education })
  return data
}

export const getTask = async (taskId) => {
  const { data } = await api.get(`/api/task/${taskId}`)
  return data
}
