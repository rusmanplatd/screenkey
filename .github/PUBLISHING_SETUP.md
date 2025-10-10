# Publishing Setup Guide

This guide explains how to configure GitHub secrets and external services for automated package publishing.

## Overview

The project includes automated publishing workflows for:

- **APT Repository** (Debian/Ubuntu) → GitHub Pages
- **Snap Store** → Snapcraft.io
- **Flatpak** → Release assets (manual Flathub submission)
- **RPM Repository** (Fedora/RHEL/CentOS) → GitHub Pages
- **AUR** (Arch Linux) → AUR repository
- **AppImage** → Release assets

## Required Secrets

Configure these in: **Settings → Secrets and variables → Actions → New repository secret**

### 1. APT Repository Publishing

#### APT_GPG_PRIVATE_KEY

Generate a GPG key for signing the APT repository:

```bash
# Generate new GPG key
gpg --full-generate-key
# Select: (1) RSA and RSA
# Key size: 4096
# Expiration: 0 (does not expire)
# Real name: ScreenKey APT Repository
# Email: your-email@example.com

# Export private key
gpg --armor --export-secret-keys YOUR_KEY_ID > apt-private-key.asc

# Copy content to GitHub secret APT_GPG_PRIVATE_KEY
cat apt-private-key.asc

# Export public key (for users to add)
gpg --armor --export YOUR_KEY_ID > KEY.gpg
# Upload KEY.gpg to the apt repository
```

#### APT_GPG_KEY_ID

```bash
# List keys and copy the key ID
gpg --list-secret-keys --keyid-format LONG

# Example output:
# sec   rsa4096/ABCD1234EFGH5678 2025-10-10 [SC]
# Use: ABCD1234EFGH5678

# Add as APT_GPG_KEY_ID secret
```

### 2. Snap Store Publishing

#### SNAPCRAFT_TOKEN

```bash
# Install snapcraft
sudo snap install snapcraft --classic

# Login to Snapcraft
snapcraft login

# Export credentials
snapcraft export-login snapcraft-token.txt

# Copy content to GitHub secret SNAPCRAFT_TOKEN
cat snapcraft-token.txt

# Register snap name (one-time)
snapcraft register screenkey
```

**Prerequisites:**

1. Create account at https://snapcraft.io
2. Enable 2FA (required for classic confinement)
3. Register the snap name: `snapcraft register screenkey`

### 3. AUR Publishing

#### AUR_SSH_PRIVATE_KEY

Generate SSH key for AUR:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/aur_deploy
# Don't set a passphrase (for automation)

# Copy private key to GitHub secret AUR_SSH_PRIVATE_KEY
cat ~/.ssh/aur_deploy

# Add public key to AUR account
cat ~/.ssh/aur_deploy.pub
# Go to https://aur.archlinux.org/account/
# Navigate to "My Account" → "SSH Public Key"
# Paste and save
```

**Prerequisites:**

1. Create account at https://aur.archlinux.org
2. Add SSH public key to account
3. Initial package creation:

   ```bash
   # Clone initial repo (will be empty)
   git clone ssh://aur@aur.archlinux.org/screenkey-app.git
   cd screenkey-app

   # Create initial PKGBUILD and .SRCINFO
   # (will be automated by workflow after first push)
   git add PKGBUILD .SRCINFO
   git commit -m "Initial commit"
   git push origin master
   ```

## Optional Configurations

### Enable GitHub Pages

For APT and RPM repositories:

1. Go to **Settings → Pages**
2. Set source to "Deploy from a branch"
3. Select branch `gh-pages-apt` for APT
4. Select branch `gh-pages-rpm` for RPM
5. Save

Repositories will be available at:

- APT: `https://[username].github.io/screenkey/`
- RPM: `https://[username].github.io/screenkey-rpm/`

### Custom Domain (Optional)

To use a custom domain for repositories:

