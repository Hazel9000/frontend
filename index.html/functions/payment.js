exports.handler = async (event) => {
  // In production: integrate with Stripe
  // const stripe = require('stripe')(process.env.STRIPE_KEY);
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};