#!/usr/bin/env node

/**
 * Simple script to copy env.template to .env.local
 */

const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "..", "env.template");
const envLocalPath = path.join(__dirname, "..", ".env.local");

try {
  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.error("❌ env.template file not found!");
    process.exit(1);
  }

  // Check if .env.local already exists
  if (fs.existsSync(envLocalPath)) {
    console.log("⚠️  .env.local already exists. Skipping copy.");
    console.log(
      "💡 If you want to overwrite, delete .env.local first or use: npm run setup-env"
    );
    process.exit(0);
  }

  // Copy template to .env.local
  fs.copyFileSync(templatePath, envLocalPath);

  console.log("✅ Environment template copied to .env.local");
  console.log("📝 Please edit .env.local with your actual values");
  console.log("🚀 Then run: npm run dev");
} catch (error) {
  console.error("❌ Error copying environment template:", error.message);
  process.exit(1);
}
