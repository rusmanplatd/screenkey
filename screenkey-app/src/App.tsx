import { useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import KeyDisplay from './components/KeyDisplay'
import './App.css'

interface KeyEvent {
  key: string
  modifiers: string[]
}

function App() {
  const [keys, setKeys] = useState<KeyEvent[]>([])
  const [isHorizontal, setIsHorizontal] = useState(false)

  useEffect(() => {
    let unlisten: (() => void) | undefined
    let isSubscribed = true

    const setupListener = async () => {
      console.log('Setting up key-press listener...')
      const unlistenFn = await listen<KeyEvent>('key-press', (event) => {
        console.log('Received key event:', event.payload)
        if (isSubscribed) {
          setKeys((prev) => [...prev, event.payload])
        }
      })
      unlisten = unlistenFn
      console.log('Listener set up successfully')
    }

    setupListener()

    return () => {
      isSubscribed = false
      if (unlisten) {
        unlisten()
      }
    }
  }, [])

  const clearHistory = () => {
    setKeys([])
  }

  const toggleDirection = () => {
    setIsHorizontal(!isHorizontal)
  }

  const handleDragStart = async () => {
    const appWindow = getCurrentWindow()
    await appWindow.startDragging()
  }

  return (
    <div className="app">
      <div className="header" onMouseDown={handleDragStart}>
        <div style={{ color: 'white', fontSize: '14px', cursor: 'move' }}>
          ScreenKey
        </div>
        <div className="header-buttons">
          <button onClick={toggleDirection} className="toggle-btn" title="Toggle direction">
            {isHorizontal ? '↕' : '↔'}
          </button>
          {keys.length > 0 && (
            <button onClick={clearHistory} className="clear-btn">
              Clear
            </button>
          )}
        </div>
      </div>
      <KeyDisplay keys={keys} isHorizontal={isHorizontal} />
      {keys.length === 0 && (
        <div style={{ color: '#888', marginTop: '20px' }}>
          Waiting for keyboard input...
        </div>
      )}
    </div>
  )
}

export default App
