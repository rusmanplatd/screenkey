import './KeyDisplay.css'

interface KeyEvent {
  key: string
  modifiers: string[]
}

interface KeyDisplayProps {
  keys: KeyEvent[]
}

function KeyDisplay({ keys }: KeyDisplayProps) {
  if (keys.length === 0) {
    return null
  }

  return (
    <div className="key-display-container">
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
