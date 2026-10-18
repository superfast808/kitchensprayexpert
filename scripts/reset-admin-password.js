import { emitKeypressEvents } from 'node:readline';
import { setAdminPassword } from '../src/admin-auth.js';

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error('Interactive terminal required. Run: docker compose exec -it web node scripts/reset-admin-password.js');
  process.exit(1);
}

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

function promptSecret(label) {
  return new Promise((resolve, reject) => {
    let value = '';
    process.stdout.write(label);
    function onKey(str, key) {
      if (key?.ctrl && key.name === 'c') {
        process.stdin.off('keypress', onKey);
        reject(new Error('Cancelled'));
        return;
      }
      if (key?.name === 'return' || key?.name === 'enter') {
        process.stdin.off('keypress', onKey);
        process.stdout.write('\n');
        resolve(value);
        return;
      }
      if (key?.name === 'backspace') {
        if (value.length) {
          value = value.slice(0, -1);
          process.stdout.write('\b \b');
        }
        return;
      }
      if (str && !key?.ctrl && !key?.meta && str >= ' ' && value.length < 256) {
        value += str;
        process.stdout.write('*');
      }
    }
    process.stdin.on('keypress', onKey);
  });
}

try {
  console.log('Reset the Kitchen Spraying Expert admin login. Password is never displayed.');
  const password = await promptSecret('New password (at least 12 characters): ');
  if (password.length < 12) throw new Error('Password must contain at least 12 characters.');
  const confirmation = await promptSecret('Confirm new password: ');
  if (password !== confirmation) throw new Error('Passwords did not match.');
  setAdminPassword(password);
  console.log('Admin password updated. It is stored as a salted scrypt hash in the Docker data volume.');
  console.log('You can log in immediately. Previous sessions are invalidated.');
} catch (error) {
  console.error('\nPassword was not changed:', error.message);
  process.exitCode = 1;
} finally {
  process.stdin.setRawMode(false);
  process.stdin.pause();
}
