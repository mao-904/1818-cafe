require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// 🔥 CRITICAL: Allow ALL origins for now (we'll lock it down later)
app.use(cors({ 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  console.log('✅ Health check hit');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Menu endpoint
app.get('/api/menu', async (req, res) => {
  try {
    console.log('📋 Fetching menu...');
    const items = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
    console.log(`✅ Found ${items.length} items`);
    res.json(items);
  } catch (err) {
    console.error('❌ Menu error:', err.message);
    res.status(500).json({ error: 'Failed to load menu', details: err.message });
  }
});

// Reservation endpoint
app.post('/api/reservations', async (req, res) => {
  console.log('📝 Reservation request:', req.body);
  const { name, email, phone, date, guests } = req.body;
  
  if (!name || !email || !date || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const resv = await prisma.reservation.create({
      data: { name, email, phone, date: new Date(date), guests }
    });
    console.log('✅ Reservation created:', resv.id);
    res.status(201).json(resv);
  } catch (err) {
    console.error('❌ Reservation error:', err.message);
    res.status(400).json({ error: 'Failed to create reservation', details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});