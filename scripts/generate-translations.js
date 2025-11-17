// This script helps generate translation files
// Note: This is a placeholder - actual translations should be done by professional translators
// or using translation APIs

const fs = require('fs');
const path = require('path');

const enJsonPath = path.join(__dirname, '../messages/en.json');
const messagesDir = path.join(__dirname, '../messages');

// Read English JSON
const enContent = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// Languages to create (missing ones)
const languages = ['zh', 'cs', 'nl', 'de', 'el', 'hu', 'id', 'it', 'ja', 'ms', 'pl', 'pt', 'ro', 'sr', 'th', 'tr', 'uk', 'vi', 'fi'];

// For now, create files with English content as placeholder
// In production, these should be properly translated
languages.forEach(lang => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(enContent, null, 2), 'utf8');
    console.log(`Created ${lang}.json`);
  } else {
    console.log(`${lang}.json already exists`);
  }
});

console.log('Translation files created. Please replace with proper translations.');

