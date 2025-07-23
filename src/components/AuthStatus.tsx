'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js'; // Import User type

export default function AuthStatus() {
  const [user, setUser] = useState<User | null>(null); // Use Supabase's User type
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Initial check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      router.push('/'); // Redirect to home page after logout
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-gray-600">Loading auth status...</div>;
  }

  if (user) {
    // Safely access user.email, which can be string | undefined.
    // Use optional chaining and nullish coalescing to provide a fallback.
    const displayEmail = user.email ?? 'N/A';
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">Logged in as: <span className="font-semibold">{displayEmail}</span></span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
          disabled={loading}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="text-gray-600">Not logged in.</div>
  );
}
