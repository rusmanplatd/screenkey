# Release Scripts

## Quick Release

```bash
# Patch release (1.0.0 -> 1.0.1)
npm run release

# Or explicitly
npm run release:patch
```

## Version Bumping

```bash
# Patch: 1.0.0 -> 1.0.1 (bug fixes)
npm run release:patch

# Minor: 1.0.0 -> 1.1.0 (new features)
npm run release:minor

# Major: 1.0.0 -> 2.0.0 (breaking changes)
npm run release:major

# Custom version
node scripts/release.js 2.5.0
```

## What it does

The `npm run release` command will:

1. ✅ Check git status (fails if uncommitted changes)
2. ✅ Calculate new version number
3. ✅ Update `package.json`
4. ✅ Update `src-tauri/tauri.conf.json`
5. ✅ Update `src-tauri/Cargo.toml`
6. ✅ Update `CHANGELOG.md` with release date
7. ✅ Commit all changes
8. ✅ Create git tag (e.g., `v1.0.1`)
9. ✅ Push to GitHub (triggers release builds)

## GitHub Actions

After pushing the tag, GitHub Actions will automatically:

- 🏗️ Build for Linux (AppImage, .deb)
- 🏗️ Build for macOS (Intel + Apple Silicon)
- 🏗️ Build for Windows (MSI installer)
- 📦 Create draft GitHub release
- 📎 Attach all installers to the release

## Manual Steps After Release

1. Visit: https://github.com/rusmanplatd/screenkey/actions
2. Wait for all builds to complete
3. Go to: https://github.com/rusmanplatd/screenkey/releases
4. Edit the draft release notes if needed
5. Click "Publish release"

## Semantic Versioning

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes
- **MINOR** (1.0.0 -> 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 -> 1.0.1): Bug fixes, backwards compatible

## Example Workflow

```bash
# Made some bug fixes
npm run release:patch
# Creates v1.0.1

# Added new features
npm run release:minor
# Creates v1.1.0

# Made breaking changes
npm run release:major
# Creates v2.0.0
```

## Troubleshooting

### Error: Uncommitted changes

Make sure to commit all changes before releasing:

```bash
git add .
git commit -m "Your commit message"
```

### Error: Tag already exists

Delete the tag locally and remotely:

```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

### Need to undo a release

If you haven't pushed yet:

```bash
git reset --hard HEAD~1
git tag -d v1.0.0
```

If already pushed (not recommended):

```bash
# Delete tag
git push origin :refs/tags/v1.0.0
# Force push to revert commit
git reset --hard HEAD~1
git push -f origin master
```
