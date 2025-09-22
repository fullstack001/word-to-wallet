// Simple test script to verify frontend can connect to backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function testFrontendAPI() {
  console.log("Testing frontend API connection...\n");
  console.log("API Base URL:", API_BASE);

  // Test 1: Health check
  try {
    console.log("1. Testing health check...");
    const healthResponse = await fetch("http://localhost:5000/health");
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);
  } catch (error) {
    console.log("❌ Health check failed:", error.message);
  }

  // Test 2: Auth register endpoint
  try {
    console.log("\n2. Testing auth register endpoint...");
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "testpassword123",
        firstName: "Test",
        lastName: "User",
      }),
    });

    const registerData = await registerResponse.json();
    console.log("✅ Register endpoint response:", {
      status: registerResponse.status,
      data: registerData,
    });
  } catch (error) {
    console.log("❌ Register endpoint failed:", error.message);
  }

  // Test 3: Check environment variables
  console.log("\n3. Checking frontend environment variables...");
  const envVars = ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"];

  envVars.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value}`);
    } else {
      console.log(`❌ ${varName}: Not set`);
    }
  });
}

// Run the test
testFrontendAPI().catch(console.error);
