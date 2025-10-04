# ScreenKey v1.0.0 Release

## Release Steps

### 1. Commit all changes

```bash
git add .
git commit -m "Release v1.0.0"
git push origin master
```

### 2. Create and push the release tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 3. GitHub Actions will automatically:

- Build for Linux (AppImage, .deb)
- Build for macOS (Intel + Apple Silicon DMG)
- Build for Windows (MSI installer)
- Create a GitHub Release with all binaries

### 4. Monitor the build

Visit: https://github.com/rusmanplatd/screenkey/actions

### 5. After build completes

- Go to: https://github.com/rusmanplatd/screenkey/releases
- The draft release will be created with all installers attached
- Edit the release notes if needed
- Publish the release

## What Changed in v1.0.0

See [CHANGELOG.md](CHANGELOG.md) for full details.

### Highlights:

- ✨ Three layout modes (Vertical, Horizontal, Wrapped)
- 🎨 Six predefined themes + custom theme creator
- ⚙️ Comprehensive settings panel
- 🖱️ Draggable window with minimize/close controls
- 📏 Configurable font size and opacity
- ⏱️ Auto-hide duration for keys
- 🔝 Always-on-top with proper z-index
- 🎯 Smart auto-scroll
- 🖼️ Professional app icon
- 🌐 Cross-platform builds (Linux, macOS, Windows)

## Platform Notes

### Linux

- **Full functionality** with global keyboard capture
- Requires `sudo` or user in `input` group
- Supports both X11 and Wayland

### macOS & Windows

- **Window and UI only** - keyboard capture not available
- App will launch and display correctly
- Shows warning message about Linux-only keyboard capture

## Installation

### Linux (Ubuntu/Debian)

```bash
# Download .deb from releases
sudo dpkg -i screenkey-app_1.0.0_amd64.deb

# Or use AppImage
chmod +x ScreenKey_1.0.0_amd64.AppImage
sudo ./ScreenKey_1.0.0_amd64.AppImage
```

### macOS

```bash
# Download and open DMG
# Drag to Applications folder
# Right-click > Open (first time only)
```

### Windows

```bash
# Download and run MSI installer
# Follow installation wizard
```

## Known Issues

- Keyboard capture only works on Linux (by design)
- macOS and Windows versions are UI-only

## Future Plans

- Investigate keyboard capture for macOS/Windows
- Add recording/export functionality
- Custom key filtering
- More themes and customization options
