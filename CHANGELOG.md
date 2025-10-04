# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.8] - 2025-10-04

## [0.0.7] - 2025-10-04

### Added

- Global keyboard capture for all applications (Linux only)
- Three layout modes: Vertical, Horizontal, and Wrapped
- Configurable auto-hide duration for keypresses
- Opacity control (10%-100%)
- Font size adjustment (12px-32px)
- Six predefined color themes (Default, Ocean, Forest, Sunset, Midnight, Monochrome)
- Custom theme creator with color pickers
- Settings persistence via localStorage
- Draggable window via entire header
- Window controls (minimize, close)
- Always-on-top overlay window
- Smart auto-scroll (only scrolls when at bottom)
- Clear history button
- Modifier key support (Ctrl, Shift, Alt, Super)
- Arrow keys display (↑ ↓ ← →)
- Function keys support (F1-F12)
- Special keys support (Enter, Backspace, Tab, Esc, etc.)
- Professional app icon with keyboard design
- Cross-platform builds (Linux, macOS, Windows)
- GitHub Actions CI/CD pipeline
- Automated releases via GitHub Actions

### Changed

- Default layout set to "Wrapped" mode for natural typing flow
- Header now fully draggable (not just title)
- Settings moved to collapsible panel
- Direction toggle integrated into settings
- Improved window z-index for proper always-on-top behavior
- Visible on all workspaces/virtual desktops

### Fixed

- Smart scroll behavior prevents forced scrolling during manual navigation
- Window control buttons properly prevent drag interference
- Keyboard event handling optimized for lower CPU usage
- Platform-specific dependencies (evdev Linux-only)
- Cross-platform compilation support

## [0.1.0] - Initial Release

### Added

- Basic keyboard display functionality
- Transparent overlay window
- Tauri-based desktop application
