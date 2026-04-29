#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const clientDir = path.join(rootDir, 'my-app', 'client');
const serverDir = path.join(rootDir, 'my-app', 'server');

function spawnProcess(command, args, cwd, name) {
  const proc = spawn(command, args, { cwd, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });

  proc.stdout.on('data', (data) => {
    process.stdout.write(`[${name}] ${data}`);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`[${name}] ${data}`);
  });

  proc.on('exit', (code) => {
    console.log(`[${name}] exited with code ${code}`);
  });

  return proc;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Starting regression test environment...');

  const server = spawnProcess('npm', ['start'], serverDir, 'server');
  const client = spawnProcess('npm', ['start'], clientDir, 'client');

  try {
    console.log('Waiting for server and client to start...');
    await wait(12000);

    console.log('Running Cypress regression tests...');
    const cypress = spawnProcess('npx', ['cypress', 'run'], clientDir, 'cypress');

    const exitCode = await new Promise((resolve) => {
      cypress.on('exit', resolve);
    });

    if (exitCode !== 0) {
      throw new Error(`Cypress regression tests failed with exit code ${exitCode}`);
    }

    console.log('Regression tests passed.');
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (client && !client.killed) client.kill();
    if (server && !server.killed) server.kill();
  }
}

run();
