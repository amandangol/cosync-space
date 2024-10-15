"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignUp, useSignUp } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left side - Branding and Visual Element */}
      <div className="hidden w-1/2 flex-col justify-between p-12 lg:flex relative overflow-hidden">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo-white.svg"
              alt="CoSyncSpace Logo"
              width={250} 
              height={100}
              className="text-indigo-600"
            />
          </Link>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Join the future <br />
            of teamwork with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
              CoSyncSpace
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your journey to seamless collaboration and boosted productivity.
          </p>
        </motion.div>

        <div className="absolute inset-0 z-0">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-purple-700 to-pink-500 blur-3xl opacity-20"></div>
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-700 to-green-500 blur-3xl opacity-20"></div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex w-full items-center justify-center bg-white px-8 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <h2 className="mb-2 text-center text-4xl font-bold text-gray-900">Create Account</h2>
          <p className="text-center text-gray-600 mb-8">Join CoSyncSpace and elevate your teamwork.</p>
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg py-3 px-6 text-base font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                formFieldInput: 
                  'block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
                formFieldLabel: 
                  'block text-sm font-medium text-gray-700 mb-1',
                card: 'shadow-lg rounded-xl p-6 bg-gradient-to-b from-white to-gray-50',
                header: 'hidden',
                footer: 'hidden',
              },
            }}
            redirectUrl="/cosyncspace-dashboard"
            afterSignUpUrl="/cosyncspace-dashboard"
          />
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Link 
              href="/sign-in" 
              className="group inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}