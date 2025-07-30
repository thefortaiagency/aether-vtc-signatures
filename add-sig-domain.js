#!/usr/bin/env node

import fetch from 'node-fetch';
import { execSync } from 'child_process';

// Configuration
const SUBDOMAIN = 'sig';
const DOMAIN = 'aethervtc.ai';
const FULL_DOMAIN = `${SUBDOMAIN}.${DOMAIN}`;
const VERCEL_URL = 'aether-vtc-signatures.vercel.app';

// GoDaddy credentials
const GODADDY_API_KEY = '9jHwmx1uNpS_KYhM4NMXJez63FjXEcjKhu';
const GODADDY_API_SECRET = 'QYDxHfEyfpLCeJsS8r3CzU';

console.log('🚀 Setting up domain:', FULL_DOMAIN);
console.log('================================================\n');

// Step 1: Add domain to Vercel
console.log('📌 Step 1: Adding domain to Vercel project...');
try {
  execSync(`vercel domains add ${FULL_DOMAIN}`, { stdio: 'inherit' });
  console.log('✅ Domain added to Vercel successfully!\n');
} catch (error) {
  console.log('⚠️  Note: Domain may already exist or you need to add it manually in Vercel dashboard\n');
}

// Step 2: Configure GoDaddy DNS
console.log('📌 Step 2: Configuring GoDaddy DNS...');
async function setupGoDaddyDNS() {
  try {
    const response = await fetch(`https://api.godaddy.com/v1/domains/${DOMAIN}/records/CNAME/${SUBDOMAIN}`, {
      method: 'PUT',
      headers: {
        'Authorization': `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        data: VERCEL_URL,
        ttl: 600
      }])
    });

    if (response.ok) {
      console.log('✅ GoDaddy DNS configured successfully!');
      console.log(`   CNAME record: ${SUBDOMAIN} → ${VERCEL_URL}`);
    } else {
      const error = await response.text();
      console.log('❌ GoDaddy API Error:', response.status, error);
      showManualInstructions();
    }
  } catch (error) {
    console.log('❌ Failed to configure DNS:', error.message);
    showManualInstructions();
  }
}

function showManualInstructions() {
  console.log('\n📝 Manual DNS Setup Instructions:');
  console.log('================================================');
  console.log('1. Go to https://godaddy.com and sign in');
  console.log('2. Click "My Products" → Find "aethervtc.ai" → Click "DNS"');
  console.log('3. Add a new record:');
  console.log('   - Type: CNAME');
  console.log(`   - Name: ${SUBDOMAIN}`);
  console.log(`   - Value: ${VERCEL_URL}`);
  console.log('   - TTL: 600');
  console.log('4. Click "Save"');
}

// Step 3: Update logo URLs in HTML
console.log('\n📌 Step 3: Updating signature URLs...');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, 'index.html');
if (fs.existsSync(htmlPath)) {
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Replace the logo URLs
  const oldUrl = 'https://aethervtc.thefortaiagency.ai/aether-logo.png';
  const newUrl = `https://${FULL_DOMAIN}/aether-logo.png`;
  
  htmlContent = htmlContent.replace(new RegExp(oldUrl, 'g'), newUrl);
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`✅ Updated logo URLs to use ${FULL_DOMAIN}`);
}

// Run the DNS setup
await setupGoDaddyDNS();

// Summary
console.log('\n📊 Setup Summary:');
console.log('================================================');
console.log(`✓ Domain: ${FULL_DOMAIN}`);
console.log(`✓ Points to: ${VERCEL_URL}`);
console.log(`✓ DNS Provider: GoDaddy`);
console.log('\n🎯 Next Steps:');
console.log('1. Wait 5-10 minutes for DNS propagation');
console.log(`2. Test by visiting: https://${FULL_DOMAIN}`);
console.log('\n✨ Your signatures will be available at:');
console.log(`   https://${FULL_DOMAIN}`);