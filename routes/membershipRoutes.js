import express from 'express';

import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import {
  createPlan,
  getUserMemberships,
  subscribePlan,
} from '../controller/membershipController.js';

const router = express.Router();

// Admin creates membership plans
router.post('/plans', requireAuth, requireRole('admin'), createPlan);

// User subscribes to a plan
router.post(
  '/subscribe/:userId',
  requireAuth,
  requireRole('admin'),
  subscribePlan
);

// Fetch which plan user has
router.get('/user/:userId', requireAuth, getUserMemberships);

// Admin Action

router.get(
  '/user/:userId',
  requireAuth,
  requireRole('admin'),
  getUserMemberships
);

export default router;
