import { useState, useEffect } from 'react'
import ModernAlert from '../components/ui/ModernAlert'

let alertQueue = []
let setAlertsCallback = null

const Swal = {
  fire: (config) => {
    if (typeof config === 'string') {
      config = { text: config }
    }

    const iconMap = {
      success: 'success',
      error: 'danger',
      warning: 'warning',
      info: 'info',
    }

    const alertConfig = {
      id: Date.now() + Math.random(),
      title: config.title,
      text: config.text,
      type: iconMap[config.icon || 'info'] || 'info',
      duration: config.duration || 4000,
    }

    alertQueue.push(alertConfig)
    if (setAlertsCallback) {
      setAlertsCallback([...alertQueue])
    }
  },
}

export function AlertContainer() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    setAlertsCallback = setAlerts
    return () => { setAlertsCallback = null }
  }, [])

  const removeAlert = (id) => {
    alertQueue = alertQueue.filter((a) => a.id !== id)
    setAlerts([...alertQueue])
  }

  return (
    <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-2 pointer-events-none">
      {alerts.map((alert) => (
        <div key={alert.id} className="pointer-events-auto">
          <ModernAlert
            type={alert.type}
            duration={alert.duration}
            onDismiss={() => removeAlert(alert.id)}
          >
            {alert.title && <div className="font-semibold mb-0.5">{alert.title}</div>}
            {alert.text}
          </ModernAlert>
        </div>
      ))}
    </div>
  )
}

export default Swal
