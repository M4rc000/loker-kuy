import { useState, useEffect } from 'react'
import { Info, AlertTriangle, CheckCircle, X } from 'lucide-react'

const alertConfig = {
  info: {
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-white',
    iconColor: 'text-blue-500',
    barColor: 'bg-blue-500',
    Icon: Info,
  },
  danger: {
    borderColor: 'border-l-red-500',
    bgColor: 'bg-white',
    iconColor: 'text-red-500',
    barColor: 'bg-red-500',
    Icon: AlertTriangle,
  },
  success: {
    borderColor: 'border-l-green-500',
    bgColor: 'bg-white',
    iconColor: 'text-green-500',
    barColor: 'bg-green-500',
    Icon: CheckCircle,
  },
  warning: {
    borderColor: 'border-l-yellow-500',
    bgColor: 'bg-white',
    iconColor: 'text-yellow-500',
    barColor: 'bg-yellow-500',
    Icon: AlertTriangle,
  },
}

export default function ModernAlert({ type = 'info', children, onDismiss, duration = null }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  useEffect(() => {
    if (duration && duration > 0) {
      setIsAnimating(true)
      const timer = setTimeout(handleDismiss, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  if (!isVisible) return null

  const config = alertConfig[type]
  const IconComponent = config.Icon

  return (
    <div
      className={`
        ${config.borderColor} ${config.bgColor}
        relative overflow-hidden
        flex items-center justify-between
        w-auto min-w-[240px] sm:min-w-[280px] max-w-md
        p-3 pr-8
        border-l-4 rounded-r-lg
        shadow-lg
        transition-all duration-300
      `}
    >
      {duration && isAnimating && (
        <div
          className={`absolute bottom-0 left-0 h-0.5 ${config.barColor} transition-all ease-linear`}
          style={{
            width: '100%',
            animation: `shrinkBar ${duration}ms linear forwards`,
          }}
        />
      )}

      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <IconComponent className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
        <div className={`text-sm text-gray-700 ${config.iconColor}`}>
          {children}
        </div>
      </div>

      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <style>{`
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}
