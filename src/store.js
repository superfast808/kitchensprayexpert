import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const dataDir = path.resolve(process.env.DATA_DIR || './data');
export const uploadsDir = path.join(dataDir, 'uploads');
const dbFile = path.join(dataDir, 'site.json');
fs.mkdirSync(uploadsDir, { recursive: true });
let db = { media: [], leads: [], settings: {} };
if (fs.existsSync(dbFile)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    db = { media: Array.isArray(loaded.media) ? loaded.media : [], leads: Array.isArray(loaded.leads) ? loaded.leads : [], settings: loaded.settings || {} };
  } catch (err) { throw new Error('Could not read persistent site data: ' + err.message); }
}
function persist() {
  const temp = dbFile + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(db, null, 2), { mode: 0o600 });
  fs.renameSync(temp, dbFile);
}
export function media() { return db.media.slice().sort((a,b) => Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt)); }
export function leads() { return db.leads.slice().reverse(); }
export function settings() { return { ...db.settings }; }
export function addLead(data) {
  db.leads.push({ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  persist();
}
export function addMedia(data) {
  if (data.source && db.media.some(m => m.source === data.source)) return false;
  db.media.push({ id: crypto.randomUUID(), alt: '', featured: false, category: 'inspiration', createdAt: new Date().toISOString(), ...data });
  persist();
  return true;
}
export function updateMedia(id, fields) {
  const item = db.media.find(x => x.id === id);
  if (!item) return false;
  if (typeof fields.alt === 'string') item.alt = fields.alt.slice(0, 180);
  if (typeof fields.category === 'string' && ['inspiration','project','before','after'].includes(fields.category)) item.category = fields.category;
  if (fields.featured !== undefined) {
    if (fields.featured) db.media.forEach(x => { x.featured = false; });
    item.featured = !!fields.featured;
  }
  persist();
  return true;
}
export function removeMedia(id) {
  const index = db.media.findIndex(x => x.id === id);
  if (index === -1) return false;
  const [item] = db.media.splice(index, 1);
  if (item.file && /^[a-f0-9-]+\.webp$/.test(item.file)) {
    try { fs.unlinkSync(path.join(uploadsDir, item.file)); } catch {}
  }
  persist();
  return true;
}
export function saveSettings(newSettings) {
  const allowed = ['heroTitle','heroSubtitle','announcement'];
  for (const key of allowed) if (typeof newSettings[key] === 'string') db.settings[key] = newSettings[key].trim().slice(0, 500);
  if (newSettings.googleVerification !== undefined) {
    const filename = String(newSettings.googleVerification || '').trim();
    db.settings.googleVerification = /^google[a-zA-Z0-9_-]+\.html$/.test(filename) ? filename : '';
  }
  persist();
}

export function deleteLead(id) {
  const before = db.leads.length;
  db.leads = db.leads.filter(x => x.id !== id);
  if (db.leads.length === before) return false;
  persist();
  return true;
}
