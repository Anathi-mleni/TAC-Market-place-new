import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle, AlertCircle, Shield, Star } from 'lucide-react';
import { stripeProducts, StripeProduct } from '../stripe-config';
import { useAuth } from '../hooks/useAuth';
import { useStripe } from '../hooks/useStripe';

interface StripeCheckoutProps {
  selectedProduct?: StripeProduct;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StripeCheckout({ selectedProduct, onSuccess, onCancel }: StripeCheckoutProps) {
  const [success, setSuccess] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    selectedProduct?.priceId || stripeProducts[0].priceId
  );
  const { user } = useAuth();
  const { createCheckoutSession, loading, error } = useStripe();

  const handleCheckout = async () => {
    const product = stripeProducts.find(p => p.priceId === selectedProductId);
    if (!product) {
      alert('Selected product not found');
      return;
    }

    try {
      if (!user) {
        alert('Please sign in to continue with checkout');
        return;
      }
      await createCheckoutSession(product.priceId, product.mode);
    } catch (err: any) {
      console.error('Checkout failed:', err);
    }
  };

  const formatPrice = (product: StripeProduct) => {
    if (product.price === null) {
      return 'Contact for pricing';
    }
    return `${product.currency === 'ZAR' ? 'R' : '$'}${product.price}`;
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            onSuccess?.();
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Secure Checkout</h2>
            <p className="text-gray-600">Choose your plan and get started</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-green-500" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Trusted by 1000+ users</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {stripeProducts.map((product) => (
            <div
              key={product.priceId}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedProductId === product.priceId
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedProductId(product.priceId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    {product.mode === 'subscription' && (
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product)}
                    </span>
                    {product.mode === 'subscription' && product.price && (
                      <span className="text-sm text-gray-500">/ month</span>
                    )}
                    {product.mode === 'payment' && (
                      <span className="text-sm text-gray-500">one-time</span>
                    )}
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedProductId === product.priceId
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedProductId === product.priceId && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCheckout}
            disabled={loading || !user}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Complete Purchase'
            )}
          </button>

          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 text-center">
                Please sign in to continue with checkout
              </p>
            </div>
          )}

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>256-bit SSL</span>
            </div>
            <span>•</span>
            <span>Powered by Stripe</span>
            <span>•</span>
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}