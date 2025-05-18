const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a secure random string
const secret = crypto.randomBytes(64).toString('hex');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Update or add JWT_SECRET
if (envContent.includes('JWT_SECRET=')) {
  envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET=${secret}`);
} else {
  envContent += `\nJWT_SECRET=${secret}`;
}

// Write back to .env file
fs.writeFileSync(envPath, envContent);

console.log('Generated new JWT_SECRET and updated .env file');
console.log('Make sure to update your production environment variables with this secret'); 