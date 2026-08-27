const { spawn, execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Labour Management Platform (Backend + Frontend)...');

const isWin = process.platform === 'win32';

// Automatically free ports 5000 and 3000 if previously occupied
try {
  if (isWin) {
    execSync('powershell -Command "Get-NetTCPConnection -LocalPort 5000,3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"', { stdio: 'ignore' });
  }
} catch (e) {
  // Ignored if no processes were listening on 5000/3000
}

const serverCwd = path.join(__dirname, 'server');
const clientCwd = path.join(__dirname, 'client');

const runCmd = (cmd, cwd) => {
  if (isWin) {
    return spawn('cmd.exe', ['/c', cmd], { cwd, stdio: 'inherit' });
  } else {
    return spawn('sh', ['-c', cmd], { cwd, stdio: 'inherit' });
  }
};

const server = runCmd('npm run dev', serverCwd);
const client = runCmd('npm run dev', clientCwd);

// Automatically open browser (Chrome / Edge) to http://localhost:3000
setTimeout(() => {
  console.log('🌐 Opening browser at http://localhost:3000 ...');
  if (isWin) {
    spawn('cmd.exe', ['/c', 'start http://localhost:3000'], { stdio: 'ignore' });
  } else if (process.platform === 'darwin') {
    spawn('open', ['http://localhost:3000'], { stdio: 'ignore' });
  } else {
    spawn('xdg-open', ['http://localhost:3000'], { stdio: 'ignore' });
  }
}, 1500);

const cleanup = () => {
  try { server.kill(); } catch (e) {}
  try { client.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
