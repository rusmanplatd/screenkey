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

type LayoutDirection = 'vertical' | 'horizontal' | 'wrapped'

interface KeyDisplayProps {
  keys: KeyEvent[]
  layoutDirection?: LayoutDirection
  fontSize?: number
  theme: Theme
}

function KeyDisplay({ keys, layoutDirection = 'vertical', fontSize = 20, theme }: KeyDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const threshold = 50 // pixels from bottom to consider "at bottom"

    if (layoutDirection === 'horizontal') {
      // For horizontal, check if near the right edge
      const isAtEnd = container.scrollWidth - container.scrollLeft - container.clientWidth < threshold
      if (isAtEnd) {
        container.scrollLeft = container.scrollWidth
      }
    } else if (layoutDirection === 'vertical' || layoutDirection === 'wrapped') {
      // For vertical/wrapped, check if near the bottom
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
      if (isAtBottom) {
        container.scrollTop = container.scrollHeight
      }
    }
  }, [keys, layoutDirection])

  if (keys.length === 0) {
    return null
  }

  return (
    <div
      className={`key-display-container ${layoutDirection}`}
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
