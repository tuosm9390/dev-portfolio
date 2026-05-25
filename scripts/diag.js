const { execSync } = require('child_process');
const fs = require('fs');

console.log('--- RUNNING BROWSE STATUS DIRECTLY ---');
const stateFile = 'D:\\development\\dev-portfolio\\.gstack\\browse.json';

try { fs.unlinkSync('D:\\development\\dev-portfolio\\.gstack\\browse.json.lock'); } catch (e) {}
try { fs.unlinkSync(stateFile); } catch (e) {}

try {
  const out = execSync('D:\\development\\dev-portfolio\\.agents\\skills\\gstack\\browse\\dist\\browse.exe status', {
    encoding: 'utf-8',
    env: { ...process.env, BROWSE_STATE_FILE: stateFile }
  });
  console.log('browse.exe status output:', out);
} catch (e) {
  console.log('browse.exe status failed:', e.message);
  if (e.stdout) console.log('Stdout:', e.stdout);
  if (e.stderr) console.log('Stderr:', e.stderr);
}




