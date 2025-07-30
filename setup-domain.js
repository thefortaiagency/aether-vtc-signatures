#!/usr/bin/env node

/**
 * Setup sig.aethervtc.ai subdomain for Aether VTC signatures
 * 
 * This script:
 * 1. Adds the custom domain to Vercel project
 * 2. Configures GoDaddy DNS (or provides manual instructions)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUBDOMAIN = 'sig';
const DOMAIN = 'aethervtc.ai';
const FULL_DOMAIN = `${SUBDOMAIN}.${DOMAIN}`;
const VERCEL_URL = 'aether-vtc-signatures.vercel.app'; // Your Vercel deployment URL

console.log('🚀 Setting up domain:', FULL_DOMAIN);
console.log('================================================');

// Step 1: Add domain to Vercel
console.log('\n📌 Step 1: Adding domain to Vercel project...');
try {
  // First, let's ensure we're in the right project
  const projectInfo = execSync('vercel project ls', { encoding: 'utf8' });
  console.log('Current Vercel project:', projectInfo.trim());
  
  // Add the domain to Vercel
  console.log(`Adding ${FULL_DOMAIN} to Vercel...`);
  execSync(`vercel domains add ${FULL_DOMAIN}`, { stdio: 'inherit' });
  
  console.log('✅ Domain added to Vercel successfully!');
} catch (error) {
  console.log('⚠️  Note: You may need to add the domain manually in Vercel dashboard');
  console.log('   Go to: https://vercel.com/dashboard → Your Project → Settings → Domains');
  console.log(`   Add domain: ${FULL_DOMAIN}`);
}

// Step 2: Generate DNS instructions
console.log('\n📌 Step 2: DNS Configuration Instructions');
console.log('================================================');

// Check if we have the DNS automation script
const dnsAutomationPath = '/Users/thefortob/Development/ACTIVE-PROJECTS/grok-evolution/fort-ai-agency/scripts/dns-automation.js';
if (fs.existsSync(dnsAutomationPath)) {
  console.log('Found DNS automation script! Attempting automated setup...\n');
  
  try {
    // Run the DNS automation script
    execSync(`node ${dnsAutomationPath} ${DOMAIN} ${SUBDOMAIN} ${VERCEL_URL}`, { stdio: 'inherit' });
  } catch (error) {
    console.log('DNS automation failed, providing manual instructions...');
  }
} else {
  console.log('DNS automation script not found, providing manual instructions...');
}

// Manual instructions (always show as backup)
console.log('\n📝 Manual DNS Setup Instructions for GoDaddy:');
console.log('================================================');
console.log('1. Go to https://godaddy.com and sign in');
console.log('2. Click "My Products" → Find "aethervtc.ai" → Click "DNS"');
console.log('3. Add a new record with these settings:');
console.log('   - Type: CNAME');
console.log(`   - Name: ${SUBDOMAIN}`);
console.log(`   - Value: ${VERCEL_URL}`);
console.log('   - TTL: 600 (10 minutes)');
console.log('4. Click "Save"');
console.log('5. Wait 5-10 minutes for DNS propagation');

// Step 3: Update the HTML file to use the new domain
console.log('\n📌 Step 3: Updating signature URLs...');
const htmlPath = path.join(__dirname, 'index.html');
if (fs.existsSync(htmlPath)) {
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Replace the logo URLs
  const oldUrl = 'https://aethervtc.thefortaiagency.ai/aether-logo.png';
  const newUrl = `https://${FULL_DOMAIN}/aether-logo.png`;
  
  if (htmlContent.includes(oldUrl)) {
    htmlContent = htmlContent.replace(new RegExp(oldUrl, 'g'), newUrl);
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`✅ Updated logo URLs from ${oldUrl} to ${newUrl}`);
  } else {
    console.log('⚠️  Logo URLs already updated or using different URL');
  }
} else {
  console.log('⚠️  index.html not found in current directory');
}

// Step 4: Summary
console.log('\n📊 Setup Summary:');
console.log('================================================');
console.log(`✓ Domain: ${FULL_DOMAIN}`);
console.log(`✓ Points to: ${VERCEL_URL}`);
console.log('✓ Type: CNAME record');
console.log('✓ Provider: GoDaddy');
console.log('\n🎯 Next Steps:');
console.log('1. Verify domain is added in Vercel dashboard');
console.log('2. Add CNAME record in GoDaddy DNS settings');
console.log('3. Wait for DNS propagation (5-10 minutes)');
console.log(`4. Test by visiting: https://${FULL_DOMAIN}`);
console.log('\n✨ Once DNS propagates, your signatures will be available at:');
console.log(`   https://${FULL_DOMAIN}`);

// Save configuration
const configPath = path.join(__dirname, 'domain-config.json');
const config = {
  domain: FULL_DOMAIN,
  subdomain: SUBDOMAIN,
  rootDomain: DOMAIN,
  vercelUrl: VERCEL_URL,
  setupDate: new Date().toISOString(),
  logoUrl: `https://${FULL_DOMAIN}/aether-logo.png`
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`\n📁 Configuration saved to: ${configPath}`);