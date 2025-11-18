import { useEffect } from 'react'
import './Prize.css'

interface PrizeProps {
  emoji: string
  x: number
  y: number
  onComplete: () => void
}

function Prize({ emoji, x, y, onComplete }: PrizeProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000) // Удаляем приз через 3 секунды

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div 
      className="prize"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {emoji}
    </div>
  )
}

export default Prize

