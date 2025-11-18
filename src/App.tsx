import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import DiscoBall from './components/DiscoBall'
import Prize from './components/Prize'

const PRIZES = ['🎁', '🎉', '⭐', '💎', '🏆', '🎊', '✨', '🌟']
const MAX_SPEED = 50
const CLICK_SPEED_INCREMENT = 2
const SPEED_DECAY = 0.5

interface FallingPrize {
  id: number
  emoji: string
  x: number
  y: number
}

function App() {
  const [clicks, setClicks] = useState(0)
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [fallingPrizes, setFallingPrizes] = useState<FallingPrize[]>()
  const [showMaxSpeedEffect, setShowMaxSpeedEffect] = useState(false)
  const prizeIdCounter = useRef(0)
  const lastPrizeTime = useRef(0)

  // Замедление скорости со временем
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationSpeed(prev => {
        if (prev > 0) {
          return Math.max(0, prev - SPEED_DECAY)
        }
        return 0
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Генерация призов при максимальной скорости
  useEffect(() => {
    if (rotationSpeed >= MAX_SPEED) {
      setShowMaxSpeedEffect(true)
      
      const prizeInterval = setInterval(() => {
        const now = Date.now()
        if (now - lastPrizeTime.current > 200) {
          lastPrizeTime.current = now
          
          const newPrize: FallingPrize = {
            id: prizeIdCounter.current++,
            emoji: PRIZES[Math.floor(Math.random() * PRIZES.length)],
            x: Math.random() * 80 + 10, // 10% - 90% ширины экрана
            y: 40, // Начинаем с позиции дискошара
          }
          
          setFallingPrizes(prev => [...(prev || []), newPrize])
        }
      }, 200)

      return () => clearInterval(prizeInterval)
    } else {
      setShowMaxSpeedEffect(false)
    }
  }, [rotationSpeed])

  // Очистка призов
  const removePrize = useCallback((id: number) => {
    setFallingPrizes(prev => prev?.filter(p => p.id !== id) || [])
  }, [])

  const handleDiscoBallClick = () => {
    setClicks(prev => prev + 1)
    setRotationSpeed(prev => Math.min(MAX_SPEED, prev + CLICK_SPEED_INCREMENT))
  }

  const speedPercentage = (rotationSpeed / MAX_SPEED) * 100

  return (
    <div className="app">
      <div className="background">
        <div className="stars"></div>
        <div className="clouds">
          <div className="cloud cloud-1">💕</div>
          <div className="cloud cloud-2">💜</div>
          <div className="cloud cloud-3">⭐</div>
        </div>
      </div>

      <div className="content">
        <h1 className="title">Дискошар</h1>
        
        <div className="disco-container">
          <DiscoBall 
            rotationSpeed={rotationSpeed} 
            onClick={handleDiscoBallClick}
            isMaxSpeed={showMaxSpeedEffect}
          />
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Кликов:</span>
            <span className="stat-value">{clicks}</span>
          </div>
          <div className="speed-bar">
            <div className="speed-bar-fill" style={{ width: `${speedPercentage}%` }}></div>
          </div>
          <div className="stat-item">
            <span className="stat-label">Скорость:</span>
            <span className="stat-value">{Math.round(speedPercentage)}%</span>
          </div>
        </div>

        {speedPercentage >= 100 && (
          <div className="max-speed-message">
            🎉 МАКСИМАЛЬНАЯ СКОРОСТЬ! ПРИЗЫ! 🎉
          </div>
        )}

        <p className="instruction">
          Кликайте на дискошар, чтобы раскрутить его!
        </p>
      </div>

      {fallingPrizes?.map(prize => (
        <Prize
          key={prize.id}
          emoji={prize.emoji}
          x={prize.x}
          y={prize.y}
          onComplete={() => removePrize(prize.id)}
        />
      ))}
    </div>
  )
}

export default App

