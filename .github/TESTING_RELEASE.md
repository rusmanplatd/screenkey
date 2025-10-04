# Testing Release Workflows

## Step 1: Commit the workflows

First, commit all workflow files to git:

```bash
git add .github/workflows/
git commit -m "Add GitHub Actions workflows for CI and release"
git push origin master
```

## Step 2: Test the simple release workflow

Create and push a test tag:

```bash
# Create a test tag
git tag test-v0.0.1
git push origin test-v0.0.1

# Check GitHub Actions tab to see if workflow runs
```

## Step 3: Create a real release

When ready for a real release:

```bash
# Update version in files first
# - screenkey-app/src-tauri/tauri.conf.json (version field)
# - screenkey-app/package.json (version field)

# Commit version changes
git add screenkey-app/src-tauri/tauri.conf.json screenkey-app/package.json
git commit -m "Bump version to 1.0.0"
git push

# Create and push version tag
git tag v1.0.0
git push origin v1.0.0
```

## Step 4: Check the release

1. Go to `https://github.com/rusmanplatd/screenkey/actions`
2. You should see the "Release Build" workflow running
3. Wait for all platform builds to complete
4. Check `https://github.com/rusmanplatd/screenkey/releases` for the new release

## Troubleshooting

### Workflow not triggering?

1. **Check Actions are enabled:**
   - Go to repository Settings → Actions → General
   - Ensure "Allow all actions and reusable workflows" is selected

2. **Check workflow files are in master:**
   ```bash
   git ls-tree -r master --name-only | grep workflows
   ```

3. **Check tag was pushed:**
   ```bash
   git ls-remote --tags origin
   ```

### Build failures?

- Check the Actions tab for detailed error logs
- Common issues:
  - Missing system dependencies (Ubuntu)
  - Node modules not installed
  - Rust compilation errors
  - Tauri configuration issues

## Available Workflows

1. **ci.yml** - Runs on every push/PR to master
   - TypeScript checks
   - Rust formatting
   - Rust clippy
   - Build test

2. **release-simple.yml** - Runs on version tags (v*)
   - Builds for Linux, macOS, Windows
   - Creates GitHub release with installers

3. **release-test.yml** - Runs on test tags (test-*)
   - Simple test to verify workflow triggers

4. **release.yml** - Advanced multi-stage release
   - Creates draft release
   - Builds for multiple architectures
   - Auto-publishes when complete
