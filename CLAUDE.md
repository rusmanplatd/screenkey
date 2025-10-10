# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScreenKey is a cross-platform desktop application built with **Tauri 2.4 + React 19 + Rust** that displays keyboard inputs on screen in real-time. The application uses platform-specific keyboard capture implementations: `evdev` for Linux (global `/dev/input` access) and `rdev` for macOS/Windows.

## Development Commands

All commands must be run from the `screenkey-app/` directory.

### Development
```bash
cd screenkey-app

# Development mode (requires sudo on Linux for keyboard capture)
sudo npm run tauri:dev

# Frontend-only development (without Tauri)
npm run dev

# TypeScript type checking
npx tsc --noEmit
```

### Building
```bash
cd screenkey-app

# Build frontend only
npm run build

# Build complete Tauri application (frontend + backend)
npm run tauri:build

# Build output locations:
# - Linux: src-tauri/target/release/bundle/{appimage,deb}/
# - macOS: src-tauri/target/release/bundle/macos/
# - Windows: src-tauri/target/release/bundle/msi/
```

### Rust Development
```bash
cd screenkey-app/src-tauri

# Format Rust code
cargo fmt --all

# Linting with Clippy
cargo clippy --all-targets -- -D warnings

# Check without building
cargo check
```

### Release Management
```bash
# Automated version bump and release (from project root)
cd screenkey-app
npm run release          # Patch version (0.0.x)
npm run release:minor    # Minor version (0.x.0)
npm run release:major    # Major version (x.0.0)

# This script:
# 1. Checks for uncommitted changes (fails if dirty)
# 2. Bumps version in package.json, tauri.conf.json, Cargo.toml
# 3. Updates CHANGELOG.md with new version and date
# 4. Commits changes with "chore: bump version to X.X.X"
# 5. Creates git tag (vX.X.X)
# 6. Pushes to origin (triggers GitHub Actions release builds)
```

## Architecture

### Frontend-Backend Communication (Tauri IPC)

**Rust → React:** Keyboard events are emitted from Rust backend via Tauri's event system:

```rust
// src-tauri/src/main.rs
app_handle.emit("key-press", KeyEvent {
    key: String,
    modifiers: Vec<String>
})
```

```typescript
// src/App.tsx
import { listen } from '@tauri-apps/api/event'

listen<KeyEvent>('key-press', (event) => {
    setKeys(prev => [...prev, { ...event.payload, timestamp: Date.now() }])
})
```

**React → Rust:** Window control operations use Tauri window API:

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'
const appWindow = getCurrentWindow()

await appWindow.minimize()
await appWindow.close()
await appWindow.startDragging()
```

### Platform-Specific Keyboard Capture

The backend uses conditional compilation for different platforms:

**Linux (`src-tauri/src/main.rs:279-352`):**
- Uses `evdev` crate to read from `/dev/input/event*` devices
- Requires root privileges or user in `input` group
- `find_keyboard_devices()` scans for devices with keyboard capabilities
- Tracks modifier state globally in `AppState::modifiers` Mutex
- Adaptive polling: 1ms when events detected, 10ms when idle (CPU optimization)

**macOS/Windows (`src-tauri/src/main.rs:355-402`):**
- Uses `rdev` crate for cross-platform keyboard hooks
- Requires Accessibility permissions (macOS) or Administrator (Windows)
- Same modifier state tracking mechanism

### State Management

**Frontend State (React hooks):**
- `keys: KeyEvent[]` - Keypress history with timestamps
- `layoutDirection` - 'vertical' | 'horizontal' | 'wrapped'
- `settings` - Persisted to localStorage, contains:
  - `displayDuration` - Auto-hide timer (0 = never hide)
  - `opacity` - Window opacity (0.1-1.0)
  - `fontSize` - Key display size (12-32px)
  - `theme` - Active theme name
  - `customTheme?` - Custom theme colors

**Backend State (Rust Mutex):**
- `AppState::modifiers: Mutex<Vec<String>>` - Currently pressed modifier keys
- Thread-safe access from keyboard capture thread

### Key Components

**`src/App.tsx` (401 lines):**
- Event listener setup and cleanup
- Settings panel rendering and persistence
- Auto-hide timer (`useEffect` with `displayDuration`)
- Theme management (6 presets + custom)
- Window control handlers (drag, minimize, close)

**`src/components/KeyDisplay.tsx` (84 lines):**
- Smart auto-scroll: only scrolls when user is at bottom (prevents forced scrolling during manual navigation)
- Layout-aware scrolling (horizontal: `scrollLeft`, vertical/wrapped: `scrollTop`)
- Per-key rendering with modifier support

**`src-tauri/src/main.rs` (409 lines):**
- Platform detection via `#[cfg(target_os = "...")]`
- Key mapping functions: `key_to_string()`, `rdev_key_to_string()`
- Always-on-top enforcement: re-asserts every 2 seconds in background thread
- Modifier tracking on press/release

