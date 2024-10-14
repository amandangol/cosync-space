"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignIn, useSignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import Logo from '@components/common/Logo';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left side - Branding and Visual Element */}
      <div className="hidden w-1/2 flex-col justify-between p-12 lg:flex">
      <Link href="/">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center space-x-3"
        >
                   <Logo />

          <span className="text-3xl font-bold">SyncSpace</span>
        </motion.div>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -left-4 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-purple-700 to-pink-500 blur-3xl opacity-30"></div>
          <div className="absolute -right-4 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-700 to-green-500 blur-3xl opacity-30"></div>
          <h2 className="relative z-10 text-5xl font-extrabold leading-tight">
            Amplify your <br />
            workflow with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              unmatched speed
            </span>
          </h2>
        </motion.div>
        
        <div></div> 
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex w-full items-center justify-center bg-white px-4 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Welcome</h2>
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-black hover:bg-gray-800 text-white rounded-lg py-3 px-6 text-base font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
                formFieldInput: 
                  'block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black',
                formFieldLabel: 
                  'block text-sm font-medium text-gray-700 mb-1',
                card: 'shadow-none',
                header: 'hidden',
                footer: 'hidden',
              },
            }}
            redirectUrl="/syncspace-dashboard"
            afterSignInUrl="/syncspace-dashboard"
          />
          <div className="mt-8 flex items-center justify-between">
            <Link 
              href="/sign-up" 
              className="group inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              Create account
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-gray-600 hover:text-gray-500"
            >
              Forgot password?
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}