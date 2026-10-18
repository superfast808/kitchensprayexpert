import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { dataDir } from './store.js';

// The hash in the persistent data volume takes precedence over a legacy raw .env password.
// This avoids Docker Compose interpolation of $-containing passwords.
const authFile = path.join(dataDir, 'admin-auth.json');
const scryptOptions = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function savedCredentials() {
  if (!fs.existsSync(authFile)) return null;
  const data = JSON.parse(fs.readFileSync(authFile, 'utf8'));
  if (data.version !== 1 || typeof data.salt !== 'string' || typeof data.hash !== 'string' ||
      !/^[a-f0-9]{32}$/.test(data.salt) || !/^[a-f0-9]{128}$/.test(data.hash)) {
    throw new Error('Admin password file is damaged; run password reset again.');
  }
  return data;
}
export function passwordSource() {
  return savedCredentials() ? 'hashed data volume' :
    process.env.ADMIN_PASSWORD ? 'Docker environment' : 'not configured';
}
export function hasPassword() { return passwordSource() !== 'not configured'; }
export function verifyPassword(input) {
  const saved = savedCredentials();
  if (saved) {
    const result = crypto.scryptSync(String(input), Buffer.from(saved.salt, 'hex'), 64, scryptOptions);
    return crypto.timingSafeEqual(result, Buffer.from(saved.hash, 'hex'));
  }
  const old = process.env.ADMIN_PASSWORD || '';
  if (!old) return false;
  const actual = crypto.createHash('sha256').update(String(input)).digest();
  const expected = crypto.createHash('sha256').update(old).digest();
  return crypto.timingSafeEqual(actual, expected);
}
export function credentialVersion() {
  const saved = savedCredentials();
  const identifier = saved ? saved.hash : process.env.ADMIN_PASSWORD || '';
  return crypto.createHash('sha256').update(identifier).digest('hex');
}
export function setAdminPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 256 ||
      /[\r\n\0]/.test(password)) throw new Error('Choose a password between 12 and 256 characters, with no newlines.');
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64, scryptOptions);
  const file = JSON.stringify({ version: 1, salt: salt.toString('hex'), hash: hash.toString('hex') });
  const temp = authFile + '.' + crypto.randomUUID() + '.tmp';
  try {
    fs.writeFileSync(temp, file, { mode: 0o600, flag: 'wx' });
    fs.renameSync(temp, authFile);
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
}
