#!/usr/bin/env node

/**
 * Run all frontend QA tests
 * 
 * Usage:
 *   node run-all-tests.js
 *   node run-all-tests.js --skip-e2e
 *   node run-all-tests.js --only-unit
 */

const { spawn } = require('child_process');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const runTest = (command, args, description) => {
  return new Promise((resolve, reject) => {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`Running: ${description}`, 'cyan');
    log(`${'='.repeat(60)}`, 'cyan');
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname,
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`\n✅ ${description} - PASSED`, 'green');
        resolve(true);
      } else {
        log(`\n❌ ${description} - FAILED (exit code: ${code})`, 'red');
        resolve(false);
      }
    });

    child.on('error', (error) => {
      log(`\n❌ Error running ${description}: ${error.message}`, 'red');
      reject(error);
    });
  });
};

const main = async () => {
  const args = process.argv.slice(2);
  const skipE2E = args.includes('--skip-e2e');
  const onlyUnit = args.includes('--only-unit');

  log('\n🧪 Word2Wallet Frontend QA Test Suite', 'magenta');
  log('='.repeat(60), 'magenta');

  const results = [];

  try {
    // 1. Unit/Integration Tests (Jest)
    if (!onlyUnit || args.includes('--jest')) {
      log('\n📝 Running Jest unit/integration tests...', 'blue');
      const passed = await runTest('npm', ['run', 'test'], 'Jest Unit/Integration Tests');
      results.push({ name: 'Jest Unit/Integration Tests', passed });
    }

    // 2. API Connection Test
    if (!onlyUnit || args.includes('--api')) {
      const passed = await runTest('node', ['test-frontend-api.js'], 'Frontend API Connection Test');
      results.push({ name: 'Frontend API Connection Test', passed });
    }

    // Summary
    log('\n' + '='.repeat(60), 'magenta');
    log('📊 Test Summary', 'magenta');
    log('='.repeat(60), 'magenta');

    results.forEach((result) => {
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      const color = result.passed ? 'green' : 'red';
      log(`${status.padEnd(15)} ${result.name}`, color);
    });

    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    const allPassed = passedCount === totalCount;

    log('\n' + '-'.repeat(60), 'cyan');
    log(`Total: ${passedCount}/${totalCount} tests passed`, allPassed ? 'green' : 'yellow');
    log('-'.repeat(60), 'cyan');

    if (allPassed) {
      log('\n🎉 All tests passed!', 'green');
      process.exit(0);
    } else {
      log('\n⚠️  Some tests failed. Please review the output above.', 'yellow');
      process.exit(1);
    }
  } catch (error) {
    log(`\n💥 Test suite crashed: ${error.message}`, 'red');
    process.exit(1);
  }
};

// Handle help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node run-all-tests.js [options]

Options:
  --skip-e2e              Skip end-to-end tests (if any)
  --only-unit             Run only unit tests
  --jest                  Run Jest tests
  --api                   Run API connection tests
  --help, -h              Show this help message

Examples:
  node run-all-tests.js
  node run-all-tests.js --skip-e2e
  node run-all-tests.js --only-unit
`);
  process.exit(0);
}

main();