## Important Implementation Details

### Always-on-Top Window
The window uses periodic re-assertion to stay on top:
```rust
// main.rs:273-276
std::thread::spawn(move || loop {
    std::thread::sleep(std::time::Duration::from_secs(2));
    let _ = window_clone.set_always_on_top(true);
});
```

### Smart Scroll Behavior
Auto-scroll only triggers when user is near bottom/end (50px threshold):
```typescript
// KeyDisplay.tsx:34-48
const threshold = 50
const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
if (isAtBottom) {
    container.scrollTop = container.scrollHeight
}
```

### Drag-Handle Event Propagation
Buttons in the header must stop propagation to prevent drag interference:
```tsx
<button onMouseDown={(e) => e.stopPropagation()}>
```

### Settings Persistence
Settings are automatically saved to localStorage on every change:
```typescript
useEffect(() => {
    localStorage.setItem('screenkey-settings', JSON.stringify(settings))
}, [settings])
```

## CI/CD Pipeline

**`.github/workflows/ci.yml`:**
- Runs on push/PR to main/master
- Steps: TypeScript type check → Frontend build → Rust fmt check → Clippy → Tauri build

**`.github/workflows/release.yml`:**
- Triggered by version tags (`v*`) or manual dispatch
- Builds for 4 targets: Linux x64, macOS Intel/ARM, Windows x64
- Creates draft release, uploads binaries, auto-publishes

## System Dependencies (Linux)

Required for building on Ubuntu/Debian:
```bash
sudo apt-get install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl wget file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libx11-dev
```

## Running on Linux

The app requires elevated permissions for global keyboard capture:

```bash
# Option 1: Run with sudo
sudo npm run tauri:dev
sudo ./src-tauri/target/release/screenkey-app

# Option 2: Add user to input group (requires logout)
sudo usermod -a -G input $USER
# Then run without sudo after logging out/in
```

## File Structure Notes

- `screenkey-app/` - Main application directory (all npm commands run here)
- `screenkey-app/src/` - React frontend (TypeScript + CSS)
- `screenkey-app/src-tauri/` - Rust backend (Tauri application)
- `screenkey-app/src-tauri/Cargo.toml` - Platform-specific dependencies with `[target.'cfg(...)']`
- Root directory contains project-level files (CHANGELOG.md, RELEASE.md)

## Key Rust Dependencies

- `tauri = "2.4"` - Desktop app framework
- `evdev = "0.12"` - Linux keyboard capture (Linux only)
- `rdev = "0.5"` - Cross-platform keyboard hooks (macOS/Windows only)
- `x11 = "2.21"` - X11 display server access (Linux only)
- `serde` + `serde_json` - Serialization for IPC

## Vite Configuration

Development server runs on port **1420** (strict port mode enabled). Environment variables with `VITE_` or `TAURI_` prefix are exposed to frontend.
