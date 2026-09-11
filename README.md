# ScreenKey

[![CI](https://github.com/rusmanplatd/screenkey/actions/workflows/ci.yml/badge.svg)](https://github.com/rusmanplatd/screenkey/actions/workflows/ci.yml)
[![GitHub release](https://img.shields.io/github/v/release/rusmanplatd/screenkey)](https://github.com/rusmanplatd/screenkey/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#license)

ScreenKey is a lightweight, cross-platform desktop overlay that shows keyboard input in real time. It is designed for screencasts, live coding, tutorials, shortcut demonstrations, and presentations.

## Features

- Captures keyboard input globally on Linux, macOS, and Windows
- Displays modifier combinations such as `Ctrl + C`, `Cmd + S`, and `Alt + Tab`
- Offers vertical, horizontal, and wrapped layouts
- Stays above other windows and can be dragged anywhere on screen
- Includes six color themes and a custom theme editor
- Supports configurable opacity, font size, and display duration
- Keeps a scrollable key history with a one-click clear action
- Saves display settings between sessions

## Download

Prebuilt installers and packages are available on the [GitHub Releases page](https://github.com/rusmanplatd/screenkey/releases). Choose the asset for your operating system, install it, and then grant the keyboard-capture permission described below.

## Platform permissions

ScreenKey needs permission to observe global keyboard input.

### Linux

The app reads keyboard events from `/dev/input/event*`. Your user must have read access to those devices. On many distributions, you can add your account to the `input` group:

```bash
sudo usermod -aG input "$USER"
```

Log out and back in after changing group membership. Alternatively, run ScreenKey with elevated privileges, but granting narrowly scoped device access is preferable.

Both X11 and Wayland are supported because capture uses Linux `evdev` rather than a desktop-session API.

### macOS

Grant ScreenKey Accessibility access in **System Settings → Privacy & Security → Accessibility**. When developing locally, grant the same permission to the terminal or IDE that launches the app. Restart ScreenKey after changing the permission.

### Windows

Global capture normally works without extra setup. If input from an elevated application is not detected, run ScreenKey as Administrator.

## Build from source

### Prerequisites

- Node.js 22 and npm
- The latest stable Rust toolchain
- The [Tauri 2 system prerequisites](https://v2.tauri.app/start/prerequisites/) for your operating system

On Debian or Ubuntu, install the native dependencies with:

```bash
sudo apt update
sudo apt install -y \
  build-essential \
  curl \
  file \
  libayatana-appindicator3-dev \
  libgtk-3-dev \
  librsvg2-dev \
  libssl-dev \
  libwebkit2gtk-4.1-dev \
  libx11-dev \
  wget
```

Then clone and start the application:

```bash
git clone https://github.com/rusmanplatd/screenkey.git
cd screenkey/screenkey-app
npm ci
npm run tauri:dev
```

The frontend-only development server is also available with `npm run dev`, but global keyboard capture requires the Tauri application.

### Production build

```bash
cd screenkey-app
npm ci
npm run tauri:build
```

Bundles are written below `screenkey-app/src-tauri/target/release/bundle/`. The exact installer formats depend on the build operating system.

## Using ScreenKey

- Drag the header to reposition the overlay.
- Open the gear menu to select a layout, theme, opacity, font size, and display duration.
- Set display duration to `0` to keep keys visible until they are cleared.
- Select **Clear** to remove the current key history.
- Use the header controls to minimize or close the window.

Settings are stored locally in the app's webview storage. Captured key history remains in memory for the current session and is not written to application storage.

## Architecture

```text
screenkey-app/
├── src/                         React + TypeScript interface
│   └── components/KeyDisplay   Key history rendering and scrolling
├── src-tauri/
│   └── src/main.rs             Global capture and Tauri event emission
├── scripts/                     Release automation
└── package.json                 Frontend and Tauri commands
```

The Rust backend captures key presses with `evdev` on Linux and `rdev` on macOS and Windows. It emits `key-press` events to the React frontend, which renders the overlay and manages display settings.

## Development commands

Run these commands from `screenkey-app/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite frontend server |
| `npm run build` | Type-check and build the frontend |
| `npm run tauri:dev` | Run the complete desktop app in development mode |
| `npm run tauri:build` | Build production desktop bundles |
| `npm run release:patch` | Prepare and push a patch release |
| `npm run release:minor` | Prepare and push a minor release |
| `npm run release:major` | Prepare and push a major release |

See [the release script documentation](screenkey-app/scripts/README.md) before using a release command; it creates a commit and tag and pushes them to GitHub.

## Troubleshooting

### The window says “Waiting for keyboard input”

- On Linux, confirm that your account can read `/dev/input/event*` and that you logged in again after joining the `input` group.
- On macOS, confirm Accessibility permission and restart ScreenKey.
- On Windows, try launching ScreenKey with the same privilege level as the application whose keys you want to display.
- Check the terminal output for keyboard-listener errors when running in development mode.

### Linux build artifacts are owned by root

If you previously built with `sudo`, restore ownership before building as your user:

```bash
sudo chown -R "$USER:$USER" screenkey-app/src-tauri/target
```

## Contributing

Issues and pull requests are welcome. Before submitting a change, run the same core checks used by CI:

```bash
cd screenkey-app
npm ci
npm run build
cd src-tauri
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
```

## License

ScreenKey is distributed under the MIT License, as declared in the application manifests.

## Acknowledgements

ScreenKey is inspired by Pablo Seminario's original [screenkey](https://github.com/wavexx/screenkey) project and is built with [Tauri](https://tauri.app/), [React](https://react.dev/), [`evdev`](https://crates.io/crates/evdev), and [`rdev`](https://crates.io/crates/rdev).
