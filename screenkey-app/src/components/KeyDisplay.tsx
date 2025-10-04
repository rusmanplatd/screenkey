import { useEffect, useRef } from 'react'
import './KeyDisplay.css'

interface KeyEvent {
  key: string
  modifiers: string[]
  timestamp: number
}

interface Theme {
  name: string
  modifierColor: string
  keyColor: string
  backgroundColor: string
  itemBackground: string
}

interface KeyDisplayProps {
  keys: KeyEvent[]
  isHorizontal?: boolean
  fontSize?: number
  theme: Theme
}

function KeyDisplay({ keys, isHorizontal = false, fontSize = 20, theme }: KeyDisplayProps) {
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
        <div
          key={index}
          className="key-item"
          style={{
            fontSize: `${fontSize}px`,
            background: theme.itemBackground
          }}
        >
          {keyEvent.modifiers.length > 0 && (
            <span className="modifiers" style={{ color: theme.modifierColor }}>
              {keyEvent.modifiers.join(' + ')} +{' '}
            </span>
          )}
          <span className="key" style={{ color: theme.keyColor }}>
            {keyEvent.key}
          </span>
        </div>
      ))}
    </div>
  )
}

export default KeyDisplay
