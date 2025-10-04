#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');
const appDir = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  log(`\n> ${command}`, 'cyan');
  try {
    return execSync(command, {
      stdio: 'inherit',
      cwd: options.cwd || rootDir,
      ...options
    });
  } catch (error) {
    log(`\n❌ Command failed: ${command}`, 'red');
    process.exit(1);
  }
}

function getVersion(type = 'patch') {
  const packageJson = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'));
  const [major, minor, patch] = packageJson.version.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return type; // Custom version
  }
}

function updateVersion(version) {
  log(`\n📝 Updating version to ${version}...`, 'blue');

  // Update package.json
  const packageJsonPath = join(appDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = version;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  log('  ✓ Updated package.json', 'green');

  // Update tauri.conf.json
  const tauriConfPath = join(appDir, 'src-tauri/tauri.conf.json');
  const tauriConf = JSON.parse(readFileSync(tauriConfPath, 'utf8'));
  tauriConf.version = version;
  writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
  log('  ✓ Updated tauri.conf.json', 'green');

  // Update Cargo.toml
  const cargoTomlPath = join(appDir, 'src-tauri/Cargo.toml');
  let cargoToml = readFileSync(cargoTomlPath, 'utf8');
  cargoToml = cargoToml.replace(/^version = ".*"$/m, `version = "${version}"`);
  writeFileSync(cargoTomlPath, cargoToml);
  log('  ✓ Updated Cargo.toml', 'green');

  // Update CHANGELOG.md
  const changelogPath = join(rootDir, 'CHANGELOG.md');
  let changelog = readFileSync(changelogPath, 'utf8');
  const today = new Date().toISOString().split('T')[0];

  if (changelog.includes('## [Unreleased]')) {
    changelog = changelog.replace(
      '## [Unreleased]',
      `## [Unreleased]\n\n## [${version}] - ${today}`
    );
    writeFileSync(changelogPath, changelog);
    log('  ✓ Updated CHANGELOG.md', 'green');
  }
}

function main() {
  const args = process.argv.slice(2);
  const versionType = args[0] || 'patch';

  log('\n🚀 ScreenKey Release Script', 'bright');
  log('═══════════════════════════════\n', 'bright');

  // Check git status
  log('📋 Checking git status...', 'blue');
  try {
    const status = execSync('git status --porcelain', {
      encoding: 'utf8',
      cwd: rootDir
    });
    if (status.trim()) {
      log('\n⚠️  You have uncommitted changes:', 'yellow');
      console.log(status);
      log('\nPlease commit or stash your changes before releasing.', 'red');
      process.exit(1);
    }
    log('  ✓ Working directory clean', 'green');
  } catch (error) {
    log('  ⚠️  Not a git repository or git not available', 'yellow');
  }

  // Calculate new version
  const newVersion = getVersion(versionType);
  log(`\n📦 Version: ${newVersion}`, 'bright');
  log(`   Type: ${versionType}\n`, 'bright');

  // Update version in all files
  updateVersion(newVersion);

  // Commit changes
  log('\n💾 Committing version bump...', 'blue');
  exec(`git add .`);
  exec(`git commit -m "chore: bump version to ${newVersion}"`);
  log('  ✓ Changes committed', 'green');

  // Create tag
  log('\n🏷️  Creating git tag...', 'blue');
  exec(`git tag v${newVersion}`);
  log(`  ✓ Created tag v${newVersion}`, 'green');

  // Push changes and tag
  log('\n📤 Pushing to remote...', 'blue');
  log('   This will trigger GitHub Actions to build releases', 'yellow');
  exec('git push origin master');
  exec(`git push origin v${newVersion}`);
  log('  ✓ Pushed to remote', 'green');

  // Success message
  log('\n✨ Release successful!', 'green');
  log('═══════════════════════════════\n', 'bright');
  log(`🎉 Version ${newVersion} released!\n`, 'bright');
  log('Next steps:', 'blue');
  log('  1. Check GitHub Actions: https://github.com/rusmanplatd/screenkey/actions', 'cyan');
  log('  2. Monitor the build progress', 'cyan');
  log('  3. When builds complete, check: https://github.com/rusmanplatd/screenkey/releases', 'cyan');
  log('  4. Edit and publish the draft release\n', 'cyan');
}

main();
