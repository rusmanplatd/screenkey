import { useEffect, useRef } from 'react'
import './KeyDisplay.css'

interface KeyEvent {
  key: string
  modifiers: string[]
}

interface KeyDisplayProps {
  keys: KeyEvent[]
  isHorizontal?: boolean
}

function KeyDisplay({ keys, isHorizontal = false }: KeyDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      if (isHorizontal) {
        containerRef.current.scrollLeft = containerRef.current.scrollWidth
      } else {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }
  }, [keys, isHorizontal])

  if (keys.length === 0) {
    return null
  }

  return (
    <div
      className={`key-display-container ${isHorizontal ? 'horizontal' : 'vertical'}`}
      ref={containerRef}
    >
      {keys.map((keyEvent, index) => (
        <div key={index} className="key-item">
          {keyEvent.modifiers.length > 0 && (
            <span className="modifiers">
              {keyEvent.modifiers.join(' + ')} +{' '}
            </span>
          )}
          <span className="key">{keyEvent.key}</span>
        </div>
      ))}
    </div>
  )
}

export default KeyDisplay
