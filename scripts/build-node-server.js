const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const gstackDir = 'D:\\development\\dev-portfolio\\.agents\\skills\\gstack';
const srcDir = path.join(gstackDir, 'browse', 'src');
const distDir = path.join(gstackDir, 'browse', 'dist');

console.log('Building Node-compatible server bundle on Windows...');

// Step 1: Transpile server.ts to server-node.mjs using bun
const buildCmd = `bun build "${path.join(srcDir, 'server.ts')}" --target=node --outfile "${path.join(distDir, 'server-node.mjs')}" --external playwright --external playwright-core --external diff --external bun:sqlite`;
console.log('Running bun build:', buildCmd);
execSync(buildCmd, { shell: true, stdio: 'inherit' });

// Step 2: Post-process server-node.mjs
const serverNodePath = path.join(distDir, 'server-node.mjs');
let code = fs.readFileSync(serverNodePath, 'utf8');

// Replace import.meta.dir
code = code.replace(/import\.meta\.dir/g, '__browseNodeSrcDir');

// Stub out bun:sqlite
code = code.replace(/import\s*{\s*Database\s*}\s*from\s*["']bun:sqlite["'];/g, 'const Database = null; // bun:sqlite stubbed on Node');

// Step 3: Inject polyfill header after the first line (or at the top)
const lines = code.split('\n');
const firstLine = lines[0];
const remainingLines = lines.slice(1).join('\n');

const header = `
// ── Windows Node.js compatibility (auto-generated) ──
import { fileURLToPath as _ftp } from "node:url";
import { dirname as _dn } from "node:path";
import { createRequire as _cr } from "node:module";
const __browseNodeSrcDir = _dn(_dn(_ftp(import.meta.url))) + "/src";
{ const _r = _cr(import.meta.url); _r("./bun-polyfill.cjs"); }
// ── end compatibility ──
`;

const finalCode = firstLine + '\n' + header + '\n' + remainingLines;
fs.writeFileSync(serverNodePath, finalCode, 'utf8');

// Step 4: Copy polyfill to dist/
fs.copyFileSync(path.join(srcDir, 'bun-polyfill.cjs'), path.join(distDir, 'bun-polyfill.cjs'));

console.log('Node server bundle ready:', serverNodePath);
