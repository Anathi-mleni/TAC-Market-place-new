import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useEmailService } from './useEmailService';
import { useGoogleSheets } from './useGoogleSheets';
import { AuthUser, LoginCredentials, RegisterData } from '../types/auth';

// Guest user interface
interface GuestUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isGuest: true;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { sendWelcomeEmail } = useEmailService();
  const { syncUserToSheets } = useGoogleSheets();

  useEffect(() => {
    // Check for guest user in localStorage
    const savedGuestUser = localStorage.getItem('guestUser');
    if (savedGuestUser) {
      try {
        setGuestUser(JSON.parse(savedGuestUser));
      } catch (error) {
        console.error('Error parsing guest user:', error);
        localStorage.removeItem('guestUser');
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
          // Clear guest user when real user signs in
          setGuestUser(null);
          localStorage.removeItem('guestUser');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('currentUser');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loginAsGuest = (guestData: { name: string; email: string; phone?: string }) => {
    const guest: GuestUser = {
      id: `guest_${Date.now()}`,
      name: guestData.name,
      email: guestData.email,
      phone: guestData.phone,
      isGuest: true
    };
    
    setGuestUser(guest);
    localStorage.setItem('guestUser', JSON.stringify(guest));
    return { success: true };
  };

  const logoutGuest = () => {
    setGuestUser(null);
    localStorage.removeItem('guestUser');
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setAuthError('Failed to load user profile');
        return;
      }

      if (data) {
        const authUser: AuthUser = {
          id: data.id,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: data.role,
          providerId: data.provider_id,
          createdAt: new Date(data.created_at),
          lastLogin: new Date(data.last_login),
          isActive: data.is_active,
        };
        setUser(authUser);
        localStorage.setItem('currentUser', JSON.stringify(authUser));

        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userId);
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      setAuthError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      // Bypass email confirmation for easier registration
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            name: data.name,
            phone: data.phone,
            role: data.role,
          }
        }
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (authData.user) {
        // Send welcome email (non-blocking)
        sendWelcomeEmail(data.email, data.name).catch(console.warn);

        // Auto-confirm user and fetch profile
        await fetchUserProfile(authData.user.id);

        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setGuestUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('guestUser');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Get current user (either authenticated or guest)
  const getCurrentUser = () => {
    return user || guestUser;
  };

  const updateUser = async (updates: Partial<AuthUser>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          phone: updates.phone,
          role: updates.role,
          provider_id: updates.providerId,
          last_login: new Date().toISOString()
        })
        .eq('id', user.id);

      if (!error) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Sync to Google Sheets (non-blocking)
        syncUserToSheets(updatedUser).catch(console.warn);
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const linkProviderAccount = async (providerId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ provider_id: providerId })
        .eq('id', user.id);

      if (!error) {
        const updatedUser = { ...user, providerId };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Error linking provider account:', err);
    }
  };

  const getAllUsers = async () => {
    if (!user || user.role !== 'admin') return [];

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getAllUsers:', err);
      return [];
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    if (!user || user.role !== 'admin') return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user status:', error);
      }
    } catch (err) {
      console.error('Error in updateUserStatus:', err);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send reset email' };
    }
  };

  return {
    user,
    guestUser,
    currentUser: getCurrentUser(),
    isLoading,
    authError,
    login,
    register,
    loginAsGuest,
    logoutGuest,
    logout,
    updateUser,
    linkProviderAccount,
    getAllUsers,
    updateUserStatus,
    requestPasswordReset,
    isAuthenticated: !!user || !!guestUser,
    isGuestUser: !!guestUser && !user,
    isAdmin: user?.role === 'admin',
    isProvider: user?.role === 'provider',
  };
}