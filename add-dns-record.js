#!/usr/bin/env node

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function addARecord() {
  const apiKey = process.env.GODADDY_API_KEY;
  const apiSecret = process.env.GODADDY_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    console.error('Missing GoDaddy API credentials');
    process.exit(1);
  }

  const domain = 'thefortaiagency.ai';
  const subdomain = 'aethervtcsig';
  const ip = '76.76.21.21';
  
  console.log(`Adding A record: ${subdomain}.${domain} → ${ip}`);
  
  const url = `https://api.godaddy.com/v1/domains/${domain}/records/A/${subdomain}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `sso-key ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        data: ip,
        ttl: 600
      }])
    });
    
    if (response.ok) {
      console.log('✅ DNS record added successfully!');
      console.log(`🌐 ${subdomain}.${domain} will be available shortly`);
    } else {
      const error = await response.text();
      console.error('❌ Failed to add DNS record:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Load env vars manually
import { readFileSync } from 'fs';
const envContent = readFileSync('/Users/thefortob/Development/ACTIVE-PROJECTS/nexus-platform-automation/.env', 'utf8');
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    process.env[key.trim()] = value.trim();
  }
});

addARecord();