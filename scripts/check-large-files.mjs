import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Megabytes

// File extensions strictly forbidden from direct Git tracking without explicit policy
const MONITORED_EXTENSIONS = ['.dwg', '.pdf', '.zip', '.mp4', '.mov', '.psd', '.sqlite', '.db', '.docx', '.xlsx'];

function getTrackedFiles() {
  try {
    const gitFiles = execSync('git ls-files', { encoding: 'utf-8' });
    return gitFiles.split('\n').map(f => f.trim()).filter(Boolean);
  } catch (_e) {
    return [];
  }
}

const files = getTrackedFiles();
let hasErrors = false;

console.log(`[check-large-files] Inspecting ${files.length} tracked files for oversized assets (>10MB)...`);

for (const relPath of files) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) continue;

  const stat = fs.statSync(fullPath);
  const ext = path.extname(relPath).toLowerCase();

  if (stat.size > MAX_FILE_SIZE_BYTES) {
    console.error(`❌ VIOLATION: File exceeds size limit (10MB): ${relPath} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
    hasErrors = true;
  }

  // Warning for monitored binary extensions
  if (MONITORED_EXTENSIONS.includes(ext) && stat.size > 2 * 1024 * 1024) {
    console.warn(`⚠️ WARNING: Large binary file (${ext}) tracked: ${relPath} (${(stat.size / (1024 * 1024)).toFixed(2)} MB). Check if Git LFS or external CDN is needed.`);
  }
}

if (hasErrors) {
  console.error('\n[check-large-files] FAILED: Files larger than 10MB found. Git LFS or external storage is required.');
  process.exit(1);
} else {
  console.log('✅ [check-large-files] PASSED: All tracked files are within the 10MB limit.');
}
