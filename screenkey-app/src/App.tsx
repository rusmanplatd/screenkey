import { useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import KeyDisplay from './components/KeyDisplay'
import './App.css'

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

interface Settings {
  displayDuration: number
  opacity: number
  fontSize: number
  theme: string
  customTheme?: Theme
}

const THEMES: Record<string, Theme> = {
  default: {
    name: 'Default',
    modifierColor: '#fbbf24',
    keyColor: '#60a5fa',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    itemBackground: 'rgba(255, 255, 255, 0.1)'
  },
  ocean: {
    name: 'Ocean',
    modifierColor: '#06b6d4',
    keyColor: '#3b82f6',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    itemBackground: 'rgba(59, 130, 246, 0.15)'
  },
  forest: {
    name: 'Forest',
    modifierColor: '#84cc16',
    keyColor: '#22c55e',
    backgroundColor: 'rgba(20, 30, 20, 0.9)',
    itemBackground: 'rgba(34, 197, 94, 0.15)'
  },
  sunset: {
    name: 'Sunset',
    modifierColor: '#f97316',
    keyColor: '#ec4899',
    backgroundColor: 'rgba(30, 20, 30, 0.9)',
    itemBackground: 'rgba(236, 72, 153, 0.15)'
  },
  midnight: {
    name: 'Midnight',
    modifierColor: '#a78bfa',
    keyColor: '#818cf8',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    itemBackground: 'rgba(129, 140, 248, 0.15)'
  },
  monochrome: {
    name: 'Monochrome',
    modifierColor: '#d1d5db',
    keyColor: '#f3f4f6',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    itemBackground: 'rgba(255, 255, 255, 0.1)'
  },
  custom: {
    name: 'Custom',
    modifierColor: '#fbbf24',
    keyColor: '#60a5fa',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    itemBackground: 'rgba(255, 255, 255, 0.1)'
  }
}

const DEFAULT_SETTINGS: Settings = {
  displayDuration: 10000000000, // 10000000 seconds
  opacity: 0.9,
  fontSize: 16,
  theme: 'default'
}

function App() {
  const [keys, setKeys] = useState<KeyEvent[]>([])
  const [isHorizontal, setIsHorizontal] = useState(false)
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [showSettings, setShowSettings] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('screenkey-settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('screenkey-settings', JSON.stringify(settings))
  }, [settings])

  // Auto-remove keys based on display duration
  useEffect(() => {
    if (settings.displayDuration <= 0) return

    const interval = setInterval(() => {
      const now = Date.now()
      setKeys(prev => prev.filter(key => now - key.timestamp < settings.displayDuration))
    }, 100)

    return () => clearInterval(interval)
  }, [settings.displayDuration])

  useEffect(() => {
    let unlisten: (() => void) | undefined
    let isSubscribed = true

    const setupListener = async () => {
      console.log('Setting up key-press listener...')
      const unlistenFn = await listen<Omit<KeyEvent, 'timestamp'>>('key-press', (event) => {
        console.log('Received key event:', event.payload)
        if (isSubscribed) {
          setKeys((prev) => [...prev, { ...event.payload, timestamp: Date.now() }])
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

  const handleMinimize = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const appWindow = getCurrentWindow()
    await appWindow.minimize()
  }

  const handleClose = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const appWindow = getCurrentWindow()
    await appWindow.close()
  }

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateCustomThemeColor = (colorKey: keyof Theme, value: string) => {
    setSettings(prev => ({
      ...prev,
      customTheme: {
        ...(prev.customTheme || THEMES.custom),
        [colorKey]: value
      }
    }))
  }

  const getCurrentTheme = (): Theme => {
    if (settings.theme === 'custom' && settings.customTheme) {
      return settings.customTheme
    }
    return THEMES[settings.theme] || THEMES.default
  }

  const currentTheme = getCurrentTheme()

  return (
    <div className="app" style={{ background: currentTheme.backgroundColor.replace(/[\d.]+\)$/, `${settings.opacity})`) }}>
      <div className="header" onMouseDown={handleDragStart}>
        <div className="drag-handle">
          ScreenKey
        </div>
        <div className="header-buttons">
          <button
            onClick={() => setShowSettings(!showSettings)}
            onMouseDown={(e) => e.stopPropagation()}
            className="toggle-btn"
            title="Settings"
          >
            ⚙
          </button>
          {keys.length > 0 && (
            <button
              onClick={clearHistory}
              onMouseDown={(e) => e.stopPropagation()}
              className="clear-btn"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleMinimize}
            onMouseDown={(e) => e.stopPropagation()}
            className="window-btn minimize-btn"
            title="Minimize"
          >
            −
          </button>
          <button
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
            className="window-btn close-btn"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>

          <div className="setting-item">
            <label>Layout Direction</label>
            <div className="direction-toggle">
              <button
                className={`direction-btn ${!isHorizontal ? 'active' : ''}`}
                onClick={() => setIsHorizontal(false)}
              >
                ↕ Vertical
              </button>
              <button
                className={`direction-btn ${isHorizontal ? 'active' : ''}`}
                onClick={() => setIsHorizontal(true)}
              >
                ↔ Horizontal
              </button>
            </div>
          </div>

          <div className="setting-item">
            <label>Display Duration (ms)</label>
            <input
              type="number"
              value={settings.displayDuration}
              onChange={(e) => updateSetting('displayDuration', parseInt(e.target.value) || 0)}
              min="0"
              step="500"
            />
            <span className="setting-hint">0 = Never auto-hide</span>
          </div>

          <div className="setting-item">
            <label>Opacity</label>
            <input
              type="range"
              value={settings.opacity}
              onChange={(e) => updateSetting('opacity', parseFloat(e.target.value))}
              min="0.1"
              max="1"
              step="0.1"
            />
            <span className="setting-value">{(settings.opacity * 100).toFixed(0)}%</span>
          </div>

          <div className="setting-item">
            <label>Font Size</label>
            <input
              type="range"
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
              min="12"
              max="32"
              step="2"
            />
            <span className="setting-value">{settings.fontSize}px</span>
          </div>

          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value)}
              className="theme-select"
            >
              {Object.entries(THEMES).map(([key, theme]) => (
                <option key={key} value={key}>{theme.name}</option>
              ))}
            </select>
          </div>

          {settings.theme === 'custom' && (
            <>
              <div className="setting-item">
                <label>Modifier Color</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={currentTheme.modifierColor}
                    onChange={(e) => updateCustomThemeColor('modifierColor', e.target.value)}
                    className="color-input"
                  />
                  <input
                    type="text"
                    value={currentTheme.modifierColor}
                    onChange={(e) => updateCustomThemeColor('modifierColor', e.target.value)}
                    className="color-text-input"
                  />
                </div>
              </div>

              <div className="setting-item">
                <label>Key Color</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={currentTheme.keyColor}
                    onChange={(e) => updateCustomThemeColor('keyColor', e.target.value)}
                    className="color-input"
                  />
                  <input
                    type="text"
                    value={currentTheme.keyColor}
                    onChange={(e) => updateCustomThemeColor('keyColor', e.target.value)}
                    className="color-text-input"
                  />
                </div>
              </div>

              <div className="setting-item">
                <label>Item Background</label>
                <div className="color-picker-group">
                  <input
                    type="text"
                    value={currentTheme.itemBackground}
                    onChange={(e) => updateCustomThemeColor('itemBackground', e.target.value)}
                    className="color-text-input"
                    placeholder="rgba(255, 255, 255, 0.1)"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <KeyDisplay
        keys={keys}
        isHorizontal={isHorizontal}
        fontSize={settings.fontSize}
        theme={currentTheme}
      />
      {keys.length === 0 && !showSettings && (
        <div style={{ color: '#888', marginTop: '20px' }}>
          Waiting for keyboard input...
        </div>
      )}
    </div>
  )
}

export default App
