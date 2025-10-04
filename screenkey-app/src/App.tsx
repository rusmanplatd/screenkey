import { useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import KeyDisplay from './components/KeyDisplay'
import './App.css'

interface KeyEvent {
  key: string
  modifiers: string[]
}

function App() {
  const [keys, setKeys] = useState<KeyEvent[]>([])

  useEffect(() => {
    let unlisten: (() => void) | undefined
    let isSubscribed = true

    const setupListener = async () => {
      console.log('Setting up key-press listener...')
      const unlistenFn = await listen<KeyEvent>('key-press', (event) => {
        console.log('Received key event:', event.payload)
        if (isSubscribed) {
          setKeys((prev) => [...prev.slice(-4), event.payload])
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

  return (
    <div className="app">
      <div style={{ color: 'white', marginBottom: '20px' }}>
        ScreenKey Active - Press any key
      </div>
      <KeyDisplay keys={keys} />
      {keys.length === 0 && (
        <div style={{ color: '#888', marginTop: '20px' }}>
          Waiting for keyboard input...
        </div>
      )}
    </div>
  )
}

export default App
