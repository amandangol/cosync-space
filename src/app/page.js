"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Layers, Shield, ChevronDown } from 'lucide-react';
import Logo from '@components/common/Logo';
import Footer from '@/components/common/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

const Header = () => {
  return (
    <motion.header
      className="absolute top-0 left-0 right-0 z-50 text-white"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo-white.svg"
            alt="CoSyncSpace Logo"
            width={250} 
              height={100}
            className="text-indigo-600"
          />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
        </nav>
      </div>
    </motion.header>
  );
};

const Hero = () => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-900 via-gray-900 to-black"></div>
    <div className="text-center">
      <motion.h1 
        className="mb-6 bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-6xl font-bold text-transparent sm:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Simplify Your Workflow
      </motion.h1>
      <motion.p 
        className="mx-auto mb-10 max-w-2xl text-xl text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Streamline collaboration and boost productivity with our intuitive platform.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link href="/cosyncspace-dashboard">
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 px-8 py-3 rounded-full text-lg font-semibold">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
    <motion.div
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <ChevronDown className="h-8 w-8 text-gray-400 animate-bounce" />
    </motion.div>
  </section>
);

const Features = () => (
  <section id="features" className="py-20 bg-gradient-to-b from-gray-900 to-black">
    <div className="mx-auto max-w-6xl text-center px-4">
      <h2 className="mb-12 text-4xl font-bold text-white">Key Features</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <FeatureCard
          icon={<Zap className="h-12 w-12 text-indigo-400" />}
          title="Real-time Collaboration"
          description="Work together seamlessly with instant updates and live editing."
        />
        <FeatureCard
          icon={<Layers className="h-12 w-12 text-purple-400" />}
          title="Project Management"
          description="Organize tasks, set deadlines, and track progress effortlessly."
        />
        <FeatureCard
          icon={<Shield className="h-12 w-12 text-indigo-400" />}
          title="Secure File Sharing"
          description="Share and store files with enterprise-grade encryption and security."
        />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all hover:shadow-xl"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="mb-6 text-center">{icon}</div>
    <h3 className="mb-4 text-2xl font-semibold text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const CallToAction = () => (
  <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black py-20 text-white">
    <div className="mx-auto max-w-6xl px-4 text-center">
      <motion.h2 
        className="mb-6 text-4xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Ready to Get Started?
      </motion.h2>
      <motion.p 
        className="mb-8 text-xl text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Join thousands of teams already using our platform.
      </motion.p>
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Link href="/cosyncspace-dashboard">
          <Button className="bg-white text-indigo-900 hover:bg-gray-200 transition-colors duration-300 px-8 py-3 rounded-full text-lg font-semibold">
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);