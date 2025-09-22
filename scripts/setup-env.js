#!/usr/bin/env node

/**
 * Environment Setup Script for Word2Wallet Frontend
 * This script helps you set up the environment configuration
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log("🚀 Word2Wallet Frontend Environment Setup");
  console.log("==========================================\n");

  try {
    // Check if .env.local already exists
    const envLocalPath = path.join(__dirname, "..", ".env.local");
    if (fs.existsSync(envLocalPath)) {
      const overwrite = await question(
        "⚠️  .env.local already exists. Overwrite? (y/N): "
      );
      if (
        overwrite.toLowerCase() !== "y" &&
        overwrite.toLowerCase() !== "yes"
      ) {
        console.log("❌ Setup cancelled.");
        rl.close();
        return;
      }
    }

    console.log("Please provide the following information:\n");

    // API Configuration
    const apiUrl =
      (await question(
        "🔗 Backend API URL (default: http://localhost:5000/api): "
      )) || "http://localhost:5000/api";

    // Stripe Configuration
    const stripeKey = await question("💳 Stripe Public Key (pk_test_...): ");

    // Contentful Configuration
    const contentfulSpaceId = await question("📝 Contentful Space ID: ");
    const contentfulAccessToken = await question(
      "🔑 Contentful Access Token: "
    );

    // Environment
    const nodeEnv =
      (await question(
        "🌍 Environment (development/production) [development]: "
      )) || "development";

    // Port
    const port = (await question("🚪 Frontend Port [3065]: ")) || "3065";

    // Generate .env.local content
    const envContent = `# Frontend Environment Configuration
# Generated on ${new Date().toISOString()}
# DO NOT commit this file to version control

# ===========================================
# API Configuration
# ===========================================
NEXT_PUBLIC_API_URL=${apiUrl}

# ===========================================
# Payment Configuration (Stripe)
# ===========================================
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=${stripeKey}

# ===========================================
# Content Management (Contentful)
# ===========================================
CONTENTFUL_SPACE_ID=${contentfulSpaceId}
CONTENTFUL_ACCESS_TOKEN=${contentfulAccessToken}

# ===========================================
# Application Configuration
# ===========================================
NODE_ENV=${nodeEnv}
PORT=${port}

# ===========================================
# Internationalization
# ===========================================
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,es,fr,ko,se

# ===========================================
# File Upload Configuration
# ===========================================
NEXT_PUBLIC_MAX_FILE_SIZE=52428800
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,epub

# ===========================================
# Security Configuration
# ===========================================
NEXT_PUBLIC_DEBUG_MODE=${nodeEnv === "development" ? "true" : "false"}

# ===========================================
# Development Tools
# ===========================================
NEXT_PUBLIC_ENABLE_DEV_TOOLS=${nodeEnv === "development" ? "true" : "false"}
`;

    // Write .env.local file
    fs.writeFileSync(envLocalPath, envContent);

    console.log("\n✅ Environment configuration created successfully!");
    console.log(`📁 File created: ${envLocalPath}`);
    console.log("\n📋 Next steps:");
    console.log("1. Review the generated .env.local file");
    console.log("2. Update any values as needed");
    console.log("3. Start your development server with: npm run dev");
    console.log("\n⚠️  Remember: Never commit .env.local to version control!");
  } catch (error) {
    console.error("❌ Error setting up environment:", error.message);
  } finally {
    rl.close();
  }
}

// Run the setup
if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment };
