export const stripeProducts = [
  {
    priceId: 'price_free_trial', // Free trial - no actual Stripe price needed
    name: 'Free Trial',
    description: 'Try our platform for free with basic features and limited AI generations',
    mode: 'subscription' as const,
    price: 0,
    currency: 'ZAR',
    features: [
      '3 AI profile generations',
      'Basic profile listing',
      'Limited booking features',
      'Community support'
    ]
  },
  {
    priceId: 'price_1RiVkACVwlXJEJ4LUrEYcLDe', // Individual subscription price ID
    name: 'Individual Subscription',
    description: 'Perfect for individual service providers looking to grow their business',
    mode: 'subscription' as const,
    price: 50,
    currency: 'ZAR',
    features: [
      'Unlimited AI profile generations',
      'Priority listing placement',
      'Advanced booking management',
      'Customer analytics',
      'Email support',
      'Social media content generation'
    ]
  },
  {
    priceId: 'price_1RiVhtCVwlXJEJ4LKPOZPcqh', // Business subscription price ID
    name: 'Business Subscription',
    description: 'Complete business solution with advanced features and priority support',
    mode: 'subscription' as const,
    price: 100,
    currency: 'ZAR',
    features: [
      'Everything in Individual',
      'Multi-location support',
      'Team member management',
      'Advanced analytics & reporting',
      'Custom branding',
      'API access',
      'Priority phone support',
      'Dedicated account manager'
    ]
  }
];

export type StripeProduct = typeof stripeProducts[number];