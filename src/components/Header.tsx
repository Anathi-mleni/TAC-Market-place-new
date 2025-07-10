import React, { useState } from 'react';
import { Sparkles, User, LogOut, Settings, Shield, CreditCard, Building2, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, guestUser, currentUser, logout, logoutGuest, isAuthenticated, isGuestUser, isAdmin, isProvider } = useAuth();
  const navigate = useNavigate();

  const getRoleDisplay = () => {
    if (isAdmin) return 'Admin';
    if (isProvider) return 'Service Provider';
    return 'Client';
  };

  const getRoleColor = () => {
    if (isAdmin) return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
    if (isProvider) return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
  };

  const handlePricingClick = () => {
    navigate('/pricing');
  };

  const handleLogout = () => {
    if (isGuestUser) {
      logoutGuest();
    } else {
      logout();
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl border-b border-purple-700/50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl backdrop-blur-sm border border-white/30 shadow-xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  TAC Market Place
                </h1>
                <p className="text-sm text-purple-200 font-medium">Professional Service Marketplace</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span className="font-medium text-purple-100">AI-Powered Platform</span>
              </div>
              
              {/* Pricing Button */}
              <button
                onClick={handlePricingClick}
                className="relative group overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-full transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Pricing Plans</span>
                </div>
              </button>
              
              {/* User Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {isGuestUser && (
                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                      Guest User
                    </div>
                  )}
                  <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isGuestUser ? 'bg-orange-500' : getRoleColor()} shadow-lg`}>
                        {isAdmin ? (
                          <Shield className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">{currentUser?.name}</div>
                      <div className="text-xs text-purple-200">
                        {isGuestUser ? 'Guest' : getRoleDisplay()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isProvider && (
                      <button
                        onClick={() => {/* Navigate to provider dashboard */}}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                        title="Provider Settings"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                      title="Sign Out"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-6 py-3 rounded-full transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Get Started</span>
                    </div>
                  </button>
                  <div className="text-xs text-purple-200 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm border border-white/20">
                    <span className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Admin Access Available</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-indigo-900 to-purple-900 border-t border-purple-700/50 shadow-2xl z-50">
              <div className="px-4 py-6 space-y-4">
                <button
                  onClick={handlePricingClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pricing Plans</span>
                </button>
                
                {isAuthenticated ? (
                  <div className="space-y-3">
                    {isGuestUser && (
                      <div className="bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-sm text-center">
                        Signed in as Guest
                      </div>
                    )}
                    <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isGuestUser ? 'bg-orange-500' : getRoleColor()}`}>
                        {isAdmin ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{currentUser?.name}</div>
                        <div className="text-xs text-purple-200">{isGuestUser ? 'Guest' : getRoleDisplay()}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500/20 text-red-200 px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Get Started</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}