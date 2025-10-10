# ScreenKey Installation Guide

Multiple installation methods are available for different Linux distributions.

## Table of Contents

- [Debian/Ubuntu (APT)](#debianubuntu-apt)
- [Snap Store (Universal)](#snap-store-universal)
- [Flatpak (Universal)](#flatpak-universal)
- [Fedora/RHEL/CentOS (RPM)](#fedorarhel-centos-rpm)
- [Arch Linux (AUR)](#arch-linux-aur)
- [AppImage (Universal)](#appimage-universal)
- [Build from Source](#build-from-source)

---

## Debian/Ubuntu (APT)

### Add Repository

```bash
# Add GPG key
curl -fsSL https://rusmanplatd.github.io/screenkey/KEY.gpg | sudo gpg --dearmor -o /usr/share/keyrings/screenkey.gpg

# Add repository
echo "deb [signed-by=/usr/share/keyrings/screenkey.gpg] https://rusmanplatd.github.io/screenkey stable main" | sudo tee /etc/apt/sources.list.d/screenkey.list

# Update and install
sudo apt update
sudo apt install screenkey-app
```

### Run

```bash
sudo screenkey-app
```

### Update

```bash
sudo apt update
sudo apt upgrade screenkey-app
```

### Uninstall

```bash
sudo apt remove screenkey-app
sudo rm /etc/apt/sources.list.d/screenkey.list
```

---

## Snap Store (Universal)

### Install

```bash
sudo snap install screenkey --classic
```

**Note:** `--classic` confinement is required for global keyboard capture.

### Run

```bash
sudo screenkey
```

### Update

```bash
sudo snap refresh screenkey
```

### Uninstall

```bash
sudo snap remove screenkey
```

---

## Flatpak (Universal)

### Method 1: From Flathub (when published)

```bash
flatpak install flathub com.screenkey.app
flatpak run com.screenkey.app
```

### Method 2: From Release Bundle

```bash
# Download the .flatpak file from releases
wget https://github.com/rusmanplatd/screenkey/releases/latest/download/screenkey.flatpak

# Install
flatpak install screenkey.flatpak

# Run with sudo for keyboard capture
sudo -E flatpak run com.screenkey.app
```

### Update

```bash
flatpak update com.screenkey.app
```

### Uninstall

```bash
flatpak uninstall com.screenkey.app
```

---

## Fedora/RHEL/CentOS (RPM)

### Method 1: From Repository

```bash
# Add repository
sudo curl -o /etc/yum.repos.d/screenkey.repo https://rusmanplatd.github.io/screenkey-rpm/screenkey.repo

# Install with DNF (Fedora/RHEL 8+/Rocky/Alma)
sudo dnf install screenkey-app

# Or with YUM (CentOS 7/RHEL 7)
sudo yum install screenkey-app
```

### Method 2: Direct RPM Installation

```bash
# Download RPM
wget https://github.com/rusmanplatd/screenkey/releases/latest/download/screenkey-app-0.0.12-1.x86_64.rpm

# Install
sudo dnf install ./screenkey-app-*.rpm
# or
sudo rpm -ivh screenkey-app-*.rpm
```

### Run

```bash
sudo screenkey-app
```

### Update

```bash
sudo dnf update screenkey-app
```

### Uninstall

```bash
sudo dnf remove screenkey-app
```

---

## Arch Linux (AUR)

### Method 1: Using AUR Helper

```bash
# Using yay
yay -S screenkey-app

# Using paru
paru -S screenkey-app
```

### Method 2: Manual Installation

```bash
# Clone AUR repository
git clone https://aur.archlinux.org/screenkey-app.git
cd screenkey-app

# Review PKGBUILD (important!)
less PKGBUILD

# Build and install
makepkg -si
```

### Run

```bash
sudo screenkey-app
```

### Update

```bash
# With AUR helper
yay -Syu screenkey-app

# Manual
cd screenkey-app
git pull
makepkg -si
```

### Uninstall

```bash
sudo pacman -R screenkey-app
```

---

## AppImage (Universal)

### Download and Run

```bash
# Download
wget https://github.com/rusmanplatd/screenkey/releases/latest/download/ScreenKey-x86_64.AppImage

# Make executable
chmod +x ScreenKey-*.AppImage

# Run
sudo ./ScreenKey-*.AppImage
```

### Optional: System Integration

#### Using AppImageLauncher (Recommended)

```bash
# Ubuntu/Debian
sudo add-apt-repository ppa:appimagelauncher-team/stable
sudo apt update
sudo apt install appimagelauncher
```

Then double-click the AppImage file.

#### Manual Integration

```bash
# Move to /opt
sudo mv ScreenKey-*.AppImage /opt/ScreenKey.AppImage

# Create symlink
sudo ln -s /opt/ScreenKey.AppImage /usr/local/bin/screenkey

# Now run as:
sudo screenkey
```

### Delta Updates

```bash
# Download zsync file
wget https://github.com/rusmanplatd/screenkey/releases/latest/download/ScreenKey-x86_64.AppImage.zsync

# Update (only downloads changes)
zsync ScreenKey-x86_64.AppImage.zsync
```

---

## Build from Source

### Prerequisites

#### Debian/Ubuntu

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

#### Fedora/RHEL

```bash
sudo dnf install -y \
    webkit2gtk4.1-devel \
    gtk3-devel \
    libappindicator-gtk3-devel \
    librsvg2-devel \
    openssl-devel \
    libX11-devel
```

#### Arch Linux

```bash
sudo pacman -S \
    webkit2gtk \
    gtk3 \
    libayatana-appindicator \
    librsvg \
    openssl \
    libx11
```

### Install Node.js and Rust

```bash
# Node.js (v16+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs  # or use your package manager

# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Build and Install

```bash
# Clone repository
git clone https://github.com/rusmanplatd/screenkey.git
cd screenkey/screenkey-app

# Install dependencies
npm install

# Build
npm run tauri build

# Run built binary
sudo ./src-tauri/target/release/screenkey-app

# Or install system-wide
sudo cp src-tauri/target/release/screenkey-app /usr/local/bin/
```

---

## Running Without Sudo (Linux)

To avoid running with `sudo` every time, add your user to the `input` group:

```bash
sudo usermod -a -G input $USER
```

**Important:** Log out and log back in for the changes to take effect.

After logging back in:

```bash
screenkey-app  # Now works without sudo
```

---

## Comparison of Installation Methods

| Method       | Pros                                 | Cons                                    |
| ------------ | ------------------------------------ | --------------------------------------- |
| **APT**      | Native package, auto-updates via apt | Debian/Ubuntu only                      |
| **Snap**     | Universal, sandboxed, auto-updates   | Larger size, classic confinement needed |
| **Flatpak**  | Universal, sandboxed                 | Requires flatpak runtime                |
| **RPM**      | Native package, auto-updates         | Fedora/RHEL family only                 |
| **AUR**      | Always latest, Arch-native           | Manual updates, build required          |
| **AppImage** | Portable, no install needed          | No auto-update (use zsync)              |
| **Source**   | Latest code, customizable            | Requires build tools, manual updates    |

---

## Troubleshooting

### Keyboard not captured

```bash
# Ensure running with sudo or in input group
sudo screenkey-app

# Or add to input group (requires logout)
sudo usermod -a -G input $USER
```

### FUSE error (AppImage)

```bash
sudo apt install fuse libfuse2

# Or extract and run
./ScreenKey-*.AppImage --appimage-extract
sudo ./squashfs-root/AppRun
```

### Permission denied on /dev/input

```bash
# Check permissions
ls -l /dev/input/event*

# Should show: crw-rw---- ... root input
# If not, add to input group and reboot
```

---

## Support

- **Issues:** https://github.com/rusmanplatd/screenkey/issues
- **Documentation:** https://github.com/rusmanplatd/screenkey
- **Releases:** https://github.com/rusmanplatd/screenkey/releases
