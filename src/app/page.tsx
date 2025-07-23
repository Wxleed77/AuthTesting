'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import AuthForm from '../components/AuthForm';

export default function HomePage() {
  const router = useRouter();
  const [showAuthForm, setShowAuthForm] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard'); // Redirect to dashboard if already logged in
      } else {
        setShowAuthForm(true); // Ensure form is shown if not logged in
      }
    };
    checkUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/dashboard');
      } else {
        setShowAuthForm(true); // Show form if logged out
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      <h1 className="text-5xl font-extrabold text-indigo-800 mb-10 drop-shadow-md">
        Welcome to Recipe AI
      </h1>
      {showAuthForm && (
        <AuthForm onSuccess={() => setShowAuthForm(false)} />
      )}
      {!showAuthForm && (
        <p className="text-lg text-gray-700 mt-8 text-center">
          Please check your email for the magic link to log in.
        </p>
      )}
    </main>
  );
}
