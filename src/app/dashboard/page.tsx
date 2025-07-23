'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import AuthStatus from '../../components/AuthStatus';
import { User } from '@supabase/supabase-js'; // Import User type

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  // Initialize user state with User | null, matching Supabase's User type
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        router.push('/'); // Redirect to login if not authenticated
      } else {
        setUser(session.user); // Set the full user object
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes to handle logout or session expiry
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/'); // Redirect to login if session ends
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-lg text-indigo-600">Loading dashboard...</p>
      </div>
    );
  }

  // Safely access user.email only if user exists, otherwise fallback
  const userEmail = user?.email ?? 'N/A';

  return (
    <main className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-br from-purple-100 to-indigo-200">
      <header className="w-full max-w-4xl flex justify-between items-center mb-10 pb-4 border-b border-gray-300">
        <h1 className="text-4xl font-extrabold text-indigo-700">Dashboard</h1>
        <AuthStatus />
      </header>

      <section className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 md:p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome, {userEmail}!
        </h2>
        <p className="text-lg text-gray-700">
          You have successfully logged in using a magic link.
        </p>
        <p className="text-md text-gray-500 mt-4">
          This is your protected dashboard. Here you would integrate the AI Recipe Generator UI.
        </p>
        {/* Placeholder for where the Recipe Generator UI would go */}
        <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-indigo-600 font-medium">
            Your AI-Powered Recipe Generator UI will appear here!
          </p>
        </div>
      </section>
    </main>
  );
}
