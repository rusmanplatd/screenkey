# Release Process

This document describes how to create a new release of ScreenKey.

## Automated Release via GitHub Actions

### Creating a Release

1. **Update Version Number**

   ```bash
   # Update version in screenkey-app/src-tauri/tauri.conf.json
   # Update version in screenkey-app/package.json
   ```

2. **Commit and Tag**

   ```bash
   git add .
   git commit -m "Release v1.0.0"
   git tag v1.0.0
   git push origin master --tags
   ```

3. **GitHub Actions Builds Automatically**

   - The workflow will trigger on the new tag
   - Builds will be created for:
     - **Linux** (AppImage, .deb)
     - **macOS** (DMG, .app bundle)
     - **Windows** (MSI installer, .exe)

4. **Review Draft Release**
   - Go to GitHub Releases page
   - Find the draft release created by the workflow
   - Edit the release notes
   - Publish the release

## Manual Builds

### Linux

```bash
cd screenkey-app
npm install
npm run tauri build
# Output: src-tauri/target/release/bundle/
```

### macOS

```bash
cd screenkey-app
npm install
npm run tauri build
# Output: src-tauri/target/release/bundle/
```

### Windows

```bash
cd screenkey-app
npm install
npm run tauri build
# Output: src-tauri/target/release/bundle/
```

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: Add functionality (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

## Checklist Before Release

- [ ] All tests pass locally
- [ ] Version updated in `tauri.conf.json`
- [ ] Version updated in `package.json`
- [ ] CHANGELOG updated with release notes
- [ ] README updated if needed
- [ ] Tested on target platforms
- [ ] No console errors or warnings
- [ ] Performance is acceptable

## Post-Release

- [ ] Test installers on each platform
- [ ] Update documentation if needed
- [ ] Announce on social media/forums
- [ ] Close milestone issues on GitHub
