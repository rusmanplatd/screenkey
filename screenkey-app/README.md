# ScreenKey

A modern, cross-platform screencast tool to display keyboard inputs on screen. Perfect for tutorials, demonstrations, and vim command visualization.

![ScreenKey Demo](https://img.shields.io/badge/Platform-Linux%20%7C%20macOS%20%7C%20Windows-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🎯 **Global Keyboard Capture** - Captures keypresses from any application (all platforms)
- 🔄 **Three Layout Modes** - Switch between vertical, horizontal, and wrapped display
- 📜 **Scrollable History** - View complete command sequences
- 🎨 **Modern UI** - Transparent overlay with smooth animations
- 🖱️ **Draggable Window** - Position anywhere on screen
- ⌨️ **Modifier Keys** - Shows Ctrl, Shift, Alt, Super/Cmd/Win combinations
- 🧹 **Clear History** - Reset display between tutorial sections
- 🪟 **Always On Top** - Stays visible over all applications
- 🎨 **Customizable Themes** - 6 presets + custom theme creator
- ⚙️ **Advanced Settings** - Auto-hide duration, opacity, font size control

## Perfect For

- Vim tutorials and demonstrations
- Keyboard shortcut training
- Screen recordings and screencasts
- Live coding sessions
- Gaming tutorials

## Prerequisites

### Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libx11-dev \
    libsoup2.4-dev \
    libjavascriptcoregtk-4.1-dev
```

### macOS

```bash
xcode-select --install
```

### Windows

Install Microsoft Visual Studio C++ Build Tools

### Common Requirements

- **Node.js** (v16 or later)
- **Rust** (latest stable version)

Install Rust:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

## Installation

1. Clone or navigate to this directory
2. Install dependencies:

```bash
npm install
```

## Usage

### Development Mode

#### Linux

On Linux, the app requires elevated permissions to capture global keyboard events:

```bash
sudo npm run tauri dev
```

#### macOS

On macOS, you'll need to grant Accessibility permissions:

1. Run the app:

```bash
npm run tauri dev
```

2. When prompted, go to **System Preferences → Security & Privacy → Privacy → Accessibility**
3. Add your terminal app (Terminal.app, iTerm2, etc.) to the allowed list
4. Restart the terminal and run again

#### Windows

On Windows, administrator privileges may be required:

```bash
npm run tauri dev
```

If keyboard capture doesn't work, try running your terminal/IDE as Administrator.

### Building for Production

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/`.

### Running the Built App

#### Linux

```bash
sudo ./src-tauri/target/release/screenkey-app
```

#### macOS

```bash
./src-tauri/target/release/screenkey-app
# Or open the .app bundle from src-tauri/target/release/bundle/macos/
open src-tauri/target/release/bundle/macos/ScreenKey.app
```

Grant Accessibility permissions when prompted (same as development mode).

#### Windows

```cmd
.\src-tauri\target\release\screenkey-app.exe
# Or run the installer from src-tauri/target/release/bundle/msi/
```

Run as Administrator if keyboard capture doesn't work.

## Controls

- **Drag Header** - Click and hold the "ScreenKey" title to move the window
- **↔/↕ Button** - Toggle between horizontal and vertical layout
- **Clear Button** - Clear the keypress history
- **Escape** - Works as expected, captured and displayed

## Layout Modes

### Vertical Mode

- Keys displayed top to bottom
- Auto-scrolls to show latest key at bottom
- Perfect for side-of-screen placement

### Horizontal Mode

- Keys displayed left to right
- Auto-scrolls to show latest key on right
- Perfect for bottom-of-screen placement

### Wrapped Mode (Default)

- Keys wrap naturally like typing
- Auto-scrolls when needed
- Most natural reading flow

## Permissions

### Linux

The app reads from `/dev/input/` devices to capture keyboard events globally. This requires root permissions.

**Alternative:** Add your user to the input group (requires logout):

```bash
sudo usermod -a -G input $USER
```

**Wayland Support:** ✅ Fully supported via `evdev` - works on both X11 and Wayland sessions

### macOS

Requires **Accessibility** permissions to capture global keyboard events.

**How to grant:**

1. Open **System Preferences → Security & Privacy → Privacy → Accessibility**
2. Click the lock icon to make changes
3. Add your terminal app or the ScreenKey.app to the allowed list
4. Restart the app

### Windows

May require **Administrator** privileges to capture global keyboard events.

**How to run as Administrator:**

- Right-click the app/shortcut → "Run as administrator"
- Or run your terminal/IDE as Administrator before launching

## Customization

### Window Settings

Edit `src-tauri/tauri.conf.json`:

```json
{
  "windows": [
    {
      "width": 350,
      "height": 500,
      "x": 50,
      "y": 50
    }
  ]
}
```

### Styling

- `src/App.css` - Main app styles
- `src/components/KeyDisplay.css` - Key display styling

### Color Scheme

- Modifiers: `#fbbf24` (amber)
- Keys: `#60a5fa` (blue)
- Background: `rgba(0, 0, 0, 0.9)` (dark transparent)

## Architecture

- **Frontend:** React + TypeScript + Vite
- **Backend:** Rust + Tauri
- **Keyboard Capture:**
  - Linux: evdev (direct /dev/input access)
  - macOS/Windows: rdev (cross-platform keyboard hooks)
- **IPC:** Tauri events for frontend-backend communication

## Troubleshooting

### Linux: "No keyboard devices found"

- Make sure you're running with `sudo`
- Check that `/dev/input/` contains event devices: `ls -l /dev/input/event*`
- Add user to input group: `sudo usermod -a -G input $USER` (requires logout)

### macOS: Keys not appearing

- Grant Accessibility permissions (System Preferences → Security & Privacy → Privacy → Accessibility)
- Add your terminal app or ScreenKey.app to the allowed list
- Restart the app after granting permissions

### Windows: Keys not appearing

- Run the app as Administrator
- Check Windows Defender/antivirus isn't blocking keyboard hooks
- Ensure no other keyboard monitoring software is interfering

### General: Keys not appearing

- Check terminal/console for error messages
- Verify the app window is visible and not minimized
- Try restarting the app

### Window not draggable

- Make sure you're clicking on the header text "ScreenKey"
- Buttons don't trigger drag - only the header area

### Build errors

- Fix ownership (Linux): `sudo chown -R $USER:$USER src-tauri/target`
- Clear build cache: `rm -rf src-tauri/target && npm run tauri build`

## Development

### Project Structure

```
screenkey-app/
├── src/                    # React frontend
│   ├── App.tsx            # Main app component
│   ├── components/        # React components
│   └── styles.css         # Global styles
├── src-tauri/             # Rust backend
│   ├── src/main.rs       # Keyboard capture logic
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # Tauri configuration
└── package.json          # Node dependencies
```

### Key Components

**Frontend:**

- `App.tsx` - Main logic, event listener, layout toggle
- `KeyDisplay.tsx` - Renders key history with scroll

**Backend:**

- `main.rs` - Platform-specific key capture (evdev for Linux, rdev for macOS/Windows), event emission

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Credits

Inspired by [screenkey](https://github.com/scs3jb/screenkey) by Pablo Seminario.

Built with:

- [Tauri](https://tauri.app/) - Desktop app framework
- [React](https://react.dev/) - UI framework
- [evdev](https://crates.io/crates/evdev) - Linux input device access
- [rdev](https://crates.io/crates/rdev) - Cross-platform keyboard/mouse hook

## Roadmap

- [x] ~~Configurable key display duration~~ ✅ (v0.0.7)
- [x] ~~Custom color themes~~ ✅ (v0.0.7)
- [x] ~~Font size adjustment~~ ✅ (v0.0.7)
- [x] ~~Opacity control~~ ✅ (v0.0.7)
- [x] ~~Cross-platform support (macOS/Windows)~~ ✅ (v0.0.9)
- [ ] Key filtering (hide specific keys)
- [ ] Recording mode (save keypress history)
- [ ] Multi-monitor support improvements
- [ ] Click/mouse event display
- [ ] Customizable key combinations display