1. Add CNAME record in your DNS:

   ```
   apt.screenkey.dev → [username].github.io
   rpm.screenkey.dev → [username].github.io
   ```

2. Update workflow files:

   ```yaml
   # In publish-apt.yml
   cname: apt.screenkey.dev

   # In publish-rpm.yml
   cname: rpm.screenkey.dev
   ```

## Workflow Triggers

### Automatic (on Release)

All workflows trigger automatically when a release is published:

```bash
# Create release using the release script
cd screenkey-app
npm run release

# This will:
# 1. Bump version
# 2. Create git tag
# 3. Push (triggers release.yml)
# 4. Release is created
# 5. All publishing workflows trigger
```

### Manual Dispatch

Test workflows individually:

```bash
# Via GitHub CLI
gh workflow run publish-apt.yml
gh workflow run publish-snap.yml
gh workflow run publish-flatpak.yml
gh workflow run publish-rpm.yml
gh workflow run publish-aur.yml
gh workflow run publish-appimage.yml

# Via GitHub UI
# Actions → Select workflow → Run workflow
```

## Testing Workflows

### Without Secrets (Dry Run)

Most workflows will run partially without secrets:

- They'll build packages
- Upload as artifacts
- Skip publishing steps that require secrets

### With Secrets (Full Test)

1. Set up all required secrets
2. Create a test release:
   ```bash
   git tag v0.0.13-test
   git push origin v0.0.13-test
   ```
3. Monitor workflow runs in Actions tab
4. Delete test release and tag after verification

## Flathub Publishing (Manual Process)

Flathub requires a separate submission process:

1. Fork https://github.com/flathub/flathub
2. Create new repository: `flathub/com.screenkey.app`
3. Add manifest files:
   - `com.screenkey.app.yml` (from publish-flatpak.yml)
   - `com.screenkey.app.appdata.xml`
   - `com.screenkey.app.desktop`
4. Submit pull request to flathub/flathub
5. Wait for review and approval

**Note:** After Flathub approval, users can install directly:

```bash
flatpak install flathub com.screenkey.app
```

## Verification

After setup, verify each publishing method:

### APT Repository

```bash
curl -I https://[username].github.io/screenkey/
# Should return 200 OK
```

### Snap Store

```bash
snap info screenkey
# Should show package info
```

### AUR

```bash
# Check if package exists
curl https://aur.archlinux.org/packages/screenkey-app
```

### Release Assets

```bash
# Check latest release has all files
gh release view --json assets
# Should include: .deb, .rpm, .AppImage, .flatpak, .zsync
```

## Troubleshooting

### Workflow fails with "Secret not found"

- Verify secret name exactly matches workflow variable
- Secrets are case-sensitive
- Check secret is in repository (not organization) secrets

### APT: GPG signature verification failed

- Ensure GPG key hasn't expired
- Verify `APT_GPG_KEY_ID` matches the key ID
- Check private key includes `-----BEGIN PGP PRIVATE KEY BLOCK-----`

### Snap: Authentication failed

- Token may have expired, regenerate with `snapcraft export-login`
- Ensure 2FA is enabled on snapcraft.io account
- Verify snap name is registered

### AUR: Permission denied

- Check SSH key is added to AUR account
- Verify private key has no passphrase
- Ensure package name is available on AUR

### AppImage: FUSE errors in workflow

- This is normal in containers, workflow extracts AppImage instead
- Users need `libfuse2` installed locally

## Security Best Practices

1. **Rotate secrets regularly** (every 6-12 months)
2. **Use separate keys** for different services
3. **Enable audit logging** for secret access
4. **Review workflow runs** for unauthorized changes
5. **Keep GPG keys backed up** securely offline

## Support

For issues with:

- **Workflows**: Open issue in this repository
- **Snapcraft**: https://forum.snapcraft.io
- **Flathub**: https://github.com/flathub/flathub/issues
- **AUR**: https://wiki.archlinux.org/title/AUR_submission_guidelines
