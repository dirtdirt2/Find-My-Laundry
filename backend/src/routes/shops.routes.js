import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

function parseServices(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function toShopDto(row) {
  return {
    id: Number(row.id),
    name: row.name,
    rating: Number(row.rating),
    services: parseServices(row.services),
    price: Number(row.price),
    distance: Number(row.distance),
    openUntil: row.open_until,
    image: row.image_url,
    address: row.address,
    description: row.description,
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, name, rating, services, price, distance,
        open_until, image_url, address, description
      FROM laundry_shops
      WHERE is_active = 1
      ORDER BY id ASC
    `);
    return res.json({ shops: rows.map(toShopDto) });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Shop ID must be a positive integer.' });
  }

  try {
    const [rows] = await pool.execute(`
      SELECT id, name, rating, services, price, distance,
        open_until, image_url, address, description
      FROM laundry_shops
      WHERE id = ? AND is_active = 1
      LIMIT 1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Laundry shop not found.' });
    }

    return res.json({ shop: toShopDto(rows[0]) });
  } catch (error) {
    return next(error);
  }
});

export default router;
