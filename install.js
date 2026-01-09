const { spawn } = require('child_process');

// Path to Git Bash executable (default installation path)
const bashPath = 'C:\\Program Files\\Git\\bin\\bash.exe';

// Commands to run in Git Bash
const command = 'npm install && npm install cors';

// Spawn Git Bash with the commands
const child = spawn(bashPath, ['-c', command], {
  stdio: 'inherit', // Inherit stdio to show output in console
  cwd: process.cwd() // Run in current working directory
});

// Handle process events
child.on('close', (code) => {
  console.log(`Git Bash process exited with code ${code}`);
});

child.on('error', (err) => {
  console.error('Failed to start Git Bash:', err);
});
