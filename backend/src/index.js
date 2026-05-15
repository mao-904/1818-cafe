require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Allow frontend to call this API
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// GET all available menu items
app.get('/api/menu', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
    res.json(items);
  } catch (err) {
    console.error('Menu error:', err);
    res.status(500).json({ error: 'Failed to load menu' });
  }
});

// POST new reservation
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
    console.error('Reservation error:', err);
    res.status(400).json({ error: 'Failed to create reservation' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));