# ScreenKey App

A Tauri-based screencast tool to display keyboard inputs on screen, similar to [screenkey](https://github.com/scs3jb/screenkey).

## Features

- Real-time keyboard input display
- Transparent overlay window
- Always on top
- Shows modifier keys (Ctrl, Shift, Alt, Super)
- Modern UI with fade-in animations
- Cross-platform support (Linux, macOS, Windows)

## Prerequisites

Before running this app, make sure you have:

1. **Node.js** (v16 or later)
2. **Rust** (latest stable version)
3. **System dependencies** for Tauri:

### Linux
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libx11-dev
```

### macOS
```bash
xcode-select --install
```

### Windows
Install Microsoft Visual Studio C++ Build Tools

## Installation

1. Clone or navigate to this directory
2. Install dependencies:
```bash
npm install
```

## Development

Run the app in development mode:
```bash
npm run tauri dev
```

**Note:** On Linux, you may need to run with sudo or configure input permissions to capture keyboard events:
```bash
sudo npm run tauri dev
```

## Building

Create a production build:
```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/`.

## Usage

1. Launch the application
2. The overlay window will appear on screen
3. Press any keys and they will be displayed in the overlay
4. The window can be moved by dragging
5. The last 5 key presses are shown

## Permissions

On Linux, this app requires permissions to listen to keyboard events. You may need to:
- Run with sudo, OR
- Add your user to the input group: `sudo usermod -a -G input $USER` (then log out and back in)

## Customization

You can customize the appearance by editing:
- `src/components/KeyDisplay.css` - Styling for the key display
- `src-tauri/tauri.conf.json` - Window settings (size, transparency, position)

## Architecture

- **Frontend:** React + TypeScript + Vite
- **Backend:** Rust + Tauri
- **Keyboard Listener:** rdev crate for cross-platform keyboard events
- **IPC:** Tauri events for communication between frontend and backend

## License

Your license here
