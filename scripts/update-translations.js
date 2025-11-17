// Script to merge new translation keys from en.json into all other language files
const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const enJsonPath = path.join(messagesDir, 'en.json');

// Read English JSON (source of truth)
const enContent = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// Get all language files except en.json
const languageFiles = fs.readdirSync(messagesDir)
  .filter(file => file.endsWith('.json') && file !== 'en.json');

// Function to deep merge objects, preserving existing translations
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        // If key doesn't exist in target, add it with English value as placeholder
        if (!(key in target)) {
          output[key] = source[key];
        }
        // Otherwise keep existing translation
      }
    });
  }
  
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Update each language file
languageFiles.forEach(file => {
  const filePath = path.join(messagesDir, file);
  const langContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Merge new keys from English into the language file
  const merged = deepMerge(langContent, enContent);
  
  // Write back to file with proper formatting
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  console.log(`Updated ${file}`);
});

console.log(`\n✅ Successfully updated ${languageFiles.length} language files!`);
console.log('Note: New keys have been added with English values as placeholders.');
console.log('Please review and translate the new keys in each language file.');

