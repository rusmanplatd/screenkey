# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Global keyboard capture for all applications
- Three layout modes: Vertical, Horizontal, and Wrapped
- Configurable auto-hide duration for keypresses
- Opacity control (10%-100%)
- Font size adjustment (12px-32px)
- Six predefined color themes (Default, Ocean, Forest, Sunset, Midnight, Monochrome)
- Custom theme creator with color pickers
- Settings persistence via localStorage
- Draggable window via header
- Window controls (minimize, close)
- Always-on-top overlay window
- Smart auto-scroll (only scrolls when at bottom)
- Clear history button
- Modifier key support (Ctrl, Shift, Alt, Super)
- Arrow keys display (↑ ↓ ← →)
- Function keys support (F1-F12)
- Special keys support (Enter, Backspace, Tab, Esc, etc.)

### Changed
- Default layout set to "Wrapped" mode for natural typing flow
- Header now fully draggable (not just title)
- Settings moved to collapsible panel
- Direction toggle integrated into settings

### Fixed
- Smart scroll behavior prevents forced scrolling during manual navigation
- Window control buttons properly prevent drag interference
- Keyboard event handling optimized for lower CPU usage

## [0.1.0] - Initial Release

### Added
- Basic keyboard display functionality
- Transparent overlay window
- Tauri-based desktop application
