/**
 * Scripts configuration and scanning rules
 * DO NOT hardcode sensitive production credentials or customer PII here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();

// Disallowed patterns
const SENSITIVE_PATTERNS = [
  { name: 'Private Key Header', regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'GitHub Personal Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/ },
  { name: 'Generic API Key Variable', regex: /(?:api[_-]?key|secret[_-]?key|auth[_-]?token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i },
  { name: 'Database Connection String with Password', regex: /(?:postgres|mysql|mongodb(?:\+srv)?):\/\/[^:\s]+:[^@\s]+@[^\s]+/i },
  { name: 'Russian INN (10 or 12 digits)', regex: /\b(?:ИНН\s*[:№]?\s*)(\d{10}|\d{12})\b/i },
  { name: 'Russian Bank Account (20 digits)', regex: /\b(?:40702|40802|30101)\d{15}\b/ },
  { name: 'Windows Absolute User Profile Path', regex: /[A-Za-z]:\\Users\\[A-Za-z0-9_.-]+(?:\\[A-Za-z0-9_.-]+)*/i },
  { name: 'Unix Absolute Home Directory Path', regex: /\/(?:home|Users)\/[A-Za-z0-9_.-]+/i },
  { name: 'Russian Real Mobile Phone Number', regex: /(?:\+7|8)[\s(-]?[9][0-9]{2}[\s)-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}/ }
];

// Allowlist for synthetic and demo files / patterns
const ALLOWED_MATCHES = [
  'info@example.com',
  'support@example.com',
  'contact@northern-port.example.internal',
  'VITE_APP_BASE_URL',
  'VITE_ENABLE_INTERACTIVE_DEMOS',
  'VITE_SHOW_SPEAKER_NOTES',
  'node_modules',
  'scan-sensitive-data.mjs'
];

function getTrackedAndStagedFiles() {
  try {
    const gitFiles = execSync('git ls-files', { encoding: 'utf-8' });
    return gitFiles.split('\n').map(f => f.trim()).filter(Boolean);
  } catch (_e) {
    // Fallback: scan working directory recursively
    return walkDir(ROOT_DIR).map(f => path.relative(ROOT_DIR, f));
  }
}

function walkDir(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
      files = files.concat(walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

let violationsCount = 0;
const files = getTrackedAndStagedFiles();

console.log(`[scan-sensitive-data] Scanning ${files.length} tracked files for secrets and PII...`);

for (const relPath of files) {
  // Ignore self and lock files
  if (relPath.includes('scan-sensitive-data.mjs') || relPath === 'package-lock.json') {
    continue;
  }

  // Check forbidden .env files
  const baseName = path.basename(relPath);
  if (baseName.startsWith('.env') && baseName !== '.env.example') {
    console.error(`❌ VIOLATION: Forbidden environment file found in repository: ${relPath}`);
    violationsCount++;
    continue;
  }

  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) continue;

  const stat = fs.statSync(fullPath);
  if (stat.size > 2 * 1024 * 1024) continue; // Skip huge binaries in this text scanner

  let content;
  try {
    content = fs.readFileSync(fullPath, 'utf-8');
  } catch (_e) {
    continue; // Binary file
  }

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    for (const rule of SENSITIVE_PATTERNS) {
      if (rule.regex.test(line)) {
        // Check allowlist
        const isAllowed = ALLOWED_MATCHES.some(allowed => line.includes(allowed));
        if (!isAllowed) {
          console.error(`❌ VIOLATION: [${rule.name}] in ${relPath}:${index + 1}`);
          console.error(`   Content: ${line.trim().substring(0, 100)}`);
          violationsCount++;
        }
      }
    }
  });
}

if (violationsCount > 0) {
  console.error(`\n[scan-sensitive-data] FAILED: Found ${violationsCount} sensitive data violation(s).`);
  process.exit(1);
} else {
  console.log('✅ [scan-sensitive-data] PASSED: No sensitive data, secrets, or forbidden PII patterns found.');
}
