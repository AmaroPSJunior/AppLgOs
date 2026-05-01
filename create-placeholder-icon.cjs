const fs = require('fs');

// Transparant 1x1 PNG pixel
const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buffer = Buffer.from(base64Data, 'base64');

fs.writeFileSync('public/icon.png', buffer);
console.log('✅ Placeholder icon.png criado em public/');
