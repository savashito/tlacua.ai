const express = require('express');
const axios = require('axios');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration - You'll need to set these environment variables
const CLIENT_ID = process.env.META_APP_ID || 'your_meta_app_id';
const CLIENT_SECRET = process.env.META_APP_SECRET || 'your_meta_app_secret';
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/callback';
const CONFIGURATION_ID = process.env.CONFIGURATION_ID || 'your_configuration_id';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Store for demo purposes (in production, use a database)
const connectedAccounts = [];

// Route: Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Get the OAuth authorization URL
app.get('/api/auth-url', (req, res) => {
  // Generate a state parameter for CSRF protection
  const state = Math.random().toString(36).substring(7);
  req.session.oauthState = state;
  
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=whatsapp_business_management` +
    `&state=${state}` +
    `&response_type=code`;
  
  res.json({ authUrl });
});

// Route: OAuth callback - handles the redirect from Meta
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Verify state parameter for CSRF protection
  if (state !== req.session.oauthState) {
    return res.status(400).send('Invalid state parameter');
  }
  
  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code
      }
    );
    
    const { access_token, user_id } = tokenResponse.data;
    
    // Get user information
    const userResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${access_token}`
    );
    
    const userData = {
      userId: user_id,
      name: userResponse.data.name,
      email: userResponse.data.email,
      accessToken: access_token,
      connectedAt: new Date().toISOString(),
      permissions: ['whatsapp_business_management', 'whatsapp_business_messaging']
    };
    
    // Store the connected account
    connectedAccounts.push(userData);
    req.session.connectedAccount = userData;
    
    // Redirect to success page
    res.redirect('/success.html?user=' + encodeURIComponent(userData.name));
    
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
});

// Route: Get connected accounts (for demo dashboard)
app.get('/api/accounts', (req, res) => {
  res.json({
    accounts: connectedAccounts.map(acc => ({
      name: acc.name,
      email: acc.email,
      connectedAt: acc.connectedAt,
      permissions: acc.permissions
    }))
  });
});

// Route: Simulate getting WhatsApp business profile info (permission demonstration)
app.get('/api/whatsapp-profile/:accountId', async (req, res) => {
  const account = connectedAccounts.find(a => a.userId === req.params.accountId);
  
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }
  
  try {
    // This would be a real API call in production
    // For demo, we return mock data
    const profileInfo = {
      businessAccountId: 'demo_waba_123456',
      displayName: 'Auditivos Urquita',
      phoneNumber: '+52 55 1234 5678',
      status: 'CONNECTED',
      messageQuality: 'HIGH',
      permissions: [
        'whatsapp_business_management',
        'whatsapp_business_messaging'
      ],
      capabilities: [
        'Send messages to customers',
        'Receive customer messages',
        'Upload and retrieve media',
        'Access business profile information',
        'Manage phone number registration'
      ]
    };
    
    res.json(profileInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 WhatsApp Permission Demo Server Running`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`\n⚙️  Configuration:`);
  console.log(`   Client ID: ${CLIENT_ID}`);
  console.log(`   Redirect URI: ${REDIRECT_URI}`);
});
