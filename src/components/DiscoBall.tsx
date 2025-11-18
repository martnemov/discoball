import { useEffect, useRef } from 'react'
import './DiscoBall.css'

interface DiscoBallProps {
  rotationSpeed: number
  onClick: () => void
  isMaxSpeed: boolean
}

function DiscoBall({ rotationSpeed, onClick, isMaxSpeed }: DiscoBallProps) {
  const ballRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      if (ballRef.current) {
        rotationRef.current += rotationSpeed * 0.1
        ballRef.current.style.transform = `rotateY(${rotationRef.current}deg) rotateX(10deg)`
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [rotationSpeed])

  return (
    <div 
      className={`disco-ball-wrapper ${isMaxSpeed ? 'max-speed' : ''}`}
      onClick={onClick}
    >
      <div className="disco-ball" ref={ballRef}>
        <div className="disco-ball-sphere">
          {Array.from({ length: 120 }).map((_, i) => (
            <div key={i} className="mirror-tile" style={{
              '--row': Math.floor(i / 12),
              '--col': i % 12,
            } as React.CSSProperties}></div>
          ))}
        </div>
        <div className="light-beam light-beam-1"></div>
        <div className="light-beam light-beam-2"></div>
        <div className="light-beam light-beam-3"></div>
      </div>
    </div>
  )
}

export default DiscoBall

