import logger from '../config/logger.js';
import { MembershipPlan } from '../model/MembershipPlan.js';
import { UserMembership } from '../model/UserMembership.js';

export const createPlan = async (req, res) => {
  try {
    const { name, price, durationInDays, description } = req.body;

    const plan = await MembershipPlan.create({
      name,
      price,
      durationInDays,
      description,
    });

    logger.info(`Membership plan created: ${plan.name}`);

    if (!plan) {
      logger.error('Failed to create membership plan');
      return res
        .status(400)
        .json({ success: false, message: 'Failed to create plan' });
    }

    return res
      .status(201)
      .json({ success: true, message: 'Membership plan created', plan });
  } catch (error) {
    logger.error(`Error creating membership plan: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }

  res.status(201).json({ success: true, message: 'Membership plan created' });
};

export const subscribePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.params.userId;

    logger.info(planId, 'Plan ID from request body');

    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    logger.info(`User ${userId} is attempting to subscribe to plan ${planId}`);

    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationInDays);

    const subscription = await UserMembership.create({
      userId: userId,
      planId,
      startDate,
      endDate,
      status: 'active',
      paymentStatus: 'paid', // later can integrate Stripe/Razorpay
    });

    if (!subscription) {
      logger.error('Failed to subscribe to plan');
      return res
        .status(400)
        .json({ success: false, message: 'Failed to subscribe to plan' });
    }

    logger.info(`User ${req.user._id} subscribed to plan ${plan.name}`);
    return res
      .status(201)
      .json({ success: true, message: 'Subscribed to plan', subscription });
  } catch (error) {
    logger.error(`Error subscribing to plan: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Fetch user memberships
export const getUserMemberships = async (req, res) => {
  try {
    const memberships = await UserMembership.find({ userId: req.params.userId })
      .populate('planId', 'name price durationInDays description')
      .populate('userId', 'fullName email');

    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
