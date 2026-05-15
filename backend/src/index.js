require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// CORS + JSON
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// 🔥 CRITICAL: Test DB connection on startup
prisma.$connect()
  .then(() => console.log('✅ Connected to Neon DB'))
  .catch(err => {
    console.error('❌ DB Connection Failed:', err.message);
    process.exit(1); // Fail deploy if DB can't connect
  });

// Health check (NO DB required)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Menu endpoint
app.get('/api/menu', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
    res.json(items);
  } catch (err) {
    console.error('Menu error:', err.message);
    res.status(500).json({ error: 'Failed to load menu', details: err.message });
  }
});

// Reservation endpoint
app.post('/api/reservations', async (req, res) => {
  const { name, email, phone, date, guests } = req.body;
  if (!name || !email || !date || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const resv = await prisma.reservation.create({
      data: { name, email, phone, date: new Date(date), guests }
    });
    res.status(201).json(resv);
  } catch (err) {
    console.error('Reservation error:', err.message);
    res.status(400).json({ error: 'Failed to create reservation', details: err.message });
  }
});

// 🔥 CRITICAL: Bind to 0.0.0.0 for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});