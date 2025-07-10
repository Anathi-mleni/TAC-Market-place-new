import React, { useState } from 'react';
import { Check, Zap, Crown, CreditCard, Shield, Users, Sparkles, Star, ArrowRight, Building2, Gift } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { StripeCheckout } from './StripeCheckout';
import { SubscriptionStatus } from './SubscriptionStatus';
import { OrderHistory } from './OrderHistory';
import { useAuth } from '../hooks/useAuth';
import { useStripe } from '../hooks/useStripe';

export function PricingPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(stripeProducts[0]);
  const [activeTab, setActiveTab] = useState<'plans' | 'subscription' | 'orders'>('plans');
  const { user } = useAuth();
  const { isSubscriptionActive } = useStripe();

  const handleSelectPlan = (product: typeof stripeProducts[0]) => {
    setSelectedProduct(product);
    setShowCheckout(true);
  };

  const getProductIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'free trial':
        return <Gift className="w-8 h-8" />;
      case 'individual subscription':
      case 'subscription':
        return <Zap className="w-8 h-8" />;
      case 'business subscription':
        return <Crown className="w-8 h-8" />;
      default:
        return <CreditCard className="w-8 h-8" />;
    }
  };

  const formatPrice = (product: typeof stripeProducts[0]) => {
    if (product.price === null || product.price === 0) {
      return 'Free';
    }
    const symbol = product.currency === 'ZAR' ? 'R' : '$';
    return `${symbol}${product.price}`;
  };

  const getCtaLabel = (product: typeof stripeProducts[0]) => {
    if (product.price === null || product.price === 0) return 'Start Free Trial';
    return 'Get Started';
  };

  const handleFreeTrial = () => {
    // For free trial, just show success message or redirect
    alert('Free trial activated! You can now use basic features.');
  };

  const handleSelectPlan = (product: typeof stripeProducts[0]) => {
    if (product.price === 0) {
      handleFreeTrial();
    } else {
      setSelectedProduct(product);
      setShowCheckout(true);
    }
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center p-4">
        <StripeCheckout
          selectedProduct={selectedProduct}
          onSuccess={() => setShowCheckout(false)}
          onCancel={() => setShowCheckout(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <Building2 className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-6 leading-tight">
            TAC Marketplace
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Elevate your business with our professional service platform. Connect with clients, 
            manage bookings, and grow your revenue with AI-powered tools.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-500 mb-12">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Secure & Trusted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>1000+ Providers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {user && (
          <div className="flex justify-center mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'plans', label: 'Plans & Pricing', icon: CreditCard },
                  { id: 'subscription', label: 'My Subscription', icon: Crown },
                  { id: 'orders', label: 'Order History', icon: Zap }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Plans */}
        {(!user || activeTab === 'plans') && (
          <div>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Choose Your Plan</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Select the perfect plan for your business needs. Upgrade or downgrade at any time with no hidden fees.
              </p>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
              {stripeProducts.map((product, index) => (
                <div
                  key={product.priceId}
                  className={`relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border overflow-hidden transform hover:scale-105 transition-all duration-500 ${
                    product.name.toLowerCase() === 'individual subscription'
                      ? 'border-slate-300 ring-4 ring-slate-200 ring-opacity-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Popular Badge */}
                  {product.name.toLowerCase() === 'individual subscription' && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-xl border-4 border-white">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-300" />
                          <span>Most Popular</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-10">
                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl flex items-center justify-center shadow-xl">
                        {getProductIcon(product.name)}
                      </div>
                    </div>

                    {/* Plan Info */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">{product.name}</h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>

                      <div className="mb-8">
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold text-slate-800">
                            {formatPrice(product)}
                          </span>
                          {product.mode === 'subscription' && product.price !== 0 && (
                            <span className="text-slate-600 ml-3 text-lg">/month</span>
                          )}
                        </div>
                        {product.mode === 'subscription' && (
                          <p className="text-sm text-slate-500 mt-2">Billed monthly, cancel anytime</p>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-10">
                      <ul className="space-y-4">
                        {product.features?.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-slate-700 leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(product)}
                      disabled={(isSubscriptionActive() && product.mode === 'subscription' && product.price > 0)}
                      className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                        product.name.toLowerCase() === 'individual subscription'
                          ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white hover:from-slate-800 hover:to-slate-700 shadow-xl hover:shadow-2xl transform hover:scale-105'
                          : product.price === 0
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-xl hover:shadow-2xl transform hover:scale-105'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <span>
                        {isSubscriptionActive() && product.mode === 'subscription' && product.price > 0
                          ? 'Already subscribed'
                          : getCtaLabel(product)}
                      </span>
                      {!(isSubscriptionActive() && product.mode === 'subscription' && product.price > 0) && (
                        <ArrowRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Features Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-12 mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-slate-800 mb-4">Why Choose TAC Marketplace?</h3>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Join thousands of successful service providers who trust our platform to grow their business
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">AI-Powered</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Generate professional profiles and content with our advanced AI technology
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">Secure & Reliable</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Bank-level security with 99.9% uptime guarantee for your peace of mind
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">Growing Community</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Connect with a thriving network of professionals and potential clients
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {user && activeTab === 'subscription' && (
          <div className="max-w-2xl mx-auto">
            <SubscriptionStatus />
          </div>
        )}

        {/* Orders Tab */}
        {user && activeTab === 'orders' && (
          <div className="max-w-4xl mx-auto">
            <OrderHistory />
          </div>
        )}

        {/* Footer CTA */}
        {(!user || activeTab === 'plans') && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl shadow-2xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                Join TAC Marketplace today and start growing your business with our powerful platform
              </p>
              <button 
                onClick={() => handleFreeTrial()}
                className="bg-white text-slate-800 font-bold py-4 px-8 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Free Trial Benefits */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl shadow-xl border border-green-200 p-12 mb-16">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Start Your Free Trial Today</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the power of our platform with no commitment. Upgrade anytime to unlock more features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">AI Profile Generation</h4>
                <p className="text-gray-600 leading-relaxed">
                  Get 3 free AI-generated professional profiles to showcase your services
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Basic Listings</h4>
                <p className="text-gray-600 leading-relaxed">
                  List your services and connect with potential customers in your area
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">No Credit Card</h4>
                <p className="text-gray-600 leading-relaxed">
                  Start immediately with no payment required. Upgrade when you're ready
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}