# ScreenKey

A modern, cross-platform screencast tool to display keyboard inputs on screen. Perfect for tutorials, demonstrations, and vim command visualization.

![ScreenKey Demo](https://img.shields.io/badge/Platform-Linux%20%7C%20macOS%20%7C%20Windows-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🎯 **Global Keyboard Capture** - Captures keypresses from any application
- 🔄 **Dual Layout Modes** - Switch between vertical and horizontal display
- 📜 **Scrollable History** - View complete command sequences
- 🎨 **Modern UI** - Transparent overlay with smooth animations
- 🖱️ **Draggable Window** - Position anywhere on screen
- ⌨️ **Modifier Keys** - Shows Ctrl, Shift, Alt, Super combinations
- 🧹 **Clear History** - Reset display between tutorial sections
- 🪟 **Always On Top** - Stays visible over all applications

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

**Important:** On Linux, the app requires elevated permissions to capture global keyboard events:

```bash
sudo npm run tauri dev
```

On macOS/Windows:
```bash
npm run tauri dev
```

### Building for Production

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/`.

### Running the Built App

On Linux:
```bash
sudo ./src-tauri/target/release/screenkey-app
```

## Controls

- **Drag Header** - Click and hold the "ScreenKey" title to move the window
- **↔/↕ Button** - Toggle between horizontal and vertical layout
- **Clear Button** - Clear the keypress history
- **Escape** - Works as expected, captured and displayed

## Layout Modes

### Vertical Mode (Default)
- Keys displayed top to bottom
- Auto-scrolls to show latest key at bottom
- Perfect for side-of-screen placement

### Horizontal Mode
- Keys displayed left to right
- Auto-scrolls to show latest key on right
- Perfect for bottom-of-screen placement

## Permissions

### Linux
The app reads from `/dev/input/` devices to capture keyboard events globally. This requires root permissions.

**Alternative:** Add your user to the input group (requires logout):
```bash
sudo usermod -a -G input $USER
```

### Wayland Support
✅ Fully supported via `evdev` - works on both X11 and Wayland sessions

## Customization

### Window Settings
Edit `src-tauri/tauri.conf.json`:
```json
{
  "windows": [{
    "width": 350,
    "height": 500,
    "x": 50,
    "y": 50
  }]
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
- **Keyboard Capture:** evdev (Linux), platform-specific APIs (macOS/Windows)
- **IPC:** Tauri events for frontend-backend communication

## Troubleshooting

### "No keyboard devices found"
- Make sure you're running with `sudo` on Linux
- Check that `/dev/input/` contains event devices

### Keys not appearing
- Verify the app is running with proper permissions
- Check browser console (F12) for errors
- Ensure event listener is set up (check terminal logs)

### Window not draggable
- Make sure you're clicking on the header text "ScreenKey"
- Buttons don't trigger drag - only the title area

### Permission denied on build
- Fix ownership: `sudo chown -R $USER:$USER src-tauri/target`

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
- `main.rs` - evdev integration, key capture, event emission

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

## Roadmap

- [ ] Configurable key display duration
- [ ] Custom color themes
- [ ] Font size adjustment
- [ ] Opacity control
- [ ] Key filtering (hide specific keys)
- [ ] Recording mode (save keypress history)
- [ ] Multi-monitor support improvements
