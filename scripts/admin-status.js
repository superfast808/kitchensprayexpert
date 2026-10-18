import { passwordSource } from '../src/admin-auth.js';
console.log('Admin password source:', passwordSource());
console.log('SESSION_SECRET configured:', Boolean(process.env.SESSION_SECRET));
console.log('Preview mode:', process.env.PREVIEW_MODE !== 'false' ? 'enabled' : 'disabled');
console.log('Port:', process.env.PORT || '8106');
console.log('No passwords or secrets are shown by this command.');
