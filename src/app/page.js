"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Layers, Shield, Menu } from 'lucide-react';
import Logo from '@components/common/Logo';
import Footer from '@/components/common/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <Footer></Footer> </div>
  );
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}
      animate={{ backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent' }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
          <span className="text-xl font-bold text-white">SyncSpace</span>
        </Link>
        <nav className="hidden space-x-8 md:flex">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </nav>
        <div className="hidden md:block">
          <Button variant="outline" className="mr-2 border-gray-700 text-black hover:bg-gray-300">
            Log In
          </Button>
          <Button className="bg-white text-black hover:bg-gray-300">
            Sign Up
          </Button>
        </div>
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>
      {isMenuOpen && (
        <motion.div 
          className="absolute left-0 right-0 bg-black p-4 shadow-md md:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <NavLink href="#features" className="block py-2">Features</NavLink>
          <NavLink href="#contact" className="block py-2">Contact</NavLink>
          <NavLink href="#pricing" className="block py-2">Pricing</NavLink>
          {/* <Link href="/SignInPage">
            <Button variant="outline" className="mt-2 w-full border-gray-700 text-gray-300 hover:bg-gray-800">
              Log In
            </Button>
          </Link>
          <Button className="mt-2 w-full bg-white text-black hover:bg-gray-200">
            Sign Up
          </Button> */}
        </motion.div>
      )}
    </motion.header>
  );
};

const NavLink = ({ href, children, className = "" }) => (
  <Link href={href} className={`text-gray-300 hover:text-white ${className}`}>
    {children}
  </Link>
);

const Hero = () => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black opacity-30"></div>
    <div className="text-center">
      <motion.h1 
        className="mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-6xl font-bold text-transparent sm:text-7xl"
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
        <Link href="/syncspace-dashboard">
          <Button className="bg-white text-black hover:bg-gray-200">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

const Features = () => (
  <section id="features" className="py-20 bg-gray-900">
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="mb-12 text-center text-4xl font-bold text-white">Key Features</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <FeatureCard
          icon={<Zap className="h-8 w-8 text-purple-400" />}
          title="Real-time Collaboration"
          description="Work together seamlessly with instant updates and live editing."
        />
        <FeatureCard
          icon={<Layers className="h-8 w-8 text-pink-400" />}
          title="Project Management"
          description="Organize tasks, set deadlines, and track progress effortlessly."
        />
        <FeatureCard
          icon={<Shield className="h-8 w-8 text-purple-400" />}
          title="Secure File Sharing"
          description="Share and store files with enterprise-grade encryption and security."
        />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="group relative overflow-hidden rounded-lg bg-gray-800 p-6 shadow-lg transition-all hover:shadow-xl"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-700 to-gray-800 opacity-0 transition-opacity group-hover:opacity-100"></div>
    <div className="mb-4">{icon}</div>
    <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
    <motion.div
      className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600"
      initial={{ width: '0%' }}
      whileInView={{ width: '100%' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
    />
  </motion.div>
);

const CallToAction = () => (
  <section id="contact" className="relative overflow-hidden bg-black py-20 text-white">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black"></div>
    <div className="mx-auto max-w-6xl px-4 text-center">
      <h2 className="mb-6 text-4xl font-bold">Ready to Get Started?</h2>
      <p className="mb-8 text-xl text-gray-300">Join thousands of teams already using our platform.</p>
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button className="bg-white text-black hover:bg-gray-200">
          Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  </section>
);

