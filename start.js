const { spawn, execSync } = require('child_process');
const path = require('path');
const http = require('http');

console.log('\n===============================================================');
console.log('🚀  Labour Management & Workforce Booking Platform Starting... ');
console.log('===============================================================\n');

const isWin = process.platform === 'win32';

// Safely free ports 5000 and 3000 if previously occupied on Windows
try {
  if (isWin) {
    execSync('powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 5000,3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"', { stdio: 'ignore' });
  }
} catch (e) {
  // Ignored if ports were already free
}

const serverCwd = path.join(__dirname, 'server');
const clientCwd = path.join(__dirname, 'client');

// Start Express Backend
console.log('📦 Starting Backend API Server (Port 5000)...');
const serverProcess = spawn(isWin ? 'npm.cmd run dev' : 'npm run dev', {
  cwd: serverCwd,
  stdio: 'inherit',
  shell: true,
});

// Start Vite Frontend
console.log('🎨 Starting Frontend Application (Port 3000)...');
const clientProcess = spawn(isWin ? 'npm.cmd run dev' : 'npm run dev', {
  cwd: clientCwd,
  stdio: 'inherit',
  shell: true,
});

let browserOpened = false;
const checkAndOpenBrowser = () => {
  if (browserOpened) return;
  const req = http.get('http://localhost:3000', () => {
    browserOpened = true;
    console.log('\n✨ Platform Ready! Opening browser at http://localhost:3000 ...\n');
    if (isWin) {
      spawn('cmd.exe /c start http://localhost:3000', { stdio: 'ignore', shell: true });
    } else if (process.platform === 'darwin') {
      spawn('open http://localhost:3000', { stdio: 'ignore', shell: true });
    } else {
      spawn('xdg-open http://localhost:3000', { stdio: 'ignore', shell: true });
    }
  });
  req.on('error', () => {
    setTimeout(checkAndOpenBrowser, 1000);
  });
};

setTimeout(checkAndOpenBrowser, 1500);

const killProcessTree = (proc) => {
  if (!proc || !proc.pid) return;
  try {
    if (isWin) {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
    } else {
      proc.kill('SIGTERM');
    }
  } catch (e) {}
};

const cleanup = () => {
  console.log('\n🛑 Shutting down servers gracefully...');
  killProcessTree(serverProcess);
  killProcessTree(clientProcess);
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
